import uuid
from pathlib import Path
from typing import List, Optional

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlalchemy import func
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db
from ..security import hash_password
from .auth import get_current_user

router = APIRouter(prefix="/books", tags=["books"])

COVER_DIR = Path(__file__).resolve().parent.parent.parent / "uploads" / "covers"
COVER_DIR.mkdir(parents=True, exist_ok=True)
ALLOWED_TYPES = {"image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp"}
MAX_COVER_BYTES = 2 * 1024 * 1024
COVER_COLORS = {"#4f46e5", "#0ea5e9", "#14b8a6", "#f59e0b", "#ef4444", "#a855f7"}


def get_own_book(book_id: int, user: models.User, db: Session) -> models.Book:
    book = db.query(models.Book).filter(
        models.Book.id == book_id,
        models.Book.user_id == user.id,
        models.Book.is_deleted == False,
    ).first()
    if not book:
        raise HTTPException(404, "Book not found")
    return book


def get_own_page(book_id: int, page_id: int, user: models.User, db: Session) -> models.Page:
    get_own_book(book_id, user, db)
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
    if is_private and len(password) < 6:
        raise HTTPException(400, "A private book needs a password of at least 6 characters.")

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
def list_books(user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(models.Book).filter(
        models.Book.user_id == user.id, models.Book.is_deleted == False
    ).order_by(models.Book.created_at.desc()).all()


@router.put("/{book_id}", response_model=schemas.BookOut)
def update_book(book_id: int, data: schemas.BookIn,
                user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    book = get_own_book(book_id, user, db)
    book.title = data.title
    book.cover_color = data.cover_color
    db.commit()
    db.refresh(book)
    return book


@router.delete("/{book_id}", status_code=204)
def delete_book(book_id: int, user: models.User = Depends(get_current_user),
                db: Session = Depends(get_db)):
    book = get_own_book(book_id, user, db)
    book.is_deleted = True
    db.commit()


# ---------- Pages ----------
@router.post("/{book_id}/pages", response_model=schemas.PageOut, status_code=201)
def create_page(book_id: int, data: schemas.PageIn,
                user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    get_own_book(book_id, user, db)
    last = db.query(func.max(models.Page.page_number)).filter(
        models.Page.book_id == book_id).scalar() or 0
    page = models.Page(book_id=book_id, page_number=last + 1, title=data.title)
    db.add(page)
    db.commit()
    db.refresh(page)
    return page


@router.get("/{book_id}/pages", response_model=List[schemas.PageListOut])
def list_pages(book_id: int, user: models.User = Depends(get_current_user),
               db: Session = Depends(get_db)):
    get_own_book(book_id, user, db)
    return db.query(models.Page).filter(
        models.Page.book_id == book_id, models.Page.is_deleted == False
    ).order_by(models.Page.page_number).all()


@router.get("/{book_id}/pages/{page_id}", response_model=schemas.PageOut)
def get_page(book_id: int, page_id: int, user: models.User = Depends(get_current_user),
             db: Session = Depends(get_db)):
    return get_own_page(book_id, page_id, user, db)


@router.put("/{book_id}/pages/{page_id}", response_model=schemas.PageOut)
def update_page(book_id: int, page_id: int, data: schemas.PageUpdate,
                user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    page = get_own_page(book_id, page_id, user, db)
    if data.title is not None:
        page.title = data.title
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
def delete_page(book_id: int, page_id: int, user: models.User = Depends(get_current_user),
                db: Session = Depends(get_db)):
    page = get_own_page(book_id, page_id, user, db)
    page.is_deleted = True
    db.commit()
