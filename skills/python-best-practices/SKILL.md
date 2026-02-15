---
name: python-best-practices
description: Python idioms, type hints, async/await patterns, and PEP 8 compliance
license: MIT
compatibility: opencode
metadata:
  audience: Python developers
  experience: intermediate
---

## What I do

Provide comprehensive Python best practices for writing idiomatic, readable, and maintainable Python code following PEP 8 guidelines.

### Core Areas Covered

**Idiomatic Python**
- Pythonic code patterns
- List comprehensions and generators
- Context managers
- Property decorators

**Type Hints**
- Type annotations
- Generic types
- Type checking with mypy
- Union and Optional types

**Async Patterns**
- Async/await syntax
- Coroutine best practices
- Event loops
- Concurrency patterns

**PEP 8 Compliance**
- Naming conventions
- Code formatting
- Import organization
- Documentation standards

## When to use me

Use this skill when you need to:
- Write idiomatic Python code
- Apply PEP 8 coding standards
- Use type hints effectively
- Implement async/await patterns
- Improve code readability and maintainability
- Follow Python best practices
- Integrate with type checkers (mypy, Pyright)
- Write clean, Pythonic code

### Common Scenarios

- **New Python Project**: Set up project structure and type checking
- **API Development**: Build REST APIs with FastAPI or Flask
- **Data Processing**: Work with data using Pythonic patterns
- **Scripting**: Write efficient Python scripts
- **Legacy Code Refactoring**: Modernize old Python code
- **Code Review**: Apply Python best practices during reviews
- **Onboarding**: Teach Python best practices to new developers

## Guidelines

### PEP 8 Compliance

**Naming Conventions**
```python
# ✅ GOOD - PEP 8 naming conventions

# Class names use CapWords (PascalCase)
class UserProfile:
    pass

class DatabaseConnection:
    pass

# Function and variable names use snake_case
def calculate_total(items):
    total = sum(items)
    return total

def get_user_by_id(user_id):
    user = database.query(user_id)
    return user

# Constants use UPPER_CASE
MAX_CONNECTIONS = 100
API_VERSION = 'v1'

# Private attributes use _single_underscore
class User:
    def __init__(self, name: str):
        self.name = name
        self._internal_id = None

# Protected attributes use __double_underscore
class BaseWidget:
    def __init__(self):
        self.__private_id = None

# Public attributes
user = User('Alice')
print(user.name)
```

**Code Formatting**
```python
# ✅ GOOD - Consistent 4-space indentation
def calculate_discount(price: float, discount_rate: float) -> float:
    """Calculate discounted price."""
    if discount_rate < 0 or discount_rate > 1:
        raise ValueError("Discount rate must be between 0 and 1")
    return price * (1 - discount_rate)

# ✅ GOOD - Blank lines between functions
def function_one():
    pass

# ✅ GOOD - Single blank line at start and end of file

def function_two():
    pass


# ✅ GOOD - Import organization
# Standard library imports
import os
import sys
from typing import List, Optional

# Third-party imports
import requests
from fastapi import FastAPI

# Local application imports
from app.models import User
from app.database import get_db
```

**Function Calls**
```python
# ✅ GOOD - Space after commas
result = function(arg1, arg2, arg3)

# ✅ GOOD - Space around operators
total = price * quantity
if value > 0:
    pass

# ✅ GOOD - Trailing commas in function calls
result = function(
    arg1,
    arg2,
    arg3,
)
```

### Idiomatic Python

**List Comprehensions**
```python
# ✅ GOOD - Using list comprehensions
numbers = [1, 2, 3, 4, 5]

# Transform
squares = [x * x for x in numbers]
# Output: [1, 4, 9, 16, 25]

# Filter
evens = [x for x in numbers if x % 2 == 0]
# Output: [2, 4]

# Chained operations
sorted_squares = sorted(x * x for x in numbers if x % 2 == 0)
# Output: [4, 16, 25]

# ❌ BAD - Using for loops (less Pythonic)
squares = []
for x in numbers:
    squares.append(x * x)

# ❌ BAD - Nested for loops
pairs = []
for x in numbers:
    for y in numbers:
        pairs.append((x, y))
```

**Dictionary Operations**
```python
# ✅ GOOD - Dictionary comprehensions
names = ['Alice', 'Bob', 'Charlie']
ages = [25, 30, 35]

users = {name: age for name, age in zip(names, ages)}
# Output: {'Alice': 25, 'Bob': 30, 'Charlie': 35}

# ✅ GOOD - Using dict.get()
value = data_dict.get(key, default_value)
value = data_dict.get(key)  # Returns None if key doesn't exist

# ✅ GOOD - Dictionary merging (Python 3.9+)
merged = {**dict1, **dict2}

# ✅ GOOD - Set comprehensions
unique_squares = {x * x for x in range(10)}
# Output: {0, 1, 4, 9, 16, 25, 36, 49, 64, 81}
```

