---
name: code-graph-analysis
description: Guide for using CodeGraphContext MCP tools for code analysis and documentation generation.
license: MIT
source: https://github.com/CodeGraphContext/CodeGraphContext
metadata:
  author: OpenCode AI
  version: 0.1.0
---

## Overview
This skill provides a set of instructions and examples for leveraging the CodeGraphContext (CGC) MCP to perform advanced code analysis and generate richer documentation. It covers:

1. **Indexing** – Build a graph database of the codebase.
2. **Querying** – Use natural‑language style tools to discover functions, classes, relationships, and metrics.
3. **Visualization** – Generate interactive diagrams or Neo4j Browser links.
4. **Documentation** – Integrate graph data into EVA’s HTML output.

## Prerequisites
- Install the CGC CLI:
  ```bash
  pip install codegraphcontext
  ```
- Start the MCP server (see `opencode.jsonc` for configuration).
- Ensure the `cgc` command is available in your PATH.

## Core MCP Tools
| Tool | Purpose | Example Command | Use in EVA
|------|---------|-----------------|------------
| `find_code` | Locate a symbol or pattern | `cgc find_code "User"` | Find the file/class for documentation.
| `analyze_code_relationships` | Call graph, inheritance, imports | `cgc analyze callers process_payment` | Build call‑dependency diagrams.
| `calculate_cyclomatic_complexity` | Complexity metrics | `cgc analyze complexity --threshold 10` | Highlight complex functions in docs.
| `find_dead_code` | Detect unused code | `cgc analyze dead-code` | Warn about dead sections.
| `visualize_graph_query` | Generate Neo4j Browser link | `cgc visualize` | Embed interactive graph URLs.

## Example Workflow
1. **Index the repo** (once per project):
   ```bash
   cgc index .
   ```
2. **Generate a call‑graph for a module**:
   ```bash
   cgc analyze callers MyService
   ```
3. **Create a Mermaid diagram** (EVA can embed the output):
   ```mermaid
   graph TD
   A[MyService] --> B[processPayment]
   B --> C[sendEmail]
   ```
4. **Add complexity highlights**:
   ```bash
   cgc analyze complexity --threshold 15
   ```
   EVA can then annotate functions exceeding the threshold.

## Integration Tips for EVA
- **Use `find_code`** to locate the file containing a target function/class.
- **Use `analyze_code_relationships`** to build a dependency graph and embed it in the HTML.
- **Leverage `visualize_graph_query`** to provide a live Neo4j Browser link for complex sections.
- **Cache results**: Store the output of `cgc` commands in EVA’s cache directory to avoid repeated queries.

## Troubleshooting
- If `cgc` is not found, ensure it’s in PATH or specify the full path in `opencode.jsonc`.
- For large projects, consider using the `--max-file-size` flag or splitting the index into sub‑projects.
- If the graph server is slow, switch to the default FalkorDB Lite by omitting `NEO4J_URI`.

---
