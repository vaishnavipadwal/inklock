from sqlalchemy import (Column, Integer, String, Boolean, Text, TIMESTAMP,
                        ForeignKey, Enum, func, JSON)
from sqlalchemy.orm import relationship
from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    private_hash = Column(String(255), nullable=True)
    created_at = Column(TIMESTAMP, server_default=func.now())


class Book(Base):
    __tablename__ = "books"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(150), nullable=False)
    description = Column(Text, nullable=True)
    cover_image = Column(String(255), nullable=True)
    cover_color = Column(String(20), default="#4f46e5")
    is_locked = Column(Boolean, default=False)
    lock_hash = Column(String(255), nullable=True)
    is_deleted = Column(Boolean, default=False)
    created_at = Column(TIMESTAMP, server_default=func.now())

    pages = relationship("Page", back_populates="book", cascade="all, delete-orphan")


class Page(Base):
    __tablename__ = "pages"

    id = Column(Integer, primary_key=True, autoincrement=True)
    book_id = Column(Integer, ForeignKey("books.id", ondelete="CASCADE"), nullable=False)
    page_number = Column(Integer, nullable=False)
    title = Column(String(150), default="Untitled")
    prefs = Column(JSON, nullable=True)
    is_deleted = Column(Boolean, default=False)
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

    book = relationship("Book", back_populates="pages")
    blocks = relationship("PageBlock", back_populates="page",
                          cascade="all, delete-orphan", order_by="PageBlock.position")


class PageBlock(Base):
    __tablename__ = "page_blocks"

    id = Column(Integer, primary_key=True, autoincrement=True)
    page_id = Column(Integer, ForeignKey("pages.id", ondelete="CASCADE"), nullable=False)
    block_type = Column(Enum("text", "checklist", "code", "image"), default="text")
    content = Column(Text)
    position = Column(Integer, nullable=False, default=0)

    page = relationship("Page", back_populates="blocks")
