---
name: testing-specialist
description: Comprehensive testing methodologies, test planning, execution, and coverage analysis
license: MIT
compatibility: opencode
metadata:
  audience: developers
  experience: intermediate
---

## What I do

Provide practical testing guidance for ensuring code quality through systematic testing approaches, focusing on concepts and methodologies rather than specific tools.

### Core Areas Covered

**Testing Methodologies**
- Unit testing principles and patterns
- Integration testing strategies
- End-to-end (E2E) testing approaches
- Test-driven development (TDD) concepts

**Test Planning & Analysis**
- Identifying what needs testing
- Analyzing existing test coverage
- Identifying edge cases and failure scenarios
- Test prioritization strategies

**Quality Assurance**
- Test result interpretation and reporting
- Coverage analysis and improvement
- Debugging test failures
- Quality gates and validation criteria

**Test Documentation**
- Creating clear test reports
- Documenting test cases and scenarios
- Communicating testing status and recommendations

## When to use me

Use this skill when you need to:
- Plan testing strategies for new or existing code
- Understand different testing methodologies and when to apply them
- Analyze test coverage and identify gaps
- Create structured test reports
- Debug and investigate test failures
- Establish quality assurance processes
- Guide team members on testing best practices

### Common Scenarios

- **New feature development**: Plan testing approach for new functionality
- **Code refactoring**: Ensure existing functionality remains intact
- **Bug investigation**: Reproduce and test bug fixes
- **Coverage improvement**: Identify and address untested code paths
- **Test suite maintenance**: Review and optimize existing tests
- **Team onboarding**: Teach testing concepts and workflows
- **Quality assurance**: Establish validation criteria before deployment

## Testing Workflow

### 1. Understand Requirements
- What code/functionality needs testing?
- What are the expected behaviors and outcomes?
- What edge cases and failure scenarios should be considered?
- What are the success criteria for the tests?

### 2. Analyze Existing Coverage
- Identify existing tests and their scope
- Determine untested code paths and functionality
- Review test configuration and setup
- Assess test quality and effectiveness

### 3. Plan Testing Approach
- Select appropriate testing methodologies (unit, integration, E2E)
- Define test cases and scenarios
- Establish test data and environment requirements
- Set coverage targets and quality gates

### 4. Execute and Analyze
- Run tests systematically
- Interpret test results (pass/fail status)
- Analyze failure details and stack traces
- Review coverage reports and metrics

### 5. Report and Recommend
- Create clear test reports with actionable insights
- Document coverage gaps and improvement opportunities
- Provide recommendations for test enhancements
- Communicate testing status and quality assessment

## Test Report Format

```markdown
## Test Report

### Summary
- **Status**: PASS / FAIL
- **Tests Run**: X
- **Passed**: Y
- **Failed**: Z
- **Coverage**: N%

### Failures
| Test | File | Error |
|------|------|-------|
| test_name | path/to/test.js | Assertion failed... |

### Coverage Gaps
- [ ] Untested module: path/to/module.js
- [ ] Missing edge case: function X with null input
- [ ] Boundary condition: value Y at limits

### Recommendations
- [ ] Add tests for specific functionality
- [ ] Increase coverage on critical modules
- [ ] Improve test data for edge cases
- [ ] Refactor tests for better maintainability
```

## Testing Principles

### Test-First Mindset
- Consider testing requirements early in development
- Think about edge cases and failure scenarios during design
- Write tests that validate both expected and unexpected behavior

### Thorough Coverage
- Aim to test all code paths and logical branches
- Include boundary conditions and edge cases
- Test error handling and exception paths
- Validate both success and failure scenarios

### Clear Documentation
- Write descriptive test names that explain intent
- Document test assumptions and preconditions
- Provide clear failure messages that help debugging
- Maintain test documentation alongside code

### Maintainable Tests
- Keep tests independent and isolated
- Avoid test interdependencies that cause brittle suites
- Use appropriate abstractions for test setup
- Regularly review and refactor test code

## Quality Gates

### Before Code Ships
- All tests should pass (green status)
- Coverage meets established thresholds
- Critical functionality has adequate test coverage
- Edge cases and error conditions are tested
- Test results are documented and reviewed

### Continuous Improvement
- Regularly review and update test suites
- Increase coverage on critical code paths
- Refactor tests for better performance and maintainability
- Incorporate new testing methodologies as appropriate

## Ask Before Proceeding

Clarify these questions when needed:
- What is the testing framework or tools being used?
- What are the coverage requirements or targets?
- What are the critical functionalities that need priority testing?
- Are there existing tests that need to be maintained or updated?
- What is the testing environment and setup requirements?