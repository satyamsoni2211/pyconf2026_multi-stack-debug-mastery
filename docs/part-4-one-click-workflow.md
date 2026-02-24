# Part 4: The One-Click Workflow

> **Duration:** 60 minutes

## Overview

In the previous parts you started servers manually and attached debuggers one at
a time.  In this section you will combine everything into **compound launch
configurations** – a single click that:

1. Starts FastAPI under debugpy  
2. Starts the Vite dev server  
3. Attaches the Python debugger  
4. Opens a Chrome (or Electron) debugger  

All four steps happen automatically, and stopping any one session stops them all.

---

## 4.1 Compound Configurations

A compound groups multiple launch configurations under a single name.

```jsonc
// .vscode/launch.json
{
  "compounds": [
    {
      "name": "Full Stack: FastAPI + Chrome",
      "configurations": [
        "Python: Remote Attach (debugpy)",
        "Chrome: Debug Frontend"
      ],
      "preLaunchTask": "Start: Full Stack (debugpy + Vite)",
      "stopAll": true
    }
  ]
}
```

| Field | Purpose |
|-------|---------|
| `name` | Label shown in the Run & Debug dropdown |
| `configurations` | List of individual configuration names to start |
| `preLaunchTask` | Task that runs *before* any configuration starts |
| `stopAll` | `true`: stopping one session stops all; `false`: sessions are independent |

---

## 4.2 The preLaunchTask Chain

```
User clicks ▶ "Full Stack: FastAPI + Chrome"
    │
    ▼
VS Code runs task: "Start: Full Stack (debugpy + Vite)"
    │
    ├─ parallel ─▶  task: "Start: FastAPI (debugpy on :5678)"
    │                        waits for "Application startup complete"
    │
    └─ parallel ─▶  task: "Start: Vite Dev Server"
                             waits for "ready in"
    │
    ▼  (both tasks resolved)
VS Code starts configurations simultaneously:
    ├─▶  "Python: Remote Attach (debugpy)"   → attaches to port 5678
    └─▶  "Chrome: Debug Frontend"            → opens Chrome at :5173
```

This chain means you never have to think about startup order again.

---

## 4.3 stopAll: true

When `stopAll` is `true`, clicking the ■ Stop button (or pressing `Shift+F5`)
in *any* of the compound's sessions terminates *all* sessions and their
associated tasks.

This prevents the common problem of accidentally leaving a debugpy port open
or a Vite server running after you finish debugging.

```jsonc
"stopAll": true  // ← clean exit for all processes
```

---

## 4.4 Exercise: Full Stack Debugging

### Prerequisites

Install frontend dependencies if you haven't yet:

```bash
cd audient-frontend
npm install
```

### Steps

1. Open the **Run and Debug** panel (`Ctrl+Shift+D`).
2. Select **"Full Stack: FastAPI + Chrome"** from the dropdown.
3. Press **F5**.

Watch the **Tasks** output panels:

```
[Start: FastAPI (debugpy on :5678)]  Waiting for debugger attach on port 5678
[Start: Vite Dev Server]             VITE v5.x.x  ready in XXX ms
[Start: FastAPI (debugpy on :5678)]  Application startup complete.
```

Once both servers are ready, VS Code:
- Attaches the Python debugger
- Opens a new Chrome window at <http://localhost:5173>

### Setting Cross-Stack Breakpoints

Set breakpoints in **both** files simultaneously:

**Python** – `audient-backend/main.py`:
```python
async def list_items() -> dict:
    items = [...]
    return {"items": items}   # ← breakpoint here
```

**JavaScript** – `audient-frontend/src/main.js`:
```javascript
const res = await fetch(`${API_BASE}/items`)  // ← breakpoint here
```

Reload the Chrome window.  Watch VS Code pause *first* in JavaScript (the
fetch call), then resume and pause *again* in Python (the list_items handler).

This is the heart of multi-stack debugging: a single user action traced through
two different language runtimes, all within one editor window.

---

## 4.5 Bonus Exercise: Electron

If you want to debug the Electron main process:

1. Select **"Full Stack: FastAPI + Electron"** from the dropdown.
2. Press **F5**.
3. Set a breakpoint in `audient-frontend/electron/main.cjs` inside `createWindow`.

The Electron main process pauses at your breakpoint.  The renderer is still
accessible via the DevTools window that Electron opens automatically.

---

## 4.6 Troubleshooting

| Problem | Solution |
|---------|---------|
| "Connection refused" on port 5678 | The FastAPI task didn't start. Check the task terminal for errors. |
| Chrome opens but shows blank page | Vite isn't ready yet. Wait a few seconds and reload. |
| Python breakpoints not hit | Check `pathMappings` in `launch.json` – `localRoot` must match your workspace. |
| `stopAll` doesn't kill Vite | The Vite task runs in a shell; kill it from the task's terminal panel. |
| Port 8000 already in use | Run `lsof -ti:8000 | xargs kill` in your terminal to free the port. |

---

## Key Takeaways

| Concept | What you learned |
|---------|-----------------|
| `compounds` | Group multiple debug sessions under one name |
| `preLaunchTask` | Automates server startup before debugging begins |
| `stopAll: true` | Ensures a clean exit with no orphan processes |
| Cross-stack breakpoints | Pause in JS and Python from the same editor session |
