# OpenCode Agent Configuration Guide

This repository contains OpenCode AI agent configurations, mission planning system, and agent skills. This guide is for agentic coding agents working within this repository.

## Repository Structure

```
├── agents/          # Agent definition files (agent-name.md)
├── commands/        # Custom command definitions (command-name.md)
├── skills/          # Reusable agent skills (skill-name/SKILL.md)
└── opencode.jsonc   # OpenCode configuration
```

**Note**: All mission tracking uses folder-based system (`.mission/` directory). Mission Manager MCP service is deprecated.

## Docker Configuration

This section details the Docker setup for the Mission Manager MCP Server.

### Multi-Stage Build
The `Dockerfile` now uses a multi-stage build process to create optimized and smaller Docker images. This process separates build-time dependencies from runtime dependencies, resulting in a more efficient and secure final image.

### Security Hardening
To enhance security, the container runs as a non-root user (`bun` with UID 1001). This minimizes potential attack vectors and adheres to the principle of least privilege.

### Resource Limits
Resource limits are configured in `docker-compose.yml` to ensure the Mission Manager operates within defined CPU and memory constraints, preventing resource exhaustion on the host system.

- **CPU Limit**: 1.0 core
- **Memory Limit**: 512MB

### Port Configuration
The Mission Manager MCP Server now runs on **port 8765** instead of the default 3000. This non-standard port choice improves security by making the service less discoverable to automated scans targeting common ports.

- **Environment Variable**: `PORT=8765`
- **Exposed Port**: `8765:8765` in `docker-compose.yml`

### Health Checks
Robust health checks are implemented to monitor the container's status. The health endpoint can be accessed at `http://localhost:8765/health`.

```bash
curl http://localhost:8765/health
```

### Docker Commands

**Build the Docker Image**:
```bash
docker build -t mission-manager:1.1.0 .
```

**Run with Docker Compose**:
```bash
docker-compose up -d
```

**Troubleshooting Port Issues**:
If you encounter issues with port 8765, ensure:
1. The `PORT` environment variable is correctly set.
2. The `ports` mapping in `docker-compose.yml` is accurate.
3. Your firewall allows incoming connections on port 8765.

