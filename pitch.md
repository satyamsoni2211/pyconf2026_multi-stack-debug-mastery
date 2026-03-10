In the era of microservices and full-stack applications, debugging a Python backend in isolation is rarely enough. Developers often find themselves juggling multiple terminal tabs to start a FastAPI server, a Vite frontend, and a debugger, leading to "context-switch fatigue." 

This workshop teaches you how to turn VS Code into a powerful orchestration engine. We will move beyond basic script debugging to explore **Compound Launch Configurations**. Using a real-world project involving a FastAPI backend and a Vite/Electron frontend, we will learn how to:
* Automate environment startup using `tasks.json`.
* Use `debugpy` to attach to processes managed by modern tools like `uv`.
* Synchronize frontend and backend debugging into a single "one-click" workflow using `compounds`.

---

## Learning Objectives
* **Orchestrating Tasks**: Learn to use `tasks.json` to automate background services like Vite dev servers and FastAPI instances.
* **Advanced `debugpy`**: Master the "Remote Attach" workflow to debug Python applications running on specific ports, such as port 5678.
* **Compound Configurations**: Combine disparate debug sessions—such as Python and Chrome/Electron—into a unified interface.
* **Problem Matchers**: Configure VS Code to understand CLI output, such as "VITE starting" or "Application startup complete," to ensure services are ready before debugging begins.

---

## Workshop Outline

### Part 1: The Modern Python Environment (45 min)
* Introduction to multi-directory project structures including `audient-backend` and `audient-frontend`.
* Setting up `uv` for modern Python dependency management and execution.
* **Exercise**: Creating a basic task to run FastAPI via `uv run`.

### Part 2: Bridging the Gap with Tasks (60 min)
* The anatomy of `tasks.json`: labels, types, and commands.
* Utilizing `isBackground: true` for long-running dev servers.
* **Deep Dive**: Crafting regex patterns for `problemMatcher` to catch "Server started" or "ready" signals.

### Part 3: The "Remote Attach" Pattern (45 min)
* Why "Attach" is often superior to "Launch" for complex managed environments.
* Configuring `debugpy` to listen on a specific port for connection.
* **Exercise**: Setting up `pathMappings` to sync local code with the running process.

### Part 4: The One-Click Workflow (60 min)
* Creating `compounds` in `launch.json` to group backend and frontend configurations.
* Integrating `preLaunchTask` to automate dependencies, such as starting the frontend before the debugger.
* Handling `stopAll: true` behaviors to ensure a clean exit for all processes in a session.

---

## Prerequisites
* Basic knowledge of Python and FastAPI.
* VS Code installed.
* Familiarity with the command line and Node.js/npm basics.