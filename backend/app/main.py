"""
FastAPI application entry point. Wires together all routers.

Run with:
    uvicorn app.main:app --reload
"""

import anyio
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


@app.on_event("startup")
async def increase_thread_limit():
    """
    FastAPI runs sync (non-async) route functions in a background
    threadpool. The default cap is ~40 threads, which becomes a
    bottleneck under load when routes like register/login call
    bcrypt (CPU-heavy, blocking). Raising it lets more requests be
    processed in parallel instead of queueing.
    """
    limiter = anyio.to_thread.current_default_thread_limiter()
    limiter.total_tokens = 100


@app.get("/")
def root():
    return {"status": "ok", "docs": "/docs"}