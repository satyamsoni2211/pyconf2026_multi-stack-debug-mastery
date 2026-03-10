# Part 2: Bridging the Gap with Tasks

> **Duration:** 60 minutes

## Overview

VS Code Tasks are shell commands managed by the editor.  They are defined in
`.vscode/tasks.json` and can be run manually, triggered automatically, or used
as **pre-conditions** for debug sessions.

In this section you will explore every field of a background task and learn how
to write `problemMatcher` regex patterns that signal "service ready".

---

## 2.1 Anatomy of tasks.json

```jsonc
{
  "version": "2.0.0",
  "tasks": [
    {
      "label":   "Start: Vite Dev Server",  // ← name shown in the UI
      "type":    "shell",                   // ← run in a terminal
      "command": "npm run dev",             // ← the actual shell command
      "options": {
        "cwd": "${workspaceFolder}/frontend"  // ← working directory
      },
      "isBackground": true,               // ← keep alive after VS Code starts it
      "problemMatcher": { ... }           // ← "ready" detection
    }
  ]
}
```

### Key fields

| Field | Purpose |
|-------|---------|
| `label` | Human-readable name; used by `dependsOn` and `preLaunchTask` |
| `type` | `"shell"` (most common) or `"process"` |
| `command` | The command to run (string or array of strings) |
| `options.cwd` | Working directory for the command |
| `isBackground` | `true` for long-running servers; `false` (default) waits for exit |
| `problemMatcher` | Parses output to detect errors *and* readiness signals |
| `dependsOn` | List of task labels that must finish first |
| `presentation` | Controls how the terminal panel behaves |

---

## 2.2 isBackground: true

Long-running processes (dev servers, watchers) never exit.  Setting
`isBackground: true` tells VS Code:

1. Start the task and show its terminal.
2. Do **not** block waiting for the process to exit.
3. Watch output for the `problemMatcher.background.endsPattern` to consider
   the task "done" for dependency purposes.

Without `isBackground: true`, any task or debug configuration that
`dependsOn` or `preLaunchTask`-references this task would wait forever.

---

## 2.3 Deep Dive: problemMatcher

The `problemMatcher` has two jobs:

1. **Error detection** – parse compiler/linter output into the Problems panel.
2. **Background readiness** – signal when the background service has started.

For workshop purposes we only need the readiness signal.

```jsonc
"problemMatcher": {
  "owner": "vite",            // ← unique ID for this matcher
  "pattern": {
    "regexp": "^.*$",         // ← match any line (we don't parse errors here)
    "message": 0
  },
  "background": {
    "activeOnStart": true,    // ← activate immediately when task starts
    "beginsPattern": ".*VITE.*",          // ← "now I'm watching"
    "endsPattern":   ".*ready in.*"       // ← "service is ready"
  }
}
```

### How `beginsPattern` and `endsPattern` work together

```
Terminal output                         Matcher state
─────────────────────────────────────── ─────────────────────────
  VITE v5.4.0  building…               → beginsPattern matched – watching
  ✓  2 modules transformed.
  ready in 312 ms                       → endsPattern matched – DONE ✓
  ➜  Local:   http://localhost:5173/
```

Once the `endsPattern` matches, VS Code considers the task resolved and any
dependent task or debug session can proceed.

---

## 2.4 Regex Patterns for Common Servers

| Server | beginsPattern | endsPattern |
|--------|--------------|-------------|
| Vite | `.*VITE.*` | `.*ready in.*` |
| uvicorn (normal) | `.*Started reloader.*` | `.*Application startup complete.*` |
| uvicorn + debugpy | `.*Waiting for client.*` | `.*Application startup complete.*` |
| webpack | `.*webpack.*` | `.*compiled successfully.*` |
| Next.js | `.*Starting.*` | `.*Ready.*` |

---

## 2.5 Exercise: Observe the Vite Task

1. Open `.vscode/tasks.json` and read the **"Start: Vite Dev Server"** task.
2. Make sure you have installed frontend dependencies:
   - Press `Ctrl+Shift+P` → **Tasks: Run Task** → **"Install: Frontend Dependencies"**
3. Run **Tasks: Run Task** → **"Start: Vite Dev Server"**
4. Watch the terminal – when `ready in` appears, VS Code marks the task done.
5. Open a second terminal and run the FastAPI task to see both servers running.

---

## 2.6 Composite Tasks with dependsOn

The **"Start: Full Stack (debugpy + Vite)"** task shows how to start multiple
services in parallel:

```jsonc
{
  "label": "Start: Full Stack (debugpy + Vite)",
  "dependsOn": [
    "Start: FastAPI (debugpy on :5678)",
    "Start: Vite Dev Server"
  ],
  "dependsOrder": "parallel",   // ← start both at the same time
  "problemMatcher": []
}
```

`"dependsOrder": "parallel"` starts all listed tasks simultaneously.
Use `"sequence"` if one task must finish before the next begins.

---

## Key Takeaways

| Concept | What you learned |
|---------|-----------------|
| `isBackground: true` | Keeps the task alive; does not block dependents |
| `problemMatcher.background` | Regex-based "service ready" detection |
| `beginsPattern` / `endsPattern` | The two-phase readiness pattern |
| `dependsOn` + `dependsOrder` | Composing tasks for parallel service startup |
