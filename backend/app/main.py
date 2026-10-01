from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers import auth, books

app = FastAPI(title="InkLock API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React (Vite) dev server
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(books.router)

@app.get("/")
def health():
    return {"status": "InkLock API running"}