#  PALS CLI: Agentic Development Roadmap

This TODO list track the implementation of the "Proper Agent" features in the `palscli` package.

---

## 🛠️ Phase 1: High-Velocity Architecture (DONE)
- [x] **Autonomous Project Blueprinting**: One-shot generation of entire project folders/files.
- [x] **Remote Generation Protocol**: `palscli` now requests structured app data from the hosted API.
- [x] **Client-Side Manifestation**: The CLI physically creates directories and writes code to your local disk.
- [x] **Security Sandboxing**: Prevent the AI from writing outside the target project folder.

## 📟 Phase 2: Interactive Execution Brain (DONE)
- [x] **Persistent Agent Chat**: Start a chat session in "Agent Mode" (Autonomous Mode).
- [x] **Local File Tools**: `local_file_read`, `local_file_write`, `local_list_files`.
- [x] **Shell Tool**: `local_run_command` (Executes npm installs, scripts, etc.).
- [x] **Human-in-the-Loop**: Terminal confirmation (`[Y/n]`) for potentially destructive shell actions.
- [x] **Multi-Step Loops**: The agent can now Read -> Reason -> Edit -> Confirm -> Execute.

## 🌌 Phase 3: Global Integration (NEXT)
- [ ] **Deployment Tooling**: Automatically deploy generated apps to Vercel/Netlify.
- [ ] **Docker Tooling**: Auto-generate Dockerfiles and run `docker-compose up`.
- [ ] **Database Tooling**: Initialize Prisma/Postgres and run local migrations.
- [ ] **Git Orchestration**: Auto-commit fixes and create branches for feature work.

---
*PALS: The only CLI with a local-execution agentic brain.*
