# 🛠️ PALS Agent: High-Performance Autonomy
> Transform your terminal into a self-evolving engineering powerhouse.

The PALS Agent is a specialized, multi-modal autonomous entity designed to transcend simple chat. It bridges the gap between **Generative AI** and **Local System Execution**, allowing for high-velocity software engineering directly from your terminal.

---

## ⚡ Core Capabilities

### 🔹 1. Autonomous Project Architecting (Blueprint Mode)
*   **One-Shot Generation**: Describe a complex application (e.g., "A Fullstack Vite + Tailwind + Express + Prisma dashboard").
*   **Structured Output**: The agent generates a complete, production-ready project blueprint including:
    -   Folder hierarchies and manifest metadata.
    -   Complete source code files (no placeholders).
    -   Setup commands (`npm install`, `vite dev`, etc.).
*   **Hardware Manifestation**: Physically creates the entire tree on your local disk after architecting the plan.

### 🔹 2. Local File System Interaction (Architect Mode)
The agent utilizes a suite of remote execution tools to understand and evolve your existing codebase:
*   **`local_file_read`**: Reads local file contents to analyze bugs, types, or dependencies.
*   **`local_file_write`**: Applies precision edits or refactors to your code.
*   **`local_list_files`**: Navigates your project structure to find relevant components.

### 🔹 3. Terminal Execution Service
*   **`local_run_command`**: Executes shell commands on your local hardware.
*   **Interactive Loops**: The agent can run tests, see the failure log, read the source file, write a fix, and rerun the tests until they pass.
*   **Dependency Management**: Automatically detects missing scripts or packages and offers to install them.

### 🔹 4. Global Context & Knowledge
*   **`google_search`**: Leverages real-time search to look up the latest documentation, API changes, or StackOverflow solutions before applying code.
*   **Vast Tech Knowledge**: Expert-level understanding of modern stacks (React, Next.js, Node.js, Go, Rust, and more).

---

## 🛡️ Security & Trust
We value your hardware's integrity. The PALS Agent operates on a **Human-in-the-loop** protocol:
*   **Path Sandboxing**: Prevents any access outside the working project directory.
*   **Explicit Confirmation**: Potentially destructive actions (like running shell commands) require a manual `[Y/n]` confirm in your terminal.
*   **Local-First Manifestation**: All changes happen in your environment, visible to you in real-time.

---

## 🚀 Getting Started

### To Build a New Project:
```bash
palscli wakeup
# Select "Cloud Tools / Agents"
# Result: High-fidelity file generation & construction.
```

### To Manage an Existing Project:
```bash
palscli wakeup
# Select "Start Chat" -> "Agent"
# Command: "Read my package.json and fix the missing start script."
# Result: Interactive tool execution cycle.
```

---

## 📅 Roadmap: Pro Features (Coming Soon)
- [ ] **Docker Orchestration**: Auto-generate and start containerized development environments.
- [ ] **Git Workflow Integration**: Auto-commit fixes and open Pull Requests.
- [ ] **Performance Auditing**: Read source code and provide tailored optimization patches.
- [ ] **Live Collaboration**: Share your terminal session with the Neon Monolith Web Interface.

---
*PALS Agent: From blueprint to binary in seconds.*
