---
description: Execute or resume current mission in this repo
agent: big-boss
subtask: true
---
# /start-mission Command

Executes the CHARLIE phase of the active mission using folder-based mission system.

## Workflow:
1. **Check for active mission**: Read `.mission/ACTIVE` file to determine which mission to execute
2. **Verify mission files**: Ensure `.mission/{mission-id}/alpha.md` and `bravo.md` exist
3. **Read tactical plan**: Parse operational steps from `bravo.md`
4. **Execute operations**: Perform code/infrastructure changes using write/edit/bash tools
5. **Update progress**: Edit `.mission/{mission-id}/charlie.md` with execution status
6. **Complete mission**: Create `.mission/{mission-id}/delta.md` upon successful completion

## Notes:
- Mission files must be created by General Zero before execution
- Big Boss reads from and writes to `.mission/` directory only
- Active mission tracking via `.mission/ACTIVE` file