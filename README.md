# 🎧 Multi-Stack Debug Mastery — PyConf 2026

> **Workshop:** Orchestrating VS Code for Full-Stack Python Debugging
> **Conference:** PyConf 2026
> **Live Presentation:** [https://pyconf2026.satyamsoni.com](https://pyconf2026.satyamsoni.com)

Stop juggling terminal tabs. Turn VS Code into a one-click debugging engine
for your FastAPI + Vite/Electron stack.

---

## What You Will Learn

| Topic | Workshop Part |
|-------|--------------|
| Modern Python dependency management with **uv** | Part 1 |
| Automating background services with `tasks.json` | Part 2 |
| Attaching VS Code to processes managed by external tools (**debugpy Remote Attach**) | Part 3 |
| Combining Python + JavaScript debuggers into a single **compound** configuration | Part 4 |

---

## Repository Structure

```
.
├── .vscode/
│   ├── launch.json         ← Debug configurations (Remote Attach, Chrome, Electron, Compounds)
│   └── tasks.json          ← Background service tasks (FastAPI, Vite, composite)
│
├── backend/                ← FastAPI application (Python / uv)
│   ├── pyproject.toml
│   ├── uv.lock
│   ├── main.py
│   └── tests/
│
├── frontend/               ← Vite + React application (Node.js)
│   ├── electron/
│   │   └── main.cjs       ← Electron main process
│   ├── src/
│   │   ├── main.jsx       ← React entry point
│   │   ├── App.jsx        ← Main React component
│   │   ├── App.css        ← Styles
│   │   └── components/
│   │       ├── Header.jsx    ← "Audient" header
│   │       ├── HealthCheck.jsx  ← Backend health status
│   │       └── ItemsList.jsx    ← Items list from API
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
```

---

## Prerequisites

- **VS Code** (latest stable) with the following extensions:
  - [Python](https://marketplace.visualstudio.com/items?itemName=ms-python.python) (includes debugpy)
  - [Debugger for Chrome](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome) or built-in JS debugger
- **Python ≥ 3.11** + [uv](https://docs.astral.sh/uv/)
- **Node.js ≥ 20** + npm ≥ 10
- Basic knowledge of Python, FastAPI, and the command line

---

## Quick Start

### 1. Backend setup

```bash
cd backend
uv sync --extra dev
uv run pytest -v          # verify everything works
```

### 2. Frontend setup

```bash
cd frontend
npm install
```

### 3. One-click debugging

1. Open this folder in VS Code (`code .` from the repo root).
2. Open the **Run and Debug** panel (`Ctrl+Shift+D`).
3. Select **"Full Stack: FastAPI + Chrome"**.
4. Press **F5**.

VS Code will automatically start the FastAPI server (with debugpy) and the
Vite dev server, then attach both a Python and a Chrome debugger.

---

## Workshop Guide

Work through the parts in order:

1. [Part 1 – The Modern Python Environment](docs/part-1-modern-python-env.md)
2. [Part 2 – Bridging the Gap with Tasks](docs/part-2-tasks.md)
3. [Part 3 – The Remote Attach Pattern](docs/part-3-remote-attach.md)
4. [Part 4 – The One-Click Workflow](docs/part-4-one-click-workflow.md)

Additional resources:
- [Tasks Guide](docs/tasks-guide.md) - Quick reference for VS Code tasks

---

## Available Debug Configurations

| Configuration | Description |
|--------------|-------------|
| `Python: File` | Debug a standalone Python script |
| `Python: Module` | Debug a module: python -m module |
| `Python: Pytest` | Debug pytest tests |
| `Python: Django` | Debug Django applications |
| `Python: Remote Attach` | Attach to running Python process (debugpy on port 5678) |
| `Chrome: Launch` | Launch Chrome for debugging |
| `Chrome: Attach` | Attach to running Chrome session |
| `Node: Launch` | Debug Node.js application |
| `Electron: Main` | Debug Electron main process |
| `Electron: Renderer` | Debug Electron renderer process |
| **`Full Stack: FastAPI + Chrome`** | **One-click compound – primary workshop exercise** |
| `Full Stack: FastAPI + Electron` | One-click compound – Electron bonus exercise |

## Available Tasks

| Task | Description |
|------|-------------|
| `Start: FastAPI (normal)` | Run FastAPI without the debugger |
| `Start: FastAPI (debugpy on :5678)` | Run FastAPI under debugpy, listening on port 5678 |
| `Start: Vite Dev Server` | Start the Vite dev server on port 5173 |
| `Install: Frontend Dependencies` | Run `npm install` in frontend |
| `Start: Full Stack (debugpy + Vite)` | Start both servers in parallel (used by compound configs) |

---

## Presentation

The workshop presentation is available online:

**Live URL:** [https://pyconf2026.satyamsoni.com](https://pyconf2026.satyamsoni.com)