# Multi-Action Refactor Protocol Design Document

## Overview

This document outlines the design for a multi-action refactor protocol that supports multiple code edits in a single refactor operation. This builds upon the existing single-action protocol and follows LSP standards for edit operations.

## Current State Analysis

### Single-Action Protocol

**Client Request (`/api/agent/refactor-code`):**
```json
{
  "data": {
    "code": "original code snippet",
    "start_line": 10,
    "end_line": 20,
    "filepath": "/path/to/file.py",
    "filetype": "python",
    "instruction": "Refactor for better readability"
  }
}
```

**Server Response:**
```json
{
  "success": true,
  "refactored_code": "single code blob replacing entire range",
  "explanation": "Explanation of changes"
}
```

**Client Implementation:**
- Replaces entire line range with new code
- Simple but limited for complex refactors

## Protocol Design

### 1. JSON Schema for Edit Actions

Based on LSP TextEdit and VS Code WorkspaceEdit patterns:

```typescript
// Edit action types
type EditActionType = "replace_line" | "replace_range" | "insert" | "delete" | "move";

// Single edit action
interface EditAction {
  type: EditActionType;

  // Common fields
  action_id?: string;          // Unique identifier for ordering/undo

  // Position (0-indexed or 1-indexed)
  line: number;                // Line number
  character?: number;          // Column position (0-indexed)

  // Content (for replace/insert)
  content?: string;            // New content (can be multi-line)

  // Range (for replace/delete/move)
  start_line?: number;         // Starting line
  start_character?: number;    // Starting column
  end_line?: number;           // Ending line
  end_character?: number;      // Ending column

  // Range identification (alternative to explicit range)
  range_id?: string;           // Reference to a named range
  anchor_line?: number;        // Anchor position
  active_line?: number;        // Active position
}

// Multi-action refactor response
interface RefactorResponse {
  success: boolean;
  actions: EditAction[];       // Array of edit operations
  explanation?: string;        // Human-readable explanation
  context?: {                  // Optional metadata
    filepath: string;
    filetype: string;
    total_actions: number;
  };
}

// Example with multiple edits
{
  "success": true,
  "actions": [
    {
      "type": "replace_line",
      "action_id": "1",
      "line": 10,
      "character": 0,
      "content": "def new_function():\n    pass"
    },
    {
      "type": "replace_range",
      "action_id": "2",
      "start_line": 12,
      "start_character": 0,
      "end_line": 15,
      "end_character": 0,
      "content": "    # New implementation\n    pass"
    },
    {
      "type": "insert",
      "action_id": "3",
      "line": 16,
      "character": 0,
      "content": "\n\n# Helper function"
    }
  ],
  "explanation": "Extracted function and added helper function"
}
```

### 2. Supported Edit Action Types

#### `replace_line`
Replace a single line at a specific position.

**Schema:**
```typescript
{
  type: "replace_line";
  line: number;                // 1-indexed
  character: number;           // 0-indexed column
  content: string;             // Single-line content (or multi-line will be split)
}
```

**Example:**
```json
{
  "type": "replace_line",
  "line": 10,
  "character": 0,
  "content": "def my_function():"
}
```

#### `replace_range`
Replace a range of lines with new content.

**Schema:**
```typescript
{
  type: "replace_range";
  start_line: number;          // 1-indexed
  start_character: number;     // 0-indexed
  end_line: number;            // 1-indexed, exclusive
  end_character: number;       // 0-indexed
  content: string;             // Multi-line content
}
```

**Example:**
```json
{
  "type": "replace_range",
  "start_line": 10,
  "start_character": 0,
  "end_line": 20,
  "end_character": 0,
  "content": "def new_function():\n    # Implementation\n    return result"
}
```

