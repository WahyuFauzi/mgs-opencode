# OpenCode Agent Configuration Guide

Repository for OpenCode agent configurations, mission planning system, and agent skills.

## Repository Structure

```
├── agents/          # Agent definition files (agent-name.md)
├── commands/        # Custom command definitions (command-name.md)
├── skills/          # Reusable agent skills (skill-name/SKILL.md)
└── opencode.jsonc   # OpenCode configuration
```

All mission tracking uses the folder-based system (`.mission/` directory). Mission Manager MCP is deprecated.

## Build/Lint/Test

No traditional build. Validation happens at runtime: load agents via OpenCode, invoke
commands, use `skill({name: "skill-name"})`, execute `/start-mission` for mission flow.

## Quick Conventions

- All config files use YAML frontmatter with `---` delimiters
- Agents: `agents/*.md` — frontmatter: `description, mode, model, temperature, permission`
- Commands: `commands/*.md` — frontmatter: `description, agent, subtask`
- Skills: `skills/*/SKILL.md` — `name` must match directory, `description` required
- Permission values: `"allow" | "ask" | "deny"` (legacy `tools` key is deprecated)
- Mission IDs: UPPERCASE with hyphens (e.g., `MISSION-001`)

## Mission Workflow

Missions use the ALPHA-BRAVO-CHARLIE-DELTA-ECHO scale:

1. **ALPHA**: Reconnaissance and assessment
2. **BRAVO**: Tactical plan (objective, steps, success criteria)
3. **CHARLIE**: Execution log with checkbox tracking
4. **DELTA**: Completion report (status, deliverables, summary)
5. **ECHO**: Failure report (status, root cause, recovery, intervention flag)

Tracking: `.mission/ACTIVE` holds the active mission ID; stages live as
`alpha.md`/`bravo.md`/`charlie.md`/`delta.md`/`echo.md` files.

## Agent Roles

- **general-zero**: Mission planning (ALPHA/BRAVO)
- **big-boss**: Mission execution via `/start-mission` (CHARLIE → DELTA)
- **raiden**: Direct execution, no planning, confirm-before-edit
- **otacan**: Intelligence gathering / reconnaissance (read-only)
- **ocelot**: Code review and QA validation

## Lazy-Loaded Details

For full frontmatter examples, code style, markdown formatting, security
considerations, and detailed agent/mission guidelines, read
`@docs/opencode-conventions.md` only when needed (e.g., before writing code,
creating mission files, or extending agent configs).

## Notification
Use notification tool if the process finish or you need my feedback like input for tool.
