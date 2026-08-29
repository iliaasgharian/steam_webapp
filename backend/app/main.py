"""
FastAPI application entry point. Wires together all routers.

Run with:
    uvicorn app.main:app --reload
"""

from fastapi import FastAPI

from app.routers import games, genres_categories, companies, sales, auth, users

app = FastAPI(
    title="Steam Game Info & Analytics API",
    version="0.1.0",
)

app.include_router(games.router)
app.include_router(genres_categories.router)
app.include_router(companies.router)
app.include_router(sales.router)
app.include_router(auth.router)
app.include_router(users.router)


@app.get("/")
def root():
    return {"status": "ok", "docs": "/docs"}
