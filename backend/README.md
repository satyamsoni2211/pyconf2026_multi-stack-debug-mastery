# audient-backend

FastAPI backend for the **Audient** workshop application.

## Requirements

- Python ≥ 3.11
- [`uv`](https://docs.astral.sh/uv/) – modern Python package manager

## Setup

```bash
# Install dependencies
uv sync

# Install dev extras (pytest, httpx)
uv sync --extra dev
```

## Running the Server

### Normal mode (no debugger)

```bash
uv run uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

You should see:

```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process ...
INFO:     Application startup complete.
```

### Debug mode (debugpy remote attach on port 5678)

```bash
uv run python -m debugpy --listen 5678 --wait-for-client \
    -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

The process will **pause** until VS Code attaches on port 5678.  
Use the **"Python: Remote Attach (debugpy)"** configuration in `launch.json`.

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Root welcome message |
| GET | `/api/health` | Health check |
| GET | `/api/items` | List all items |
| GET | `/api/items/{id}` | Get a single item by ID |

## Running Tests

```bash
uv run pytest
```
