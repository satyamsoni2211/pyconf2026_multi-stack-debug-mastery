# Part 3: The "Remote Attach" Pattern

> **Duration:** 45 minutes

## Overview

There are two fundamental ways to debug a Python process in VS Code:

| Mode | How it works | Best for |
|------|-------------|---------|
| **Launch** | VS Code *starts* the process | Simple scripts, plain `python main.py` |
| **Attach** | VS Code *connects* to a running process | `uv run`, Docker, gunicorn workers, any managed runner |

When your application is started by an external tool (like `uv run`, a
Makefile, or a container), VS Code cannot launch it directly.  Instead you
embed `debugpy` in the startup command, then tell VS Code to attach.

---

## 3.1 How debugpy Remote Attach Works

```
┌──────────────────────────────────────────────────────────────┐
│  Terminal                                                     │
│  $ uv run python -m debugpy --listen 5678 --wait-for-client  │
│          -m uvicorn main:app --reload                         │
│                                                               │
│  ← debugpy starts, then PAUSES waiting for VS Code           │
└──────────────────────────────────────────────────────────────┘
          │  TCP port 5678
          ▼
┌──────────────────────────────────────────────────────────────┐
│  VS Code                                                      │
│  "Python: Remote Attach (debugpy)"                            │
│  connect.host: localhost                                      │
│  connect.port: 5678                                           │
│                                                               │
│  ← VS Code connects, debugpy resumes, server starts          │
└──────────────────────────────────────────────────────────────┘
```

### The `--wait-for-client` flag

Without this flag debugpy starts and the application runs immediately.
Breakpoints set *before* the process reaches them are missed.

With `--wait-for-client`, the process freezes until VS Code attaches.
This guarantees you can set breakpoints anywhere, including in startup code.

---

## 3.2 Starting the Server in Debug Mode

Run this command (or use the VS Code task):

```bash
cd audient-backend
uv run python -m debugpy --listen 5678 --wait-for-client \
    -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

You will see:

```
Waiting for debugger attach on port 5678
```

The process is now paused.  Nothing will happen until VS Code attaches.

**Using the VS Code task:**  
Press `Ctrl+Shift+P` → **Tasks: Run Task** → **"Start: FastAPI (debugpy on :5678)"**

---

## 3.3 Attaching VS Code

1. Open the **Run and Debug** panel (`Ctrl+Shift+D`).
2. Select **"Python: Remote Attach (debugpy)"** from the dropdown.
3. Press **F5** (or click the green ▶ button).

VS Code connects to port 5678, debugpy resumes the process, and FastAPI finishes
starting:

```
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000
```

---

## 3.4 Setting a Breakpoint

Open `audient-backend/main.py` and find the `get_item` function:

```python
async def get_item(item_id: int) -> dict:
    items = { ... }
    # ← Set a breakpoint on the line below!
    item = items.get(item_id)
```

Click the gutter to the left of the `item = items.get(item_id)` line.
A red circle (●) appears.

Now visit <http://localhost:8000/api/items/1> in your browser.

VS Code will pause execution on your breakpoint and show:
- **Variables** panel – the value of `item_id` and `items`
- **Call stack** – how the request reached this function
- **Watch** – add `item_id` to watch live changes

---

## 3.5 Understanding pathMappings

`pathMappings` is critical when the running process has a *different* file path
than your editor.  Common scenarios:

- Running inside Docker (container path ≠ host path)
- Using a `uv` managed virtualenv (source is in the project, virtualenv is elsewhere)

For this workshop both paths are identical so the mapping is straightforward:

```jsonc
"pathMappings": [
  {
    "localRoot":  "${workspaceFolder}/audient-backend",  // ← your editor
    "remoteRoot": "${workspaceFolder}/audient-backend"   // ← the running process
  }
]
```

**Docker example** (for reference):

```jsonc
"pathMappings": [
  {
    "localRoot":  "${workspaceFolder}/audient-backend",
    "remoteRoot": "/app"   // ← path inside the container
  }
]
```

---

## 3.6 Exercise: Trace a Request End-to-End

1. Start the FastAPI server with debugpy (task or command above).
2. Attach VS Code using "Python: Remote Attach (debugpy)".
3. Set breakpoints in:
   - `get_item` – inspect `item_id`
   - `list_items` – inspect the `items` list before it is returned
4. Use `curl` or the browser to trigger each endpoint.
5. Use **Step Over** (F10) and **Step Into** (F11) to explore execution flow.
6. Open the **Debug Console** and evaluate `len(items)`.

---

## Key Takeaways

| Concept | What you learned |
|---------|-----------------|
| `debugpy --listen <port>` | Opens a TCP port for VS Code to connect to |
| `--wait-for-client` | Pauses the process until VS Code attaches |
| `"request": "attach"` | Tells VS Code to connect rather than launch |
| `pathMappings` | Maps editor paths to running-process paths |
| `justMyCode: true` | Skips stepping into library frames |