#### `insert`
Insert content at a specific position (doesn't replace).

**Schema:**
```typescript
{
  type: "insert";
  line: number;                // 1-indexed
  character: number;           // 0-indexed column
  content: string;             // Multi-line content
}
```

**Example:**
```json
{
  "type": "insert",
  "line": 10,
  "character": 0,
  "content": "def new_function():\n    pass"
}
```

#### `delete`
Delete content at a specific range.

**Schema:**
```typescript
{
  type: "delete";
  start_line: number;          // 1-indexed
  start_character: number;     // 0-indexed
  end_line: number;            // 1-indexed, exclusive
  end_character: number;       // 0-indexed
}
```

**Example:**
```json
{
  "type": "delete",
  "start_line": 10,
  "start_character": 0,
  "end_line": 12,
  "end_character": 0
}
```

### 3. Line Number Convention

**Decision: Use 1-indexed line numbers (1-based)**
- Matches user expectations (line 1 = first line)
- Compatible with Neovim's cursor position (1-indexed)
- Matches current Nitro24 implementation
- Easier for users to understand

**Character Position: Use 0-indexed**
- Matches LSP and programming conventions
- More precise control over character positions
- Better for partial line edits

## Implementation Details

### Pydantic Models (`models/agent_req.py`)

```python
from pydantic import BaseModel, Field
from typing import List, Optional, Literal

class EditAction(BaseModel):
    """Single edit operation"""
    type: Literal["replace_line", "replace_range", "insert", "delete"]

    # Line numbers (1-indexed)
    line: int = Field(..., description="Line number (1-indexed)")

    # Content (for replace_line/insert)
    content: Optional[str] = Field(None, description="New content (multi-line allowed)")

    # Range positions (for replace_range/delete)
    start_line: Optional[int] = Field(None, description="Start line (1-indexed)")
    start_character: Optional[int] = Field(None, description="Start character (0-indexed)")
    end_line: Optional[int] = Field(None, description="End line (1-indexed, exclusive)")
    end_character: Optional[int] = Field(None, description="End character (0-indexed)")

    # Optional identifier for ordering/undo
    action_id: Optional[str] = Field(None, description="Unique action identifier")

    class Config:
        json_schema_extra = {
            "example": {
                "type": "replace_line",
                "line": 10,
                "character": 0,
                "content": "def new_function():"
            }
        }

class RefactorResponse(BaseModel):
    """Multi-action refactor response"""
    success: bool = Field(..., description="Whether refactor succeeded")
    actions: List[EditAction] = Field(..., description="Array of edit operations")
    explanation: Optional[str] = Field(None, description="Human-readable explanation")
    context: Optional[dict] = Field(None, description="Additional metadata")

    class Config:
        json_schema_extra = {
            "example": {
                "success": True,
                "actions": [
                    {
                        "type": "replace_line",
                        "line": 10,
                        "character": 0,
                        "content": "def new_function():"
                    }
                ],
                "explanation": "Refactored the code",
                "context": {
                    "filepath": "/path/to/file.py",
                    "filetype": "python",
                    "total_actions": 1
                }
            }
        }
```

### LLM System Prompt Update (`agents/refactor_agent.py`)

```python
SYSTEM_PROMPT = """You are an expert software engineer specializing in code refactoring and optimization.
Your task is to take a code snippet and provide a refactored version that improves readability, performance, or maintainability.

**CRITICAL: You MUST return a JSON object with multiple edit actions, NOT a single code blob.**

Edit Action Types:
1. replace_line: Replace a single line at a specific position
   - Required fields: type, line (1-indexed), character (0-indexed), content
   - Example: {"type": "replace_line", "line": 10, "character": 0, "content": "new code"}

2. replace_range: Replace a range of lines with new content
   - Required fields: type, start_line (1-indexed), start_character (0-indexed), end_line (1-indexed, exclusive), end_character (0-indexed), content
   - Example: {"type": "replace_range", "start_line": 10, "start_character": 0, "end_line": 20, "end_character": 0, "content": "multi\nline\ncode"}

3. insert: Insert content at a specific position (doesn't replace)
   - Required fields: type, line (1-indexed), character (0-indexed), content
   - Example: {"type": "insert", "line": 10, "character": 0, "content": "new code"}

4. delete: Delete content at a specific range
   - Required fields: type, start_line (1-indexed), start_character (0-indexed), end_line (1-indexed, exclusive), end_character (0-indexed)
   - Example: {"type": "delete", "start_line": 10, "start_character": 0, "end_line": 20, "end_character": 0}

Response Format - You MUST respond with ONLY valid JSON:
{
  "success": true,
  "actions": [
    {"type": "replace_line", "line": 10, "character": 0, "content": "def new_function():"},
    {"type": "insert", "line": 11, "character": 0, "content": "    pass"}
  ],
  "explanation": "Refactored code by extracting function",
  "context": {
    "filepath": "{filepath}",
    "filetype": "{filetype}",
    "total_actions": 2
  }
}

Guidelines:
1. Return ONLY the JSON, no markdown, no code blocks
2. Line numbers are 1-indexed (1 = first line)
3. Character positions are 0-indexed (0 = first character)
4. Use replace_range for multi-line replacements
5. Use replace_line for single-line replacements
6. Use insert for additions that don't replace existing content
7. Use delete for removals
8. Provide a clear explanation of what was changed
"""
```

### Server Endpoint Update (`main.py`)

```python
from models.agent_req import EditAction, RefactorResponse

@app.post("/api/agent/refactor-code")
async def refactor_code_endpoint(body: Request):
    """Refactor code endpoint with multi-action support"""
    if isinstance(body.data, CodeData):
        logger.info(f"Received refactoring request for: {body.data.filepath}")

        try:
            # Call the agent
            result = await refactor_code(
                code=body.data.code,
                start_line=body.data.start_line,
                end_line=body.data.end_line,
                filepath=body.data.filepath,
                filetype=body.data.filetype,
                instruction=body.data.instruction,
                root_dir=body.data.root_dir or "Refactor for better readability and performance.",
            )

            if result["success"]:
                # Transform to new format with actions
                actions = result.get("actions", [])
                if not actions:
                    # Backward compatibility: if no actions, wrap single code in replace_range
                    code = result.get("refactored_code", result.get("updated_code", ""))
                    if code:
                        actions = [
                            EditAction(
                                type="replace_range",
                                start_line=body.data.start_line,
                                start_character=0,
                                end_line=body.data.end_line,
                                end_character=0,
                                content=code
                            )
                        ]

                return RefactorResponse(
                    success=True,
                    actions=actions,
                    explanation=result.get("explanation"),
                    context={
                        "filepath": body.data.filepath,
                        "filetype": body.data.filetype,
                        "total_actions": len(actions)
                    }
                )
            else:
                return {
                    "success": False,
                    "error": result.get("error", "Unknown error"),
                    "raw_response": result.get("raw_response"),
                }
        except Exception as e:
            log_error(logger, f"Error in refactor-code endpoint: {e}", exc_info=True)
            raise HTTPException(status_code=500, detail=str(e))
    else:
        raise HTTPException(
            status_code=400,
            detail="Refactoring requires CodeData",
        )
```

### Client-Side Lua Implementation (`dev/lua/nitro24/init.lua`)

```lua
-- Apply multiple edit actions to buffer
local function apply_refactor_actions(bufnr, actions, explanation)
  if not actions or #actions == 0 then
    vim.notify("No actions to apply", vim.log.levels.WARNING)
    return
  end

  -- Apply actions in order
  for i, action in ipairs(actions) do
    local line = action.line - 1  -- Convert to 0-indexed
    local content = action.content

    if action.type == "replace_line" then
      local char = action.character or 0
      -- Replace single line
      local current_line = vim.api.nvim_buf_get_lines(bufnr, line, line + 1, false)[1]

      -- Handle case where content might not be provided
      if not content then
        content = ""
      end

      -- Replace at character position
      if char == 0 then
        -- Full line replacement
        vim.api.nvim_buf_set_lines(bufnr, line, line + 1, false, vim.split(content, "\n"))
      else
        -- Partial line replacement (simplified - replaces from character to end)
        local prefix = current_line:sub(1, char)
        local new_line = prefix .. content
        vim.api.nvim_buf_set_lines(bufnr, line, line + 1, false, {new_line})
      end

    elseif action.type == "replace_range" then
      local start_line = action.start_line - 1
      local start_char = action.start_character or 0
      local end_line = (action.end_line or line) - 1
      local end_char = action.end_character or 0

      -- Get original content
      local lines_before = vim.api.nvim_buf_get_lines(bufnr, 0, start_line, false)
      local lines_after = vim.api.nvim_buf_get_lines(bufnr, end_line, -1, false)

      -- Create new content for replaced range
      local new_lines = vim.split(content, "\n")

      -- Rebuild buffer
      vim.api.nvim_buf_set_lines(bufnr, 0, -1, false,
        vim.list_extend(lines_before, new_lines, 1, #new_lines)
      )

    elseif action.type == "insert" then
      local insert_line = action.line - 1
      local insert_char = action.character or 0

      if insert_char == 0 then
        -- Insert at end of buffer
        vim.api.nvim_buf_set_lines(bufnr, insert_line, insert_line, false, vim.split(content, "\n"))
      else
        -- Insert at character position
        local current_line = vim.api.nvim_buf_get_lines(bufnr, insert_line, insert_line + 1, false)[1]
        local prefix = current_line:sub(1, insert_char)
        local new_line = prefix .. content
        vim.api.nvim_buf_set_lines(bufnr, insert_line, insert_line + 1, false, {new_line})
      end

    elseif action.type == "delete" then
      local start_line = action.start_line - 1
      local start_char = action.start_character or 0
      local end_line = (action.end_line or start_line + 1) - 1
      local end_char = action.end_character or 0

      -- Delete content
      local lines_before = vim.api.nvim_buf_get_lines(bufnr, 0, start_line, false)
      local lines_after = vim.api.nvim_buf_get_lines(bufnr, end_line + 1, -1, false)

      -- Rebuild buffer
      vim.api.nvim_buf_set_lines(bufnr, 0, -1, false,
        vim.list_extend(lines_before, lines_after, 1, #lines_after)
      )
    else
      vim.notify(string.format("Unknown action type: %s", action.type), vim.log.levels.WARNING)
    end
  end

  -- Add to refactor history
  table.insert(_refactor_history, {
    timestamp = os.time(),
    filepath = vim.api.nvim_buf_get_name(bufnr),
    line_range = "Multiple actions",
    explanation = explanation,
    lines_changed = calculate_lines_changed(actions)
  })
end

-- Updated _send_refactor_request function
function M._send_refactor_request(bufnr, start_line, end_line, code, instruction)
  -- Check server connection
  if not ensure_server_connected() then
    return
  end

  vim.notify("Transforming code...", vim.log.levels.INFO)

  local payload = {
    data = {
      code = code,
      start_line = start_line,
      end_line = end_line,
      filepath = vim.api.nvim_buf_get_name(bufnr),
      filetype = vim.bo[bufnr].filetype,
      instruction = instruction,
      project_root = vim.fn.getcwd(),
    },
  }

  M.is_processing = true
  vim.system(
    { "curl", "-X", "POST", config.base_url .. "/api/agent/refactor-code",
      "-H", "Content-Type: application/json",
      "-d", vim.fn.json_encode(payload)
    },
    { text = true },
    function(obj)
      vim.schedule(function()
        M.is_processing = false
        if obj.code ~= 0 then
          local error_msg = obj.stderr and ("Error calling transform-code: " .. obj.stderr) or "Unknown error"
          vim.notify(error_msg, vim.log.levels.ERROR)
          return
        end

        local ok, resp = pcall(vim.fn.json_decode, obj.stdout)
        if ok and resp and resp.success then
          local actions = resp.actions or {}
          local expl = resp.explanation or ""

          -- Capture original lines for history tracking
          local original_lines = vim.api.nvim_buf_get_lines(bufnr, start_line - 1, end_line, false)

          -- Apply changes
          apply_refactor_actions(bufnr, actions, expl)

          -- Calculate lines changed
          local lines_changed = #original_lines
          for _, action in ipairs(actions) do
            if action.type == "insert" then
              lines_changed = lines_changed + 1
            elseif action.type == "delete" then
              lines_changed = lines_changed - 1
            end
          end

          -- Add to refactor history
          table.insert(_refactor_history, {
            timestamp = os.time(),
            filepath = vim.api.nvim_buf_get_name(bufnr),
            line_range = "Multiple actions",
            explanation = expl,
            lines_changed = lines_changed
          })

          -- Show refactor summary automatically
          show_refactor_summary()
          vim.notify("Transformation applied with " .. #actions .. " action(s).", vim.log.levels.INFO)
        else
          local err = (resp and resp.error) or "Failed to parse response"
          vim.notify("Transformation failed: " .. err, vim.log.levels.ERROR)
        end
      end)
    end
  )
end
```

## Order of Application

### Bottom-to-Top Application (Recommended)

**Why:**
- Line numbers remain stable
- More intuitive for users
- Matches typical user mental model
- Easier to debug

**Process:**
1. Start from the last action and work backwards
2. Apply edits in reverse order
3. No line number adjustments needed
4. More stable edits

**Example:**
```json
{
  "actions": [
    {"type": "replace_line", "line": 10, "content": "..."},
    {"type": "insert", "line": 11, "content": "..."}
  ]
}
```

Apply `insert` at line 11, then `replace_line` at line 10. Both refer to the same line numbers in the original file.

### Top-to-Bottom Application (Alternative)

**Process:**
1. Start from the first action
2. Apply edits in order
3. Adjust line numbers for subsequent actions
4. More complex but can be necessary

**Example:**
```json
{
  "actions": [
    {"type": "replace_line", "line": 10, "content": "..."},
    {"type": "insert", "line": 10, "content": "..."}
  ]
}
```

Apply `replace_line` at line 10, then `insert` at line 10 (which now contains different content).

## Edge Cases and Gotchas

### 1. Empty Content
If an action has empty content, it should be treated appropriately:
- `replace_line` with empty content: delete the line
- `insert` with empty content: do nothing
- `replace_range` with empty content: delete the range

### 2. Character Position Out of Range
If `character` position exceeds line length:
- Clamp to line length
- Document this behavior in API docs

### 3. Multi-Line Insert at End of File
Ensure proper buffer growth when inserting at the end.

### 4. Range Beyond File Bounds
Validate ranges don't exceed file boundaries.

### 5. Overlapping Actions
Actions should not overlap. If they do:
- Last action wins
- Log a warning
- Document behavior

### 6. Backward Compatibility
Support both old format (`refactored_code`) and new format (`actions`):
```python
if "actions" in result:
    return RefactorResponse(...)
else:
    # Legacy format
    code = result.get("refactored_code")
    if code:
        return RefactorResponse(
            success=True,
            actions=[EditAction(
                type="replace_range",
                start_line=body.data.start_line,
                start_character=0,
                end_line=body.data.end_line,
                end_character=0,
                content=code
            )],
            explanation=result.get("explanation")
        )
```

### 7. Line Number vs Range
When `replace_line` is used with a full line:
- `character` should be 0
- Line number points to the line to replace

When `replace_range` is used for a single line:
- `start_line == end_line`
- `start_character` is start of line
- `end_character` is end of line

## Backward Compatibility Strategy

### Phase 1: Dual Format Support
- Server accepts both old and new formats
- Client can handle both response formats
- Gradual migration path

### Phase 2: New Format Only
- Once all agents are updated, switch to new format
- Remove old format handling
- Clear deprecation warnings during Phase 1

### Phase 3: Client Update
- Update client to handle multi-actions
- Add UI feedback for multiple actions
- Update refactor history display

## Benefits of Multi-Action Protocol

1. **Complex Refactors**: Handle multi-step refactors in one operation
2. **Precision**: More precise control over edits (partial lines, insertions, deletions)
3. **Better UX**: See all changes at once, not a single code blob
4. **Undo Support**: Actions can be easily reverted
5. **Preview**: Can show before/after for each action
6. **Consistency**: Follows industry-standard LSP patterns
7. **Extensibility**: Easy to add new action types in the future

## Testing Strategy

### Unit Tests
- Test each action type independently
- Test edge cases (empty content, out of bounds, etc.)
- Test action ordering

### Integration Tests
- Test full refactor workflow
- Test multiple actions in sequence
- Test backward compatibility

### E2E Tests
- Real Neovim sessions
- Multiple refactor operations
- User workflows

## Migration Timeline

### Week 1: Design and Implementation
- Define exact JSON schema
- Implement Pydantic models
- Update refactor agent system prompt
- Implement client-side action application

### Week 2: Testing and Debugging
- Write unit tests
- Write integration tests
- Debug and fix edge cases
- Update documentation

### Week 3: Deployment
- Deploy to dev environment
- Gradual rollout to users
- Monitor for issues
- Collect feedback

## Conclusion

The multi-action refactor protocol provides a robust foundation for complex refactoring operations while maintaining backward compatibility and following industry standards. The design prioritizes:
- **Clarity**: Clear JSON schema and action types
- **Flexibility**: Support for various edit operations
- **Reliability**: Stable line number handling
- **Compatibility**: Seamless migration from current protocol
- **Extensibility**: Easy to add new features

This protocol will enable more sophisticated and precise code refactoring while providing better user experience and maintaining code quality.
