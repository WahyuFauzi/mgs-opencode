import { tool } from "@opencode-ai/plugin"
import { z } from "zod"
import * as fs from "fs"
import * as path from "path"

const MISSION_DIR = ".mission"

// Helper: Validate and resolve path within .mission/
function validateMissionPath(relativePath: string, worktree: string): string {
  // Normalize to prevent directory traversal
  const normalized = path.normalize(relativePath)
  
  // Must start with .mission/
  if (!normalized.startsWith(MISSION_DIR + "/") && normalized !== MISSION_DIR) {
    throw new Error(`Invalid path: "${relativePath}". Only paths inside .mission/ directory are allowed.`)
  }
  
  return path.join(worktree, normalized)
}

// Helper: Ensure .mission directory exists
function ensureMissionDir(worktree: string): void {
  const missionPath = path.join(worktree, MISSION_DIR)
  if (!fs.existsSync(missionPath)) {
    fs.mkdirSync(missionPath, { recursive: true })
  }
}

// Tool: mission_create - Create a new mission with alpha.md and bravo.md
export const create = tool({
  description: "Create a new mission folder with alpha.md (brief) and bravo.md (todo list). Only writes to .mission/ directory.",
  args: {
    id: z.string().describe("Mission ID (e.g., MISSION-001)"),
    brief: z.string().describe("Mission brief/description from user"),
    decisions: z.string().optional().describe("Questions asked and user responses"),
    context: z.string().optional().describe("Additional requirements or constraints"),
    tasks: z.array(z.object({
      description: z.string().describe("Task description"),
      files: z.string().optional().describe("Files involved")
    })).describe("List of tasks for the mission"),
    successCriteria: z.array(z.string()).describe("Success criteria for the mission"),
  },
  async execute(args, context) {
    const { id, brief, decisions, context: missionContext, tasks, successCriteria } = args
    const worktree = context.worktree
    
    // Validate ID format
    if (!id.match(/^MISSION-\d{3,}$/)) {
      return `Error: Invalid mission ID format. Use format: MISSION-XXX (e.g., MISSION-001)`
    }
    
    ensureMissionDir(worktree)
    
    const missionPath = path.join(worktree, MISSION_DIR, id)
    
    // Check if mission already exists
    if (fs.existsSync(missionPath)) {
      return `Error: Mission ${id} already exists. Use a different ID or mission_update to modify.`
    }
    
    // Create mission folder
    fs.mkdirSync(missionPath, { recursive: true })
    
    // Create alpha.md
    const alphaContent = `# ${id}: [Title]

## Brief
${brief}

## Decisions
${decisions || "None"}

## Context
${missionContext || "None"}
`
    fs.writeFileSync(path.join(missionPath, "alpha.md"), alphaContent)
    
    // Create bravo.md
    const taskList = tasks.map((t, i) => {
      const fileStr = t.files ? `\n  - Files: ${t.files}` : ""
      return `- [ ] ${i + 1}. ${t.description}${fileStr}`
    }).join("\n")
    
    const criteriaList = successCriteria.map(c => `- ${c}`).join("\n")
    
    const bravoContent = `# ${id}: TODO

## Tasks
${taskList}

## Success Criteria
${criteriaList}
`
    fs.writeFileSync(path.join(missionPath, "bravo.md"), bravoContent)
    
    return `✅ Mission ${id} created successfully.\n- Created: .mission/${id}/alpha.md\n- Created: .mission/${id}/bravo.md\n\nUse mission_set_active to activate this mission.`
  }
})

// Tool: mission_set_active - Set the active mission
export const set_active = tool({
  description: "Set the active mission ID in .mission/ACTIVE file. Only writes to .mission/ directory.",
  args: {
    id: z.string().describe("Mission ID to activate (e.g., MISSION-001)"),
  },
  async execute(args, context) {
    const { id } = args
    const worktree = context.worktree
    
    // Validate ID format
    if (!id.match(/^MISSION-\d{3,}$/)) {
      return `Error: Invalid mission ID format. Use format: MISSION-XXX (e.g., MISSION-001)`
    }
    
    ensureMissionDir(worktree)
    
    // Check mission exists
    const missionPath = path.join(worktree, MISSION_DIR, id)
    if (!fs.existsSync(missionPath)) {
      return `Error: Mission ${id} does not exist. Create it first with mission_create.`
    }
    
    // Write ACTIVE file
    const activePath = path.join(worktree, MISSION_DIR, "ACTIVE")
    fs.writeFileSync(activePath, id)
    
    return `✅ Active mission set to ${id}`
  }
})

// Tool: mission_write - Write content to a mission file
export const write = tool({
  description: "Write content to a file inside .mission/ directory. Validates path to prevent writing outside .mission/.",
  args: {
    path: z.string().describe("Path within .mission/ (e.g., MISSION-001/charlie.md)"),
    content: z.string().describe("File content to write"),
    append: z.boolean().optional().describe("Append to file instead of overwriting (default: false)"),
  },
  async execute(args, context) {
    const { path: relativePath, content, append } = args
    const worktree = context.worktree
    
    try {
      const fullPath = validateMissionPath(relativePath, worktree)
      
      // Ensure parent directory exists
      const parentDir = path.dirname(fullPath)
      if (!fs.existsSync(parentDir)) {
        fs.mkdirSync(parentDir, { recursive: true })
      }
      
      if (append) {
        fs.appendFileSync(fullPath, content)
        return `✅ Appended to .mission/${relativePath}`
      } else {
        fs.writeFileSync(fullPath, content)
        return `✅ Written to .mission/${relativePath}`
      }
    } catch (error) {
      return `Error: ${error instanceof Error ? error.message : String(error)}`
    }
  }
})

