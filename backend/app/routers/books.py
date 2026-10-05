import time
import shutil
import uuid
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import List, Optional

from fastapi import APIRouter, Depends, File, Form, Header, HTTPException, UploadFile
from jose import JWTError, jwt
from pydantic import BaseModel
from sqlalchemy import func
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db
from ..security import ALGORITHM, SECRET_KEY, hash_password, verify_password
from .auth import get_current_user
from .private import require_section

router = APIRouter(prefix="/books", tags=["books"])

COVER_COLORS = {"#4f46e5", "#0ea5e9", "#14b8a6", "#f59e0b", "#ef4444", "#a855f7"}
UPLOAD_DIR = Path(__file__).resolve().parent.parent.parent / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

BOOK_TOKEN_MINUTES = 30
MAX_ATTEMPTS = 5
LOCK_SECONDS = 300
_attempts = {}  # (user_id, book_id) -> [wrong_count, last_wrong_time]


class UnlockIn(BaseModel):
    password: str


def make_book_token(user_id: int, book_id: int) -> str:
    exp = datetime.now(timezone.utc) + timedelta(minutes=BOOK_TOKEN_MINUTES)
    payload = {"sub": str(user_id), "book": book_id, "typ": "book", "exp": exp}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def require_unlocked(book: models.Book, user: models.User, token: Optional[str]):
    if not book.is_locked:
        return
    try:
        p = jwt.decode(token or "", SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        raise HTTPException(403, "Book is locked")
    if p.get("typ") != "book" or p.get("book") != book.id or p.get("sub") != str(user.id):
        raise HTTPException(403, "Book is locked")


def get_own_book(book_id: int, user: models.User, db: Session) -> models.Book:
    book = db.query(models.Book).filter(
        models.Book.id == book_id,
        models.Book.user_id == user.id,
        models.Book.is_deleted == False,
    ).first()
    if not book:
        raise HTTPException(404, "Book not found")
    return book


def get_unlocked_book(book_id: int, user: models.User, db: Session, token: Optional[str]):
    book = get_own_book(book_id, user, db)
    require_unlocked(book, user, token)
    return book


def get_own_page(book_id: int, page_id: int, user: models.User, db: Session,
                 token: Optional[str]) -> models.Page:
    get_unlocked_book(book_id, user, db, token)
    page = db.query(models.Page).filter(
        models.Page.id == page_id,
        models.Page.book_id == book_id,
        models.Page.is_deleted == False,
    ).first()
    if not page:
        raise HTTPException(404, "Page not found")
    return page


# ---------- Books ----------
@router.post("", response_model=schemas.BookOut, status_code=201)
async def create_book(
    title: str = Form(...),
    description: str = Form(""),
    is_private: bool = Form(False),
    password: str = Form(""),
    cover_color: str = Form("#4f46e5"),
    cover: Optional[UploadFile] = File(None),
    user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    title = title.strip()
    if not title or len(title) > 150:
        raise HTTPException(400, "Book name is required (max 150 characters).")
    if is_private and not (6 <= len(password) <= 64):
        raise HTTPException(400, "A private book needs a password of 6 to 64 characters.")
    if is_private and not user.private_hash:
        raise HTTPException(400, "Set your private section password first.")

    cover_path = None
    if cover is not None and cover.filename:
        ext = ALLOWED_TYPES.get(cover.content_type)
        if not ext:
            raise HTTPException(400, "Cover must be a JPG, PNG or WebP image.")
        data = await cover.read(MAX_COVER_BYTES + 1)
        if len(data) > MAX_COVER_BYTES:
            raise HTTPException(400, "Cover image must be 2 MB or smaller.")
        filename = f"{uuid.uuid4().hex}{ext}"
        (COVER_DIR / filename).write_bytes(data)
        cover_path = f"/uploads/covers/{filename}"

    book = models.Book(
        user_id=user.id,
        title=title,
        description=description.strip() or None,
        cover_image=cover_path,
        cover_color=cover_color if cover_color in COVER_COLORS else "#4f46e5",
        is_locked=is_private,
        lock_hash=hash_password(password) if is_private else None,
    )
    db.add(book)
    db.commit()
    db.refresh(book)
    return book


@router.get("", response_model=List[schemas.BookOut])
def list_books(kind: str = "open", x_section_token: Optional[str] = Header(None),
               user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    private = kind == "private"
    if private:
        require_section(user, x_section_token)
    return db.query(models.Book).filter(
        models.Book.user_id == user.id,
        models.Book.is_deleted == False,
        models.Book.is_locked == private,
    ).order_by(models.Book.created_at.desc()).all()


@router.get("/{book_id}", response_model=schemas.BookOut)
def get_book(book_id: int, x_section_token: Optional[str] = Header(None),
             user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    book = get_own_book(book_id, user, db)
    if book.is_locked:
        require_section(user, x_section_token)
    return book


@router.post("/{book_id}/unlock")
def unlock_book(book_id: int, data: UnlockIn, x_section_token: Optional[str] = Header(None),
                user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    book = get_own_book(book_id, user, db)
    if not book.is_locked:
        return {"book_token": ""}
    require_section(user, x_section_token)

    key = (user.id, book.id)
    rec = _attempts.get(key)
    if rec and rec[0] >= MAX_ATTEMPTS:
        if time.time() - rec[1] < LOCK_SECONDS:
            raise HTTPException(429, "Too many wrong attempts. Try again in 5 minutes.")
        _attempts.pop(key, None)

    ok = len(data.password) <= 64 and verify_password(data.password, book.lock_hash)
    if not ok:
        rec = _attempts.setdefault(key, [0, time.time()])
        rec[0] += 1
        rec[1] = time.time()
        left = MAX_ATTEMPTS - rec[0]
        msg = "Wrong book password." if left > 0 else "Too many wrong attempts. Try again in 5 minutes."
        raise HTTPException(403, msg)

    _attempts.pop(key, None)
    return {"book_token": make_book_token(user.id, book.id)}


@router.put("/{book_id}", response_model=schemas.BookOut)
async def update_book(
    book_id: int,
    title: str = Form(...),
    description: str = Form(""),
    is_private: bool = Form(False),
    password: str = Form(""),
    cover_color: str = Form("#4f46e5"),
    cover: Optional[UploadFile] = File(None),
    remove_cover: bool = Form(False),
    user: models.User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    book = get_own_book(book_id, user, db)
    title = title.strip()
    if not title or len(title) > 150:
        raise HTTPException(400, "Book name is required (max 150 characters).")
    
    if is_private:
        if password: 
            if not (6 <= len(password) <= 64):
                raise HTTPException(400, "Password must be 6 to 64 characters.")
            book.lock_hash = hash_password(password)
        elif not book.is_locked:
            raise HTTPException(400, "A private book needs a password.")
        book.is_locked = True
    else:
        book.is_locked = False
        book.lock_hash = None

    if remove_cover:
        book.cover_image = None
    elif cover is not None and cover.filename:
        ext = ALLOWED_TYPES.get(cover.content_type)
        if not ext:
            raise HTTPException(400, "Cover must be a JPG, PNG or WebP image.")
        data = await cover.read(MAX_COVER_BYTES + 1)
        if len(data) > MAX_COVER_BYTES:
            raise HTTPException(400, "Cover image must be 2 MB or smaller.")
        filename = f"{uuid.uuid4().hex}{ext}"
        (COVER_DIR / filename).write_bytes(data)
        book.cover_image = f"/uploads/covers/{filename}"

    book.title = title
    book.description = description.strip() or None
    book.cover_color = cover_color if cover_color in COVER_COLORS else "#4f46e5"

    db.commit()
    db.refresh(book)
    return book


@router.delete("/{book_id}", status_code=204)
def delete_book(book_id: int, x_section_token: Optional[str] = Header(None),
                user: models.User = Depends(get_current_user),
                db: Session = Depends(get_db)):
    book = get_own_book(book_id, user, db)
    if book.is_locked:
        require_section(user, x_section_token)
    book.is_deleted = True
    db.commit()


# ---------- Pages (private books need the X-Book-Token header) ----------
@router.post("/{book_id}/pages", response_model=schemas.PageOut, status_code=201)
def create_page(book_id: int, data: schemas.PageIn,
                x_book_token: Optional[str] = Header(None),
                user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    get_unlocked_book(book_id, user, db, x_book_token)
    last = db.query(func.max(models.Page.page_number)).filter(
        models.Page.book_id == book_id, models.Page.is_deleted == False).scalar() or 0
    page = models.Page(book_id=book_id, page_number=last + 1, title=data.title)
    db.add(page)
    db.commit()
    db.refresh(page)
    return page


@router.get("/{book_id}/pages", response_model=List[schemas.PageListOut])
def list_pages(book_id: int, x_book_token: Optional[str] = Header(None),
               user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    get_unlocked_book(book_id, user, db, x_book_token)
    return db.query(models.Page).filter(
        models.Page.book_id == book_id, models.Page.is_deleted == False
    ).order_by(models.Page.page_number).all()


@router.get("/{book_id}/pages/{page_id}", response_model=schemas.PageOut)
def get_page(book_id: int, page_id: int, x_book_token: Optional[str] = Header(None),
             user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    return get_own_page(book_id, page_id, user, db, x_book_token)


@router.put("/{book_id}/pages/{page_id}", response_model=schemas.PageOut)
def update_page(book_id: int, page_id: int, data: schemas.PageUpdate,
                x_book_token: Optional[str] = Header(None),
                user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    page = get_own_page(book_id, page_id, user, db, x_book_token)
    if data.title is not None:
        page.title = data.title
    if data.prefs is not None:
        page.prefs = data.prefs
    if data.blocks is not None:
        page.blocks.clear()
        db.flush()
        for i, b in enumerate(data.blocks):
            page.blocks.append(models.PageBlock(
                block_type=b.block_type, content=b.content, position=i))
    db.commit()
    db.refresh(page)
    return page


@router.delete("/{book_id}/pages/{page_id}", status_code=204)
def delete_page(book_id: int, page_id: int, x_book_token: Optional[str] = Header(None),
                user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    page = get_own_page(book_id, page_id, user, db, x_book_token)
    page.is_deleted = True
    page.page_number = -page.id
    db.flush()

    # Re-order the remaining active pages sequentially
    active_pages = db.query(models.Page).filter(
        models.Page.book_id == book_id, models.Page.is_deleted == False
    ).order_by(models.Page.page_number).all()
    
    for i, p in enumerate(active_pages, start=1):
        p.page_number = i

    db.commit()


@router.post("/upload_image")
def upload_image(file: UploadFile = File(...), user: models.User = Depends(get_current_user)):
    ext = file.filename.split('.')[-1].lower()
    if ext not in ['jpg', 'jpeg', 'png', 'webp', 'gif']:
        ext = 'png'
    new_name = f"{uuid.uuid4().hex}.{ext}"
    out_path = UPLOAD_DIR / new_name
    with open(out_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    return {"url": f"http://127.0.0.1:8000/uploads/{new_name}"}