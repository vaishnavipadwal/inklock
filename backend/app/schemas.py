from typing import List, Literal, Optional

from pydantic import BaseModel, EmailStr, Field


class RegisterIn(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    password: str = Field(min_length=8, max_length=64)


class LoginIn(BaseModel):
    email: EmailStr
    password: str


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr

    model_config = {"from_attributes": True}


class BookIn(BaseModel):
    title: str = Field(min_length=1, max_length=150)
    cover_color: str = "#4f46e5"


class BookOut(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    cover_image: Optional[str] = None
    cover_color: str
    is_locked: bool

    model_config = {"from_attributes": True}


class BlockIn(BaseModel):
    block_type: Literal["text", "checklist", "code", "image"] = "text"
    content: str = ""
    position: int = 0


class BlockOut(BlockIn):
    id: int

    model_config = {"from_attributes": True}


class PageIn(BaseModel):
    title: str = Field(default="Untitled", max_length=150)


class PageUpdate(BaseModel):
    title: Optional[str] = Field(default=None, max_length=150)
    blocks: Optional[List[BlockIn]] = None


class PageListOut(BaseModel):
    id: int
    page_number: int
    title: str

    model_config = {"from_attributes": True}


class PageOut(PageListOut):
    blocks: List[BlockOut] = []
