"""
Audient Backend – FastAPI application.

Workshop: Multi-Stack Debug Mastery (PyConf 2026)

Run normally:
    uv run uvicorn main:app --host 0.0.0.0 --port 8000 --reload

Run with debugpy (remote attach on port 5678):
    uv run python -m debugpy --listen 5678 --wait-for-client \
        -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
"""

from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Audient API",
    description="Backend API for the Audient workshop application.",
    version="1.0.0",
)

# Allow requests from the Vite dev server (http://localhost:5173) and the
# Electron renderer process during development.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:4173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------


@app.get("/", summary="Root")
async def root() -> dict:
    """Welcome endpoint – sanity check that the server is reachable."""
    return {"message": "Audient API is running", "version": "1.0.0"}


@app.get("/api/health", summary="Health check")
async def health() -> dict:
    """Lightweight health-check endpoint used by the frontend."""
    return {"status": "ok"}


@app.get("/api/items", summary="List items")
async def list_items() -> dict:
    """Return a sample list of items – replace with real DB logic."""
    items = [
        {"id": 1, "name": "Breakpoint", "description": "Where the magic starts"},
        {"id": 2, "name": "Stack Frame", "description": "A snapshot of execution"},
        {"id": 3, "name": "Watch Expression", "description": "Live variable inspection"},
    ]
    return {"items": items}


@app.get("/api/items/{item_id}", summary="Get item by ID")
async def get_item(item_id: int) -> dict:
    """Return a single item by its ID.

    This is a great place to set a breakpoint during the workshop to inspect
    the `item_id` variable before it is used.
    """
    items = {
        1: {"id": 1, "name": "Breakpoint", "description": "Where the magic starts"},
        2: {"id": 2, "name": "Stack Frame", "description": "A snapshot of execution"},
        3: {"id": 3, "name": "Watch Expression", "description": "Live variable inspection"},
    }
    # ← Set a breakpoint on the line below during Part 3 of the workshop!
    item = items.get(item_id)
    if item is None:
        from fastapi import HTTPException

        raise HTTPException(status_code=404, detail=f"Item {item_id} not found")
    return item
