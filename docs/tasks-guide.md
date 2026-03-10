# VS Code Tasks Configuration Guide

## Overview

This document explains the `tasks.json` configuration for the Multi-Stack Debug Mastery workshop. Tasks automate background services that need to run before debugging can begin.

---

## Table of Contents

1. [Task Types](#task-types)
2. [Task Properties](#task-properties)
3. [Problem Matchers](#problem-matchers)
4. [Task Dependencies](#task-dependencies)
5. [Common Task Examples](#common-task-examples)

---

## Task Types

VS Code supports three main task types:

### 1. `shell` Tasks

Execute commands in a shell (bash, zsh, PowerShell).

```json
{
  "type": "shell",
  "command": "uv run python main.py"
}
```

**Use for:** Any command-line tool, scripts, package managers

### 2. `process` Tasks

Run a process directly without a shell.

```json
{
  "type": "process",
  "command": "python",
  "args": ["main.py"]
}
```

**Use for:** Simple executables, when shell features aren't needed

### 3. NPM Tasks (Built-in)

Shorthand for npm scripts defined in `package.json`.

```json
{
  "type": "npm",
  "script": "dev"
}
```

**Use for:** Running npm/yarn scripts defined in your project

---

## Task Properties

### Essential Properties

| Property | Type | Description |
|----------|------|-------------|
| `label` | string | Unique identifier shown in Command Palette |
| `type` | string | `shell`, `process`, or `npm` |
| `command` | string | The command to execute |
| `args` | array | Command-line arguments |

### Execution Properties

| Property | Type | Description |
|----------|------|-------------|
| `options.cwd` | string | Working directory for the task |
| `options.env` | object | Environment variables |
| `options.shell` | object | Shell configuration |

### Background Tasks

| Property | Type | Description |
|----------|------|-------------|
| `isBackground` | boolean | Keep task running after startup |
| `problemMatcher` | object | Detect when task is ready |

### Presentation Properties

| Property | Type | Description |
|----------|------|-------------|
| `presentation.reveal` | string | When to show terminal: `always`, `never`, `silent` |
| `presentation.panel` | string | Which panel: `shared`, `dedicated`, `new` |
| `presentation.group` | string | Group tasks in terminal dropdown |

---

## Problem Matchers

Problem matchers parse command output to:
1. Detect when a service is ready
2. Report errors in the Problems panel
3. Enable task chaining

### Basic Structure

```json
{
  "problemMatcher": {
    "owner": "custom",
    "pattern": { ... },
    "background": { ... }
  }
}
```

### Background Task Matcher

For background tasks (dev servers), use `background` section:

```json
{
  "problemMatcher": {
    "owner": "fastapi",
    "pattern": {
      "regexp": "^.*$",
      "message": 0
    },
    "background": {
      "activeOnStart": true,
      "beginsPattern": ".*Started reloader process.*",
      "endsPattern": ".*Application startup complete.*"
    }
  }
}
```

**Key patterns:**
- `beginsPattern`: Regex that matches when task starts
- `endsPattern`: Regex that matches when task is ready

### Error Parsing Matcher

To report errors in Problems panel:

```json
{
  "problemMatcher": {
    "owner": "typescript",
    "pattern": {
      "regexp": "^([^\\s].*)\\((\\d+),(\\d+)\\):\\s+(error|warning|info)\\s+(TS\\d+):\\s+(.*)$",
      "file": 1,
      "line": 2,
      "column": 3,
      "severity": 4,
      "code": 5,
      "message": 6
    }
  }
}
```

---

## Task Dependencies

### Running Tasks in Parallel

```json
{
  "label": "Start Full Stack",
  "dependsOn": ["Start Backend", "Start Frontend"],
  "dependsOrder": "parallel"
}
```

### Running Tasks Sequentially

```json
{
  "label": "Start Database First",
  "dependsOn": ["Start Database", "Start Backend"],
  "dependsOrder": "sequence"
}
```

---

## Common Task Examples

### 1. FastAPI (Normal Mode)

```json
{
  "label": "Start: FastAPI (normal)",
  "type": "shell",
  "command": "uv run fastapi dev --port 8080",
  "cwd": "${workspaceFolder}/backend",
  "isBackground": true,
  "problemMatcher": {
    "owner": "fastapi",
    "background": {
      "activeOnStart": true,
      "beginsPattern": ".*FastAPI\\s+Starting development server.*",
      "endsPattern": ".*Application startup complete.*"
    }
  }
}
```

### 2. FastAPI with debugpy

```json
{
  "label": "Start: FastAPI (debugpy)",
  "type": "shell",
  "command": "uv run debugpy --listen 5678 --wait-for-client -m fastapi dev --port 8081",
  "cwd": "${workspaceFolder}/backend",
  "isBackground": true,
  "problemMatcher": {
    "owner": "fastapi-debugpy",
    "background": {
      "activeOnStart": true,
      "beginsPattern": ".*Waiting for client.*",
      "endsPattern": ".*Application startup complete.*"
    }
  }
}
```

### 3. Vite Dev Server

```json
{
  "label": "Start: Vite Dev Server",
  "type": "shell",
  "command": "npm run dev",
  "cwd": "${workspaceFolder}/frontend",
  "isBackground": true,
  "problemMatcher": [
    "$tsc-watch",
    {
      "owner": "vite",
      "pattern": {
        "regexp": "^.*$",
        "message": 0
      },
      "background": {
        "activeOnStart": true,
        "beginsPattern": ".*VITE.*",
        "endsPattern": ".*ready in.*"
      }
    }
  ]
}
```

### 4. npm install

```json
{
  "label": "Install: Dependencies",
  "type": "shell",
  "command": "npm install",
  "cwd": "${workspaceFolder}/frontend",
  "presentation": {
    "reveal": "always",
    "panel": "shared",
    "close": true
  }
}
```

### 5. Django

```json
{
  "label": "Start: Django",
  "type": "shell",
  "command": "python manage.py runserver",
  "cwd": "${workspaceFolder}",
  "isBackground": true,
  "problemMatcher": {
    "owner": "django",
    "background": {
      "activeOnStart": true,
      "beginsPattern": ".*Starting development server.*",
      "endsPattern": ".*Starting development server at.*"
    }
  }
}
```

### 6. Docker Compose

```json
{
  "label": "Start: Docker Compose",
  "type": "shell",
  "command": "docker-compose up",
  "cwd": "${workspaceFolder}",
  "isBackground": true,
  "problemMatcher": {
    "owner": "docker",
    "background": {
      "activeOnStart": true,
      "beginsPattern": ".*Starting.*",
      "endsPattern": ".*Container.*started"
    }
  }
}
```

### 7. Full Stack (Compound Task)

```json
{
  "label": "Start: Full Stack (debugpy + Vite)",
  "dependsOn": [
    "Start: FastAPI (debugpy on :5678)",
    "Start: Vite Dev Server"
  ],
  "dependsOrder": "parallel",
  "problemMatcher": []
}
```

---

## Ready Signal Patterns

Different tools output different "ready" signals:

| Tool | Ready Signal |
|------|--------------|
| FastAPI (dev) | `Application startup complete` |
| Vite | `ready in` |
| Django | `Starting development server at` |
| Flask | `Running on http://` |
| npm | `added X packages` |
| Docker | `Container started` |

---

## Best Practices

1. **Use `isBackground: true`** for any long-running server
2. **Always add `problemMatcher`** for background tasks
3. **Use `dependsOn`** to coordinate multiple services
4. **Set `stopAll: true`** in compound launch configs
5. **Use descriptive `label`** names for clarity

---

## Troubleshooting

### Task Not Starting

- Check `command` path is correct
- Verify `cwd` exists
- Check for typos in `label` names

### Debugger Not Attaching

- Ensure `problemMatcher` endsPattern matches output
- Verify port is not already in use
- Check firewall allows local connections

### Orphaned Processes

- Use `stopAll: true` in compounds
- Manually kill processes: `pkill -f uvicorn`
- Check Terminal panel for running tasks

---

## Related Documentation

- [VS Code Tasks Documentation](https://code.visualstudio.com/docs/editor/tasks)
- [debugpy GitHub](https://github.com/microsoft/debugpy)
- [Vite](https://vitejs.dev/)
