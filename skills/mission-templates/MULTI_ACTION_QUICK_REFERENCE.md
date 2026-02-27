# Multi-Action Refactor Protocol - Quick Reference

## JSON Schema

### Request (Unchanged)
```json
POST /api/agent/refactor-code
{
  "data": {
    "code": "original code",
    "start_line": 10,
    "end_line": 20,
    "filepath": "/path/to/file.py",
    "filetype": "python",
    "instruction": "Refactor instruction",
    "root_dir": "project/root"
  }
}
```

### Response (New Format)
```json
{
  "success": true,
  "actions": [
    {
      "type": "replace_line",  // or replace_range, insert, delete
      "line": 10,
      "character": 0,
      "content": "new code"
    },
    {
      "type": "insert",
      "line": 11,
      "character": 0,
      "content": "added code"
    }
  ],
  "explanation": "Explanation of changes",
  "context": {
    "filepath": "/path/to/file.py",
    "filetype": "python",
    "total_actions": 2
  }
}
```

## Action Types Reference

### replace_line
Replace a single line.

```json
{
  "type": "replace_line",
  "line": 10,              // 1-indexed line number
  "character": 0,          // 0-indexed column (0 = full line)
  "content": "new line code"
}
```

**Use when:** Changing a single line, replacing from the beginning of the line.

---

### replace_range
Replace a range of lines.

```json
{
  "type": "replace_range",
  "start_line": 10,        // 1-indexed start line
  "start_character": 0,    // 0-indexed start column
  "end_line": 20,          // 1-indexed end line (exclusive)
  "end_character": 0,      // 0-indexed end column
  "content": "multi\nline\ncode"
}
```

**Use when:** Replacing multiple lines with new content.

---

### insert
Insert content at a position (doesn't replace).

```json
{
  "type": "insert",
  "line": 10,              // 1-indexed line number
  "character": 0,          // 0-indexed column
  "content": "inserted code"
}
```

**Use when:** Adding new code without deleting existing content.

---

### delete
Delete content at a range.

```json
{
  "type": "delete",
  "start_line": 10,        // 1-indexed start line
  "start_character": 0,    // 0-indexed start column
  "end_line": 20,          // 1-indexed end line (exclusive)
  "end_character": 0       // 0-indexed end column
}
```

**Use when:** Removing code.

---

## Position Conventions

### Line Numbers
- **1-indexed**: Line 1 = first line
- Compatible with Neovim cursor positions
- User-friendly

### Character Positions
- **0-indexed**: Character 0 = first character
- Compatible with LSP standards
- More precise control

---

## Example: Complex Refactor

**Original Code:**
```python
def calculate_total(items):
    total = 0
    for item in items:
        total += item.price
    return total
```

**Refactor Instruction:** "Extract discount calculation and improve variable names"

**Response:**
```json
{
  "success": true,
  "actions": [
    {
      "type": "replace_line",
      "line": 2,
      "character": 0,
      "content": "def calculate_total(items: List[Item]) -> float:"
    },
    {
      "type": "insert",
      "line": 3,
      "character": 0,
      "content": "    \"\"\"Calculate total price with discount.\"\"\"\n    subtotal = sum(item.price for item in items)\n    discount = calculate_discount(subtotal)"
    },
    {
      "type": "replace_line",
      "line": 4,
      "character": 0,
      "content": "    total = subtotal - discount"
    },
    {
      "type": "replace_line",
      "line": 6,
      "character": 0,
      "content": "    return total"
    }
  ],
  "explanation": "Extracted discount calculation and added type hints",
  "context": {
    "filepath": "/path/to/calc.py",
    "filetype": "python",
    "total_actions": 4
  }
}
```

---

## Implementation Notes

### Order of Application
- **Recommended**: Bottom-to-top (last action first)
- **Reason**: Line numbers remain stable
- **Alternative**: Top-to-bottom with line number adjustments

### Edge Cases
1. Empty content → Treat as delete/insert with no effect
2. Character out of range → Clamp to line length
3. Overlapping actions → Last action wins
4. Multi-line insert at EOF → Ensure buffer grows

### Backward Compatibility
- Server accepts both old (`refactored_code`) and new (`actions`) formats
- Client can handle both response formats
- No breaking changes

---

## Testing Examples

### Single Line Replace
```json
{
  "actions": [
    {
      "type": "replace_line",
      "line": 10,
      "character": 0,
      "content": "def new_function():"
    }
  ]
}
```

### Multi-Line Replace
```json
{
  "actions": [
    {
      "type": "replace_range",
      "start_line": 10,
      "start_character": 0,
      "end_line": 20,
      "end_character": 0,
      "content": "def new_function():\n    pass\n    return result"
    }
  ]
}
```

### Insert and Delete
```json
{
  "actions": [
    {
      "type": "insert",
      "line": 10,
      "character": 0,
      "content": "def helper():\n    return 42"
    },
    {
      "type": "delete",
      "start_line": 3,
      "start_character": 0,
      "end_line": 3,
      "end_character": 0
    }
  ]
}
```

---

## Next Steps

1. Review this document
2. Implement Pydantic models in `models/agent_req.py`
3. Update LLM system prompt in `agents/refactor_agent.py`
4. Implement client-side action application in Lua
5. Test with various refactor scenarios
6. Deploy and monitor
