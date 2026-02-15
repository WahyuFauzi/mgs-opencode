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

## Build/Lint/Test

This is a configuration repository with no traditional build process. All validation happens at runtime:

- **Agent Validation**: Load via OpenCode to verify frontmatter and permissions
- **Command Testing**: Invoke custom commands to verify execution
- **Skill Testing**: Use `skill({name: "skill-name"})` to verify discoverability
- **Mission Testing**: Execute `/start-mission` to verify mission flow

## Frontmatter Conventions

All configuration files must use YAML frontmatter with `---` delimiters:

### Agent Files (agents/*.md)
```yaml
---
description: Concise agent purpose (1-1024 chars)
mode: primary|secondary
model: model-id
temperature: 0.0-1.0
tools:
  tool-name: true/false
permission:
  tool-name: "allow"|"ask"|"deny"
---
```

### Command Files (commands/*.md)
```yaml
---
description: Command purpose (1-1024 chars)
agent: agent-name
subtask: true|false
---
```

### Skill Files (skills/*/SKILL.md)
```yaml
---
name: skill-name              # lowercase with hyphens, matches directory
description: Skill purpose (1-1024 chars)
license: MIT|Apache-2.0|etc
source: original-source
metadata:
  key: value
---
```

## Naming Conventions

- **Agent files**: lowercase with hyphens (e.g., `general-zero.md`, `big-boss.md`)
- **Command files**: lowercase with hyphens, prefixed with `/` (e.g., `/start-mission.md`)
- **Skill directories**: lowercase with hyphens (e.g., `code-review/`)
- **Skill files**: UPPERCASE `SKILL.md` exactly
- **Mission IDs**: UPPERCASE with hyphens (e.g., `MISSION-001`)

## Agent Configuration Patterns

### Tool Permissions
Use the permission model for fine-grained control:
- `"allow"`: Automatic execution without confirmation
- `"ask"`: Require user confirmation before execution
- `"deny"`: Block tool usage entirely

### Common Tools
- `read`: Read files anywhere in codebase
- `write/edit`: Modify files (typically restricted by agent role)
- `bash`: Execute shell commands
- `task`: Delegate to subagents
- `glob/grep`: File and content search
- `context7_*`: Query external documentation

## Mission Workflow

Missions follow the ALPHA-BRAVO-CHARLIE-DELTA-ECHO escalation scale:

1. **ALPHA**: Reconnaissance and assessment
   - Mission brief from user
   - Codebase analysis
   - Feasibility assessment
   - Proposed approach

2. **BRAVO**: Tactical plan
   - Clear objective
   - Operational steps for CHARLIE
   - Success criteria checklist

3. **CHARLIE**: Execution log
   - Progress tracking with checkboxes
   - Completed operations
   - Encountered issues

4. **DELTA**: Completion report
   - Status: COMPLETED
   - Deliverables list
   - Final summary

5. **ECHO**: Failure report (optional, triggered on failure)
   - Status: FAILED
   - Failure summary and root cause analysis
   - Encountered issues and recovery suggestions
   - Requires intervention flag

### Mission Tracking
- All mission tracking handled by folder-based system (`.mission/` directory)
- Active missions tracked via `.mission/ACTIVE` file containing mission ID
- Mission stages stored as files: `alpha.md`, `bravo.md`, `charlie.md`, `delta.md`, `echo.md`
- ECHO stage is only created when a mission fails and cannot be completed

## Code Style Guidelines

### Markdown Formatting
- Use ATX-style headings (`## Heading`)
- Maximum nesting: 3 levels (`##`, `###`, `####`)
- Use bullet lists for items without order
- Use numbered lists for sequences
- Code blocks with language specifier: ```language
- Use inline code for technical terms and file paths: `` `path/to/file` ``

### Error Handling
When creating agent instructions:
- Include clear error scenarios and recovery steps
- Use specific examples for common edge cases
- Provide fallback behavior for failures
- Document any required cleanup or rollback

### Documentation Standards
- Describe what and why, not just how
- Include examples for complex operations
- Use consistent terminology throughout
- Reference external docs (OpenCode documentation, library docs)
- Keep descriptions concise but informative (1-1024 chars)

## Agent-Specific Guidelines

### General Zero (Mission Planning)
- Use `write` tool (with confirmation) to create mission files in `.mission/` directory
- Use `task` tool for codebase reconnaissance
- Create structured ALPHA/BRAVO stages as files in mission folder
- Update `.mission/ACTIVE` file to mark mission for execution
- Always report mission ready with `/start-mission` instruction

### Big Boss (Mission Execution)
- Retrieve active mission by reading `.mission/ACTIVE` file
- Execute CHARLIE steps systematically
- Update progress in real-time by editing `charlie.md` file
- Resume gracefully from interruptions by checking `charlie.md` checkboxes
- Create DELTA stage file upon completion
- Create ECHO stage file when mission fails and cannot be recovered
- Use write/edit/bash tools for actual code/infrastructure changes

### Raiden (Direct Execution)
- Confirm before modifying files/running commands
- No mission planning or task delegation
- Direct, efficient execution
- Clear risk assessment before changes

## Security Considerations

- Never commit API keys or credentials
- Use environment variables for sensitive data
- Validate all user inputs
- Follow principle of least privilege for tool permissions
- Document any external dependencies and their security implications

## Common Patterns

### Agent Selection
- Planning missions: Use general-zero
- Executing missions: Use big-boss via `/start-mission`
- Quick tasks: Use raiden for direct execution

### File Path References
- Use absolute paths from repository root
- Use backticks for paths: `/path/to/file`
- Avoid relative paths that may be ambiguous

### Status Reporting
- For mission progress: Use folder-based system to update `charlie.md` file
- For completion: Create DELTA stage file
- For failure: Create ECHO stage file with failure analysis and recovery suggestions
- Always report clear success/failure with actionable details