**Context Managers**
```python
# ✅ GOOD - Using context managers
with open('file.txt', 'r') as f:
    content = f.read()
# File is automatically closed

# ✅ GOOD - Context managers with timeout
from contextlib import timeout

def process_with_timeout():
    with timeout(5):
        return complex_operation()

# ✅ GOOD - Custom context manager
from contextlib import contextmanager

@contextmanager
def database_connection():
    conn = connect_to_database()
    try:
        yield conn
    finally:
        conn.close()

# Usage
with database_connection() as conn:
    result = conn.query('SELECT * FROM users')
    # Database connection is automatically closed
```

**Property Decorators**
```python
# ✅ GOOD - Using property for computed attributes
class Rectangle:
    def __init__(self, width: float, height: float):
        self._width = width
        self._height = height

    @property
    def width(self) -> float:
        return self._width

    @width.setter
    def width(self, value: float):
        if value <= 0:
            raise ValueError("Width must be positive")
        self._width = value

    @property
    def height(self) -> float:
        return self._height

    @height.setter
    def height(self, value: float):
        if value <= 0:
            raise ValueError("Height must be positive")
        self._height = value

    @property
    def area(self) -> float:
        return self.width * self.height

# Usage
rect = Rectangle(10, 5)
print(rect.width)  # Uses property getter
print(rect.area)   # Uses computed property
rect.width = 15    # Uses property setter
```

### Type Hints

**Type Annotations**
```python
# ✅ GOOD - Type hints for functions
def calculate_total(price: float, quantity: int) -> float:
    """Calculate the total cost."""
    return price * quantity

# ✅ GOOD - Return type hints
def get_user(user_id: int) -> Optional[User]:
    """Get user by ID or None if not found."""
    user = database.query(user_id)
    return user

# ✅ GOOD - Union types
from typing import Union

def process_value(value: Union[int, str]) -> Union[int, str]:
    return value.upper() if isinstance(value, str) else value

# ✅ GOOD - Optional types
from typing import Optional

def greet(name: Optional[str] = None) -> str:
    """Greet user by name or default message."""
    return name if name else "Hello, world!"

# ✅ GOOD - Dict and List type hints
from typing import List, Dict, Tuple

def process_users(users: List[User]) -> Dict[str, int]:
    """Return a dict mapping names to ages."""
    return {user.name: user.age for user in users}

# ✅ GOOD - Generic types
from typing import TypeVar, Generic

T = TypeVar('T')

def get_first(items: List[T]) -> T:
    """Get the first item from a list."""
    return items[0]

# Usage
first_int = get_first([1, 2, 3])  # Type: int
first_str = get_first(['a', 'b'])  # Type: str
```

**Type Checking with mypy**
```python
# ✅ GOOD - Type hints for classes
from typing import Optional

class User:
    def __init__(self, name: str, email: Optional[str] = None):
        self.name = name
        self.email = email

    def get_email(self) -> Optional[str]:
        return self.email

    def set_email(self, email: str) -> None:
        self.email = email

# Run type checking:
# $ mypy --strict app.py

# This will catch:
# - Missing type annotations
# - Type mismatches
# - Potential None values used incorrectly
# - Type errors in function calls
```

### Async Patterns

**Async/Await Syntax**
```python
# ✅ GOOD - Async/await basics
import asyncio

async def fetch_user(user_id: int) -> dict:
    """Fetch a user from the API."""
    response = await http_client.get(f'/users/{user_id}')
    return response.json()

async def fetch_multiple_users(user_ids: List[int]) -> List[dict]:
    """Fetch multiple users concurrently."""
    tasks = [fetch_user(user_id) for user_id in user_ids]
    return await asyncio.gather(*tasks)

# Usage
async def main():
    users = await fetch_multiple_users([1, 2, 3])
    for user in users:
        print(user)

asyncio.run(main())
```

**Async Functions and Coroutines**
```python
# ✅ GOOD - Proper async function usage
import asyncio

async def process_data(data: str) -> str:
    """Process data asynchronously."""
    await asyncio.sleep(0.1)  # Simulate I/O
    return data.upper()

async def main():
    # Create tasks
    task1 = process_data('hello')
    task2 = process_data('world')

    # Wait for both tasks to complete
    result1, result2 = await asyncio.gather(task1, task2)
    print(result1, result2)

# Usage
asyncio.run(main())
```

**Event Loops**
```python
# ✅ GOOD - Creating and managing event loops
async def worker(name: str, duration: int):
    print(f"Worker {name} started")
    await asyncio.sleep(duration)
    print(f"Worker {name} finished")

async def main():
    # Create multiple workers
    workers = [
        worker("Alice", 2),
        worker("Bob", 1),
        worker("Charlie", 3)
    ]

    # Run all workers concurrently
    await asyncio.gather(*workers)

asyncio.run(main())
```

### PEP 8 Style Guide

