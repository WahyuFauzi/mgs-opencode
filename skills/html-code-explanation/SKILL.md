---
name: html-code-explanation
description: Generate interactive HTML to explain code with simple template structure
license: MIT
compatibility: opencode
metadata:
  audience: Developers
  experience: all
---

## What I do

Generate self-contained HTML files that explain code concepts with interactive elements, code highlighting, and dynamic content generation based on user questions.

### Core Capabilities

**Dynamic HTML Generation**
- Create custom HTML templates based on user questions
- Include code snippets with syntax highlighting
- Add interactive elements (tabs, accordions, tooltips)
- Generate explanatory text alongside code

**Interactive Features**
- Syntax-highlighted code blocks
- Collapsible sections for complex explanations
- Quick reference tables
- External resource links

**Customizable Output**
- Simple, clean template structure
- Easy to customize with user's own HTML/CSS
- Responsive design for all devices
- Export as single HTML file

## When to use me

Use this skill when you need to:
- Explain code concepts in a visually engaging way
- Create interactive documentation for code examples
- Generate educational materials about programming topics
- Provide code walkthroughs with visual elements
- Create code comparison examples
- Generate technical documentation with interactive elements

### Common Scenarios

- **Code Tutorials**: Step-by-step code explanations
- **API Documentation**: Interactive API usage examples
- **Learning Resources**: Educational content with code samples
- **Technical Presentations**: Code demonstrations with explanations
- **Code Reviews**: Visual code breakdowns
- **Interview Prep**: Interactive coding concept explanations

## How to Use

### Basic Usage

**For a single code explanation:**
```
Use html-code-explanation skill with:
- Code snippet
- Explanation points
- Question from user
```

**For multi-part explanations:**
```
Use html-code-explanation skill to create:
- Introduction
- Code examples
- Step-by-step walkthrough
- Summary/Key takeaways
```

### Template Structure

**HTML Template:**
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Code Explanation - [Topic]</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-[language].min.js"></script>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    pre { background: #2d2d2d; border-radius: 8px; }
    code { background: transparent; }
    .explanation { max-width: 800px; margin: 0 auto; }
  </style>
</head>
<body>
  <div class="explanation">
    <h1>[Title]</h1>
    <p>[Introduction text]</p>

    <h2>Key Concepts</h2>
    <ul>
      <li>[Concept 1]</li>
      <li>[Concept 2]</li>
      <li>[Concept 3]</li>
    </ul>

    <h2>Code Example</h2>
    <pre><code class="language-[language]">
[Code snippet]
    </code></pre>

    <h2>Explanation</h2>
    <p>[Step-by-step explanation]</p>

    <h2>Example Output</h2>
    <p>[What the code produces]</p>
  </div>
</body>
</html>
```

## Interactive Elements

**Tabs for Code Comparison:**
```html
<div class="tabs">
  <button class="tab-button active">Before</button>
  <button class="tab-button">After</button>
</div>
<div class="tab-content">
  <pre><code class="language-[language]">[Before code]</code></pre>
  <pre><code class="language-[language]">[After code]</code></pre>
</div>
```

**Accordion for Details:**
```html
<div class="accordion">
  <details class="accordion-item">
    <summary>What is [Concept]?</summary>
    <div>[Detailed explanation]</div>
  </details>
  <details class="accordion-item">
    <summary>Why use [Concept]?</summary>
    <div>[Detailed explanation]</div>
  </details>
</div>
```

**Quick Reference Table:**
```html
<table class="reference-table">
  <tr>
    <th>Feature</th>
    <th>Description</th>
    <th>Example</th>
  </tr>
  <tr>
    <td>[Feature 1]</td>
    <td>[Description]</td>
    <td>[Example]</td>
  </tr>
  <tr>
    <td>[Feature 2]</td>
    <td>[Description]</td>
    <td>[Example]</td>
  </tr>
</table>
```

## Best Practices

### Content Organization

**Clear Structure:**
- Start with a brief introduction
- Use numbered sections
- Include code before explanation
- End with key takeaways

**Conciseness:**
- Keep explanations under 2-3 sentences each
- Use bullet points for lists
- Focus on essential concepts

**User-Centric:**
- Address user's specific question
- Provide relevant examples
- Include practical use cases
- Link to additional resources

### Code Quality

**Code Snippets:**
- Minimal, focused examples
- Include necessary imports
- Add comments for complex logic
- Show output when helpful

**Syntax Highlighting:**
- Use appropriate language class
- Enable Prism.js or similar library
- Include CSS for styling

### Design Guidelines

**Colors:**
- Dark theme for code (reduces eye strain)
- Clear contrast for text
- Consistent accent colors

**Typography:**
- System fonts for better performance
- Readable font sizes (16px+)
- Line height 1.5-1.6

**Responsiveness:**
- Mobile-friendly layout
- Horizontal scrolling for long code
- Flexible width containers

## Example Output

**Code Explanation for Python Loops:**

```
Title: Understanding Python For Loops

Introduction: For loops are used to iterate over sequences in Python.

Key Concepts:
- Iterating through lists
- Using range() function
- Nested loops

Code Example:
```python
# Example: Iterate through a list
fruits = ['apple', 'banana', 'cherry']

for fruit in fruits:
    print(f"I like {fruit}")

# Example: Using range()
for i in range(5):
    print(f"Number: {i}")
```

Explanation:
1. First example loops through each fruit in the list
2. Second example uses range() to generate numbers 0-4

Example Output:
I like apple
I like banana
I like cherry
Number: 0
Number: 1
Number: 2
Number: 3
Number: 4
```

## Common Use Cases

**1. Code Documentation**
- Document library functions
- Explain algorithms
- Show API usage

**2. Educational Content**
- Teach programming concepts
- Provide code tutorials
- Create learning resources

**3. Technical Presentations**
- Code walkthroughs
- Architecture explanations
- System design demos

**4. Interview Prep**
- Code explanation practice
- Algorithm breakdowns
- System design examples

## Customization Tips

**Changing the Theme:**
- Modify CSS variables
- Use different Prism.js themes
- Customize color schemes

**Adding Features:**
- Include search functionality
- Add table of contents
- Include navigation links

**Embedding Resources:**
- Add external images
- Include YouTube videos
- Link to documentation

## Resources

**Libraries:**
- Prism.js - Syntax highlighting
- Highlight.js - Alternative syntax highlighter
- Marked.js - Markdown parsing
- MathJax - Mathematical notation

**Templates:**
- CodePen templates
- HTML templates
- CSS frameworks (Tailwind, Bootstrap)

**Documentation:**
- HTML5 documentation
- CSS3 documentation
- JavaScript MDN docs

## Ask Before Proceeding

Before generating HTML output:
- What programming language is being used?
- What specific code needs to be explained?
- What level of detail is needed?
- Should interactive elements be included?
- Any specific design preferences?

---

**Usage Note:** This skill generates self-contained HTML files that can be opened in any browser. All resources are loaded from CDNs, so an internet connection is required for styling and syntax highlighting to work properly.
