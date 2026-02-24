# 🎧 Multi-Stack Debug Mastery — PyConf 2026

> **Workshop:** Orchestrating VS Code for Full-Stack Python Debugging  
> **Conference:** PyConf 2026

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
│   ├── launch.json      ← Debug configurations (Remote Attach, Chrome, Electron, Compounds)
│   └── tasks.json       ← Background service tasks (FastAPI, Vite, composite)
│
├── audient-backend/     ← FastAPI application (Python / uv)
│   ├── pyproject.toml
│   ├── main.py
│   └── tests/
│
├── audient-frontend/    ← Vite + Electron application (Node.js)
│   ├── electron/
│   │   └── main.cjs     ← Electron main process
│   ├── src/
│   │   ├── main.js      ← Renderer / browser entry point
│   │   └── style.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── docs/
    ├── part-1-modern-python-env.md
    ├── part-2-tasks.md
    ├── part-3-remote-attach.md
    └── part-4-one-click-workflow.md
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
cd audient-backend
uv sync --extra dev
uv run pytest -v          # verify everything works
```

### 2. Frontend setup

```bash
cd audient-frontend
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

---

## Available Debug Configurations

| Configuration | Description |
|--------------|-------------|
| `Python: Remote Attach (debugpy)` | Attach to FastAPI running under debugpy on port 5678 |
| `Python: Launch FastAPI (direct)` | VS Code launches FastAPI directly (Part 1 exercise) |
| `Chrome: Debug Frontend` | Attach Chrome debugger to Vite dev server |
| `Electron: Debug Main Process` | Debug the Electron main process |
| **`Full Stack: FastAPI + Chrome`** | **One-click compound – primary workshop exercise** |
| `Full Stack: FastAPI + Electron` | One-click compound – Electron bonus exercise |

## Available Tasks

| Task | Description |
|------|-------------|
| `Start: FastAPI (normal)` | Run FastAPI without the debugger |
| `Start: FastAPI (debugpy on :5678)` | Run FastAPI under debugpy, listening on port 5678 |
| `Start: Vite Dev Server` | Start the Vite dev server on port 5173 |
| `Install: Frontend Dependencies` | Run `npm install` in audient-frontend |
| `Start: Full Stack (debugpy + Vite)` | Start both servers in parallel (used by compound configs) |
