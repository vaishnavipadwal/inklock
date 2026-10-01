from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db
from ..security import (ALGORITHM, SECRET_KEY, create_access_token,
                        hash_password, verify_password)

router = APIRouter(prefix="/auth", tags=["auth"])
bearer = HTTPBearer()


def get_current_user(
    creds: HTTPAuthorizationCredentials = Depends(bearer),
    db: Session = Depends(get_db),
) -> models.User:
    try:
        payload = jwt.decode(creds.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = int(payload["sub"])
    except (JWTError, KeyError, ValueError):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid or expired token")
    user = db.get(models.User, user_id)
    if not user:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "User not found")
    return user


@router.post("/register", response_model=schemas.UserOut, status_code=201)
def register(data: schemas.RegisterIn, db: Session = Depends(get_db)):
    email = data.email.lower()
    if db.query(models.User).filter(models.User.email == email).first():
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Email already registered")
    user = models.User(
        name=data.name, email=email, password_hash=hash_password(data.password)
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.post("/login", response_model=schemas.TokenOut)
def login(data: schemas.LoginIn, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == data.email.lower()).first()
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Wrong email or password")
    return {"access_token": create_access_token(user.id)}


@router.get("/me", response_model=schemas.UserOut)
def me(current_user: models.User = Depends(get_current_user)):
    return current_user