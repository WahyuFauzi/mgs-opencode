---
name: mission-templates
description: Mission stage templates for ALPHA, BRAVO, CHARLIE, DELTA, ECHO, and Alert
license: MIT
compatibility: opencode
metadata:
  audience: agents
  experience: all
---

Standardized templates for mission stages. Use via `skill({name: "mission-templates"})`.

## Who Uses What

| Stage | Created By | When |
|-------|------------|------|
| ALPHA | General Zero | Mission creation |
| BRAVO | General Zero | Mission creation |
| CHARLIE | Big Boss | Execution begins |
| DELTA | Big Boss | Mission success |
| ECHO | Big Boss | Mission failure |
| ALERT | Big Boss | Critical failure |

---

## ALPHA Template (alpha.md)

General Zero creates this - mission draft/brief.

```markdown
# MISSION-XXX: [Title]

## Brief
[User's original request]

## Decisions
[Questions asked and user responses]

## Context
[Additional requirements or constraints]
```

---

## BRAVO Template (bravo.md)

General Zero creates this - complete task list for execution.

```markdown
# MISSION-XXX: TODO

## Tasks
- [ ] 1. [Task description]
  - Files: [involved files]
- [ ] 2. [Task description]
  - Files: [involved files]

## Success Criteria
- [Criterion 1]
- [Criterion 2]
```

---

## CHARLIE Template (charlie.md)

Big Boss creates this - execution tracking. Copy tasks from BRAVO, mark as completed.

```markdown
# MISSION-XXX: EXECUTION

## Status: IN PROGRESS
- Started: [timestamp]

## Tasks
- [ ] 1. [Task description]
- [ ] 2. [Task description]

## Notes
[Execution notes, issues encountered]
```

**On completion**: Mark all tasks `[x]`, then create DELTA.

---

## DELTA Template (delta.md)

Big Boss creates this when mission succeeds.

```markdown
# MISSION-XXX: COMPLETE

## Status: COMPLETED
- Date: [timestamp]

## Deliverables
- [What was delivered]

## Changes
### Created
- [file paths]

### Modified
- [file paths]

### Deleted
- [file paths or "None"]
```

---

## ECHO Template (echo.md)

Big Boss creates this when mission fails.

```markdown
# MISSION-XXX: FAILED

## Status: FAILED
- Date: [timestamp]

## Failure
[What went wrong]

## Root Cause
[Why it failed]

## Recovery
1. [Suggested fix]
2. [Alternative approach]

## Intervention Required: YES
```

---

## ALERT Template (ALERT-XXX.md)

Big Boss creates for critical failures requiring immediate attention.

```markdown
# ALERT-XXX: [Type]

## Metadata
- Type: [Execution Failure / File Error / Other]
- Mission: [MISSION-ID]
- Severity: [HIGH/MEDIUM/LOW]
- Time: [timestamp]

## Error
[What failed, include error messages]

## Context
[What was being attempted]

## Suggested Action
[How to resolve]
```

---

## File Locations

```
.mission/
├── ACTIVE           # Active mission ID
├── alerts/          # Alert files
│   └── ALERT-XXX.md
└── MISSION-XXX/     # Mission folder
    ├── alpha.md     # General Zero
    ├── bravo.md     # General Zero
    ├── charlie.md   # Big Boss
    ├── delta.md     # Big Boss
    └── echo.md      # Big Boss
```
