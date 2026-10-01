from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db
from .auth import get_current_user

router = APIRouter(prefix="/books", tags=["books"])


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
def create_book(data: schemas.BookIn, user: models.User = Depends(get_current_user),
                db: Session = Depends(get_db)):
    book = models.Book(user_id=user.id, title=data.title, cover_color=data.cover_color)
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
    book.is_deleted = True          # soft delete (goes to trash)
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
        page.blocks.clear()          # delete-orphan removes the old blocks
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