// Tool: mission_read - Read content from a mission file
export const read = tool({
  description: "Read content from a file inside .mission/ directory. Validates path to prevent reading outside .mission/.",
  args: {
    path: z.string().describe("Path within .mission/ (e.g., MISSION-001/bravo.md)"),
    fallback: z.string().optional().describe("Value to return if file doesn't exist (default: returns error)"),
  },
  async execute(args, context) {
    const { path: relativePath, fallback } = args
    const worktree = context.worktree
    
    try {
      const fullPath = validateMissionPath(relativePath, worktree)
      
      if (!fs.existsSync(fullPath)) {
        if (fallback !== undefined) {
          return fallback
        }
        return `Error: File .mission/${relativePath} does not exist`
      }
      
      const content = fs.readFileSync(fullPath, "utf-8")
      return content
    } catch (error) {
      return `Error: ${error instanceof Error ? error.message : String(error)}`
    }
  }
})

// Tool: mission_list - List all missions
export const list = tool({
  description: "List all missions in .mission/ directory with their status.",
  args: {},
  async execute(args, context) {
    const worktree = context.worktree
    ensureMissionDir(worktree)
    
    const missionPath = path.join(worktree, MISSION_DIR)
    
    const entries = fs.readdirSync(missionPath, { withFileTypes: true })
    const missions = entries.filter(e => e.isDirectory() && e.name.match(/^MISSION-\d{3,}$/))
    
    if (missions.length === 0) {
      return "No missions found."
    }
    
    // Get active mission
    let activeId = ""
    const activePath = path.join(missionPath, "ACTIVE")
    if (fs.existsSync(activePath)) {
      activeId = fs.readFileSync(activePath, "utf-8").trim()
    }
    
    // Check each mission's status
    const statusList = missions.map(m => {
      const id = m.name
      const isActive = id === activeId
      const missionDir = path.join(missionPath, id)
      
      const hasAlpha = fs.existsSync(path.join(missionDir, "alpha.md"))
      const hasBravo = fs.existsSync(path.join(missionDir, "bravo.md"))
      const hasCharlie = fs.existsSync(path.join(missionDir, "charlie.md"))
      const hasDelta = fs.existsSync(path.join(missionDir, "delta.md"))
      const hasEcho = fs.existsSync(path.join(missionDir, "echo.md"))
      
      let status = "unknown"
      if (hasDelta) status = "COMPLETED"
      else if (hasEcho) status = "FAILED"
      else if (hasCharlie) status = "IN_PROGRESS"
      else if (hasBravo) status = "READY"
      else if (hasAlpha) status = "DRAFT"
      
      const activeMarker = isActive ? " [ACTIVE]" : ""
      return `${id}: ${status}${activeMarker}`
    })
    
    return `Missions:\n${statusList.map(s => `- ${s}`).join("\n")}`
  }
})

// Tool: mission_get_active - Get the currently active mission
export const get_active = tool({
  description: "Get the currently active mission ID from .mission/ACTIVE.",
  args: {},
  async execute(args, context) {
    const worktree = context.worktree
    const activePath = path.join(worktree, MISSION_DIR, "ACTIVE")
    
    if (!fs.existsSync(activePath)) {
      return "No active mission set."
    }
    
    const missionId = fs.readFileSync(activePath, "utf-8").trim()
    
    // Verify mission exists
    const missionPath = path.join(worktree, MISSION_DIR, missionId)
    if (!fs.existsSync(missionPath)) {
      return `Active mission ${missionId} does not exist.`
    }
    
    return missionId
  }
})

// Tool: mission_delete - Delete a mission (use with caution)
export const _delete = tool({
  description: "Delete a mission folder. Use with caution - this is irreversible.",
  args: {
    id: z.string().describe("Mission ID to delete (e.g., MISSION-001)"),
  },
  async execute(args, context) {
    const { id } = args
    const worktree = context.worktree
    
    // Validate ID format
    if (!id.match(/^MISSION-\d{3,}$/)) {
      return `Error: Invalid mission ID format. Use format: MISSION-XXX (e.g., MISSION-001)`
    }
    
    const missionPath = path.join(worktree, MISSION_DIR, id)
    
    if (!fs.existsSync(missionPath)) {
      return `Error: Mission ${id} does not exist.`
    }
    
    // Remove directory recursively
    fs.rmSync(missionPath, { recursive: true })
    
    // Clear ACTIVE if this was the active mission
    const activePath = path.join(worktree, MISSION_DIR, "ACTIVE")
    if (fs.existsSync(activePath)) {
      const activeId = fs.readFileSync(activePath, "utf-8").trim()
      if (activeId === id) {
        fs.unlinkSync(activePath)
      }
    }
    
    return `✅ Mission ${id} deleted.`
  }
})
