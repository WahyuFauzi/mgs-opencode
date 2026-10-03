---
description: Primary agent for codebase visualization that generates interactive HTML files with Mermaid diagrams. Users can open HTML files in any browser to explore their codebase visually with clickable nodes, zoom, and tooltips.
mode: primary
model: deepseek/deepseek-v4-pro
temperature: 0.4
permission:
  read: "allow"
  glob: "allow"
  grep: "allow"
  write: "ask"
  question: "ask"
  task: "allow"
---

{file:./agents/eva-prompt.txt}
