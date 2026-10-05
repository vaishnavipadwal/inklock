import time
from datetime import datetime, timedelta, timezone
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from jose import JWTError, jwt
from pydantic import BaseModel
from sqlalchemy.orm import Session

from .. import models
from ..database import get_db
from ..security import ALGORITHM, SECRET_KEY, hash_password, verify_password
from .auth import get_current_user

router = APIRouter(prefix="/private", tags=["private"])

SECTION_MINUTES = 30
MAX_ATTEMPTS = 5
LOCK_SECONDS = 300
_attempts = {}  # user_id -> [wrong_count, last_wrong_time]


class PasswordIn(BaseModel):
    password: str


def make_section_token(user_id: int) -> str:
    exp = datetime.now(timezone.utc) + timedelta(minutes=SECTION_MINUTES)
    payload = {"sub": str(user_id), "typ": "section", "exp": exp}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def require_section(user: models.User, token: Optional[str]):
    try:
        p = jwt.decode(token or "", SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        raise HTTPException(403, "Private section is locked")
    if p.get("typ") != "section" or p.get("sub") != str(user.id):
        raise HTTPException(403, "Private section is locked")


@router.get("/status")
def status(user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    count = db.query(models.Book).filter(
        models.Book.user_id == user.id,
        models.Book.is_deleted == False,
        models.Book.is_locked == True,
    ).count()
    return {"has_password": bool(user.private_hash), "private_count": count}


@router.post("/setup")
def setup(data: PasswordIn, user: models.User = Depends(get_current_user),
          db: Session = Depends(get_db)):
    if user.private_hash:
        raise HTTPException(409, "The private section already has a password.")
    if not 6 <= len(data.password) <= 64:
        raise HTTPException(400, "Password must be 6 to 64 characters.")
    if verify_password(data.password, user.password_hash):
        raise HTTPException(400, "Use a different password than your account password.")
    user.private_hash = hash_password(data.password)
    db.commit()
    return {"section_token": make_section_token(user.id)}


@router.post("/unlock")
def unlock(data: PasswordIn, user: models.User = Depends(get_current_user)):
    if not user.private_hash:
        raise HTTPException(400, "Set up the private section first.")

    rec = _attempts.get(user.id)
    if rec and rec[0] >= MAX_ATTEMPTS:
        if time.time() - rec[1] < LOCK_SECONDS:
            raise HTTPException(429, "Too many wrong attempts. Try again in 5 minutes.")
        _attempts.pop(user.id, None)

    if len(data.password) > 64 or not verify_password(data.password, user.private_hash):
        rec = _attempts.setdefault(user.id, [0, time.time()])
        rec[0] += 1
        rec[1] = time.time()
        if rec[0] >= MAX_ATTEMPTS:
            raise HTTPException(429, "Too many wrong attempts. Try again in 5 minutes.")
        raise HTTPException(403, "Wrong private section password.")

    _attempts.pop(user.id, None)
    return {"section_token": make_section_token(user.id)}
