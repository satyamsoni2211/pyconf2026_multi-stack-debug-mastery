# Part 1: The Modern Python Environment

> **Duration:** 45 minutes

## Overview

In this section you will set up the `audient-backend` project using **uv**, a
modern Python package manager that replaces pip + venv with a single fast tool.
You will also run your first VS Code task to start FastAPI.

---

## 1.1 Project Structure

The backend lives in `audient-backend/`:

```
audient-backend/
├── pyproject.toml   ← project metadata + dependencies (uv-compatible)
├── main.py          ← FastAPI application
├── tests/
│   └── test_main.py ← pytest test suite
└── README.md
```

`pyproject.toml` is the single source of truth for Python dependencies.
`uv sync` reads it and creates a reproducible virtual environment.

---

## 1.2 Installing uv

```bash
# macOS / Linux
curl -LsSf https://astral.sh/uv/install.sh | sh

# Windows (PowerShell)
irm https://astral.sh/uv/install.ps1 | iex
```

Verify:

```bash
uv --version
# uv 0.4.x
```

---

## 1.3 Setting Up the Backend

```bash
cd audient-backend

# Create a virtual environment and install all dependencies
uv sync

# Install dev extras (pytest, httpx)
uv sync --extra dev
```

uv creates a `.venv/` directory.  You never need to activate it manually – all
`uv run` commands automatically use the project virtualenv.

---

## 1.4 Running FastAPI Manually

```bash
uv run uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Expected output:

```
INFO:     Started reloader process [12345] using WatchFiles
INFO:     Started server process [12346]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
```

Visit <http://localhost:8000/api/health> – you should see `{"status":"ok"}`.

---

## 1.5 Exercise: Create a Basic Task

Open `.vscode/tasks.json` and find the task labelled **"Start: FastAPI (normal)"**.

Run it from VS Code:
1. Press `Ctrl+Shift+P` → **Tasks: Run Task**
2. Select **"Start: FastAPI (normal)"**

The integrated terminal panel should appear and you should see the same
`Application startup complete.` message.

### What to observe

- The task uses `"isBackground": true` – VS Code does not wait for it to exit.
- The `problemMatcher.background.endsPattern` regex `".*Application startup complete.*"`
  is what tells VS Code "the server is ready".

---

## 1.6 Running Tests

```bash
cd audient-backend
uv run pytest -v
```

All tests should pass before you continue to Part 2.

---

## Key Takeaways

| Concept | What you learned |
|---------|-----------------|
| `uv sync` | Creates a reproducible virtualenv from `pyproject.toml` |
| `uv run <cmd>` | Runs a command inside the project virtualenv without activating it |
| VS Code Task (basic) | Automates shell commands so you don't need a separate terminal |