**Docstrings**
```python
# ✅ GOOD - Google style docstrings
def calculate_discount(price: float, discount_rate: float) -> float:
    """Calculate the discounted price.

    Args:
        price: The original price.
        discount_rate: The discount rate as a decimal (e.g., 0.1 for 10%).

    Returns:
        The discounted price.

    Raises:
        ValueError: If price is negative or discount_rate is out of range.
    """
    if price < 0:
        raise ValueError("Price cannot be negative")
    if discount_rate < 0 or discount_rate > 1:
        raise ValueError("Discount rate must be between 0 and 1")
    return price * (1 - discount_rate)

# ✅ GOOD - NumPy style docstrings
def calculate_discount(price: float, discount_rate: float) -> float:
    """Calculate the discounted price.

    Parameters
    ----------
    price : float
        The original price.
    discount_rate : float
        The discount rate as a decimal (e.g., 0.1 for 10%).

    Returns
    -------
    float
        The discounted price.

    Raises
    ------
    ValueError
        If price is negative or discount_rate is out of range.
    """
    if price < 0:
        raise ValueError("Price cannot be negative")
    if discount_rate < 0 or discount_rate > 1:
        raise ValueError("Discount rate must be between 0 and 1")
    return price * (1 - discount_rate)
```

**String Formatting**
```python
# ✅ GOOD - f-strings (Python 3.6+)
name = "Alice"
age = 30
print(f"Hello, {name}! You are {age} years old.")

# ✅ GOOD - format() method
print("Hello, {}! You are {} years old.".format(name, age))

# ✅ GOOD - %-style formatting (deprecated but still used)
print("Hello, %s! You are %d years old." % (name, age))

# ✅ GOOD - JSON formatting
import json
data = {"name": "Alice", "age": 30}
print(json.dumps(data, indent=2))
```

### Common Python Best Practices

**Use Enums for Constants**
```python
# ✅ GOOD - Using Enum for constants
from enum import Enum

class UserRole(Enum):
    ADMIN = "admin"
    EDITOR = "editor"
    VIEWER = "viewer"

def get_role_description(role: UserRole) -> str:
    """Get description for role."""
    if role == UserRole.ADMIN:
        return "Full system access"
    elif role == UserRole.EDITOR:
        return "Can edit content"
    else:
        return "Read-only access"

# Usage
print(get_role_description(UserRole.ADMIN))
```

**Use pathlib**
```python
# ✅ GOOD - Using pathlib for file operations
from pathlib import Path

# Create directories
data_dir = Path("data")
data_dir.mkdir(parents=True, exist_ok=True)

# Write files
file_path = data_dir / "output.txt"
file_path.write_text("Hello, World!")

# Read files
content = file_path.read_text()

# List files
for file in data_dir.glob("*.txt"):
    print(file)

# Navigate paths
config = Path("app") / "config" / "settings.json"
```

**Use Dataclasses**
```python
# ✅ GOOD - Using dataclasses for simple classes
from dataclasses import dataclass, field
from typing import List

@dataclass
class User:
    id: int
    name: str
    email: str
    roles: List[str] = field(default_factory=list)

    def __str__(self) -> str:
        return f"User(id={self.id}, name={self.name})"

# Usage
user = User(id=1, name="Alice", email="alice@example.com")
user.roles = ["admin", "editor"]
print(user)
```

**Use Type Aliases**
```python
# ✅ GOOD - Type aliases for readability
from typing import List, Dict, Tuple

UserList = List[User]
UserDict = Dict[str, User]
UserPair = Tuple[int, str]

def process_users(users: UserList) -> UserDict:
    """Process users and return a dict."""
    return {user.name: user for user in users}
```

## Common Python Pitfalls to Avoid

- **Not using type hints** - Makes code harder to maintain
- **Ignoring PEP 8** - Code becomes inconsistent and hard to read
- **Using mutable default arguments** - Can cause subtle bugs
- **Using list and dict comprehensions incorrectly** - Can be unreadable when too complex
- **Not using context managers** - Resources may not be cleaned up
- **Using f-strings incorrectly** - Complex expressions should be on multiple lines
- **Not using property decorators** - Encapsulation is not maintained
- **Not using type checking** - Runtime errors can go undetected
- **Using print for logging** - Not suitable for production
- **Not using async properly** - Blocking I/O in async functions

## Resources

- [PEP 8 - Style Guide for Python Code](https://peps.python.org/pep-0008/)
- [Python Type Hints Guide](https://docs.python.org/3/library/typing.html)
- [Python Official Documentation](https://docs.python.org/3/)
- [Real Python](https://realpython.com/)
- [The Hitchhiker's Guide to Python](https://docs.python-guide.org/)
- [Python Mypy Documentation](https://mypy.readthedocs.io/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Python Asyncio Documentation](https://docs.python.org/3/library/asyncio.html)

## Ask Before Proceeding

Clarify these questions when needed:
- What Python version is being used (3.7, 3.8, 3.9, 3.10, etc.)?
- What type checking tools are being used (mypy, Pyright, etc.)?
- Are there existing code style requirements (Black, flake8, etc.)?
- Should strict type checking be enabled?
- What async frameworks are being used (asyncio, FastAPI, etc.)?
- Are there specific PEP 8 compliance requirements?
