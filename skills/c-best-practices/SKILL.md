---
name: c-best-practices
description: C programming best practices, memory safety, modern C patterns, and defensive coding
license: MIT
compatibility: opencode
metadata:
  audience: C developers
  experience: intermediate
---

## What I do

Provide comprehensive C programming best practices for writing secure, efficient, and maintainable C code following modern C standards and defensive programming techniques.

### Core Areas Covered

**Memory Management**
- Memory allocation and deallocation
- Memory leaks
- Buffer overflow prevention
- Smart pointers and RAII concepts

**Modern C Patterns**
- C11/C17 features
- Using standard library effectively
- Type safety improvements
- Error handling patterns

**Defensive Programming**
- Input validation
- Boundary checking
- Null pointer checks
- Error recovery

**Performance**
- Efficient memory usage
- Cache optimization
- Algorithm selection
- Benchmarking

## When to use me

Use this skill when you need to:
- Write safe and efficient C code
- Implement memory management correctly
- Use modern C features (C11, C17, C20)
- Follow C programming best practices
- Prevent memory leaks and buffer overflows
- Implement defensive coding patterns
- Optimize performance
- Debug memory issues
- Follow C standards (C89, C99, C11, C17, C20)

### Common Scenarios

- **Embedded Systems**: Write efficient and safe C code
- **Systems Programming**: Implement low-level functionality
- **Driver Development**: Create secure drivers
- **Performance Critical Code**: Optimize for speed and memory
- **Legacy Code Refactoring**: Modernize old C code
- **Security Audits**: Ensure code security
- **Cross-Platform Development**: Write portable C code

## Guidelines

### Modern C Features

**C11/C17 Features**
```c
// ✅ GOOD - Use _Generic for type-safe operations (C11)
#define min(a, b) _Generic((a), \
    int: (a) < (b) ? (a) : (b), \
    long: (a) < (b) ? (a) : (b), \
    float: (a) < (b) ? (a) : (b), \
    double: (a) < (b) ? (a) : (b) \
)

#define max(a, b) _Generic((a), \
    int: (a) > (b) ? (a) : (b), \
    long: (a) > (b) ? (a) : (b), \
    float: (a) > (b) ? (a) : (b), \
    double: (a) > (b) ? (a) : (b) \
)

// ✅ GOOD - Using atomic operations (C11)
#include <stdatomic.h>

typedef struct {
    atomic_int counter;
} SharedCounter;

void increment_counter(SharedCounter* counter) {
    atomic_fetch_add_explicit(&counter->counter, 1, memory_order_relaxed);
}

int get_counter(SharedCounter* counter) {
    return atomic_load_explicit(&counter->counter, memory_order_relaxed);
}

// ✅ GOOD - Anonymous structs and unions (C11)
typedef struct {
    union {
        int int_value;
        double double_value;
        struct {
            char* str_value;
            size_t length;
        };
    };
    enum { INT, DOUBLE, STRING } type;
} Variant;

void print_variant(Variant* v) {
    switch (v->type) {
        case INT:
            printf("%d\n", v->int_value);
            break;
        case DOUBLE:
            printf("%f\n", v->double_value);
            break;
        case STRING:
            printf("%s\n", v->str_value);
            break;
    }
}
```

**Using Standard Library Effectively**
```c
// ✅ GOOD - Use stdlib.h functions safely
#include <stdlib.h>
#include <string.h>

// ✅ GOOD - Safe string copying
void safe_strcpy(char* dest, const char* src, size_t dest_size) {
    if (dest == NULL || src == NULL || dest_size == 0) {
        return;
    }

    size_t src_len = strlen(src);
    if (src_len >= dest_size) {
        src_len = dest_size - 1;
    }

    memcpy(dest, src, src_len);
    dest[src_len] = '\0';
}

// ✅ GOOD - Using stdbool.h
#include <stdbool.h>
#include <string.h>

bool is_empty(const char* str) {
    return str == NULL || str[0] == '\0';
}

// ✅ GOOD - Using stdint.h for fixed-width integers
#include <stdint.h>

typedef struct {
    int32_t id;
    int64_t timestamp;
    uint32_t flags;
} Record;

// ✅ GOOD - Using stdbool.h for boolean types
#include <stdbool.h>

typedef struct {
    bool is_active;
    bool is_admin;
    bool is_verified;
} UserStatus;

// ❌ BAD - Using int instead of bool
typedef struct {
    int is_active;  // Use bool instead
} UserStatus;

// ❌ BAD - Insecure string operations
void strcpy_insecure(char* dest, const char* src) {
    strcpy(dest, src);  // No bounds checking - dangerous!
}
```

### Memory Management

**Memory Allocation and Deallocation**
```c
// ✅ GOOD - Allocate memory safely
void* safe_malloc(size_t size) {
    if (size == 0) {
        return NULL;
    }

    void* ptr = malloc(size);
    if (ptr == NULL) {
        perror("malloc failed");
        exit(EXIT_FAILURE);
    }

    // Initialize memory (good practice)
    memset(ptr, 0, size);
    return ptr;
}

// ✅ GOOD - Safe string allocation
char* safe_strdup(const char* str) {
    if (str == NULL) {
        return NULL;
    }

    size_t len = strlen(str) + 1;
    char* copy = safe_malloc(len);
    if (copy != NULL) {
        memcpy(copy, str, len);
    }
    return copy;
}

// ✅ GOOD - Using realloc with safety
void* safe_realloc(void* ptr, size_t new_size) {
    if (new_size == 0) {
        free(ptr);
        return NULL;
    }

    void* new_ptr = realloc(ptr, new_size);
    if (new_ptr == NULL) {
        perror("realloc failed");
        free(ptr);  // Don't lose original pointer
        exit(EXIT_FAILURE);
    }

    return new_ptr;
}

// ✅ GOOD - Deallocating nested structures
void free_person(Person* person) {
    if (person == NULL) {
        return;
    }

    if (person->name != NULL) {
        free(person->name);
    }

    if (person->address != NULL) {
        free_address(person->address);
    }

    free(person);
}

// ✅ GOOD - Using custom free wrapper
void safe_free(void** ptr) {
    if (ptr == NULL || *ptr == NULL) {
        return;
    }

    free(*ptr);
    *ptr = NULL;
}

// Usage:
char* name = safe_strdup("John Doe");
safe_free((void**)&name);  // Prevents dangling pointer
```

**Memory Leak Prevention**
```c
// ✅ GOOD - Track allocated memory
typedef struct {
    void** allocations;
    size_t count;
    size_t capacity;
} MemoryTracker;

MemoryTracker* create_memory_tracker(void) {
    MemoryTracker* tracker = safe_malloc(sizeof(MemoryTracker));
    tracker->allocations = safe_malloc(sizeof(void*) * 10);
    tracker->count = 0;
    tracker->capacity = 10;
    return tracker;
}

void track_allocation(MemoryTracker* tracker, void* ptr) {
    if (tracker->count >= tracker->capacity) {
        tracker->capacity *= 2;
        tracker->allocations = safe_realloc(
            tracker->allocations,
            sizeof(void*) * tracker->capacity
        );
    }

    tracker->allocations[tracker->count++] = ptr;
}

void cleanup_memory_tracker(MemoryTracker* tracker) {
    if (tracker == NULL) {
        return;
    }

    for (size_t i = 0; i < tracker->count; i++) {
        free(tracker->allocations[i]);
    }

    free(tracker->allocations);
    free(tracker);
}

// Usage:
MemoryTracker* tracker = create_memory_tracker();
track_allocation(tracker, safe_malloc(100));
// ... more allocations ...
cleanup_memory_tracker(tracker);
```

### Buffer Overflow Prevention

**Safe String Operations**
```c
// ✅ GOOD - Secure string copying with bounds checking
size_t safe_strncpy(char* dest, const char* src, size_t dest_size) {
    if (dest == NULL || src == NULL || dest_size == 0) {
        return 0;
    }

    size_t src_len = strlen(src);

    if (src_len >= dest_size) {
        src_len = dest_size - 1;
    }

    memcpy(dest, src, src_len);
    dest[src_len] = '\0';

    return src_len;
}

// ✅ GOOD - Secure string concatenation
void safe_strcat(char* dest, const char* src, size_t dest_size) {
    if (dest == NULL || src == NULL || dest_size == 0) {
        return;
    }

    size_t dest_len = strlen(dest);
    if (dest_len >= dest_size) {
        return;  // Destination is already full
    }

    safe_strncpy(dest + dest_len, src, dest_size - dest_len);
}

// ✅ GOOD - Using snprintf instead of sprintf
void log_message(const char* message) {
    char log_buffer[256];
    snprintf(log_buffer, sizeof(log_buffer), "[%s] %s",
             "INFO", message);
    printf("%s\n", log_buffer);
}

// ✅ GOOD - Safe formatting
void format_user_info(const User* user) {
    char buffer[256];
    snprintf(buffer, sizeof(buffer),
             "User: %s, Age: %d, Status: %s",
             user->name,
             user->age,
             user->is_active ? "active" : "inactive");
    printf("%s\n", buffer);
}

// ❌ BAD - Buffer overflow vulnerability
void strcpy_vulnerable(char* dest, const char* src) {
    strcpy(dest, src);  // No bounds checking!
}

// ❌ BAD - Buffer overflow with sprintf
void format_vulnerable(const User* user) {
    char buffer[256];
    sprintf(buffer, "User: %s, Age: %d", user->name, user->age);
    // Buffer can overflow if name or age is too large!
}
```

**Array Bounds Checking**
```c
// ✅ GOOD - Bounds checking wrapper
typedef struct {
    int* data;
    size_t size;
    size_t capacity;
} Array;

Array* array_create(size_t capacity) {
    Array* arr = safe_malloc(sizeof(Array));
    arr->data = safe_malloc(sizeof(int) * capacity);
    arr->size = 0;
    arr->capacity = capacity;
    return arr;
}

bool array_push(Array* arr, int value) {
    if (arr == NULL || arr->size >= arr->capacity) {
        return false;
    }

    arr->data[arr->size++] = value;
    return true;
}

int array_get(const Array* arr, size_t index) {
    if (arr == NULL || index >= arr->size) {
        fprintf(stderr, "Array index out of bounds\n");
        return 0;  // Or raise error
    }

    return arr->data[index];
}

void array_free(Array* arr) {
    if (arr == NULL) {
        return;
    }

    free(arr->data);
    free(arr);
}

// Usage:
Array* numbers = array_create(10);
array_push(numbers, 1);
array_push(numbers, 2);
int value = array_get(numbers, 0);  // Safe access
array_free(numbers);
```

### Defensive Programming

**Input Validation**
```c
// ✅ GOOD - Comprehensive input validation
typedef struct {
    int age;
    double salary;
    const char* email;
} Employee;

bool validate_employee(const Employee* emp) {
    if (emp == NULL) {
        fprintf(stderr, "Employee is NULL\n");
        return false;
    }

    if (emp->age < 18 || emp->age > 65) {
        fprintf(stderr, "Invalid age: %d\n", emp->age);
        return false;
    }

    if (emp->salary < 0) {
        fprintf(stderr, "Invalid salary: %.2f\n", emp->salary);
        return false;
    }

    if (emp->email == NULL || strlen(emp->email) == 0) {
        fprintf(stderr, "Email is required\n");
        return false;
    }

    // Basic email validation
    bool has_at = false;
    bool has_dot = false;
    for (size_t i = 0; emp->email[i] != '\0'; i++) {
        if (emp->email[i] == '@') {
            has_at = true;
        }
        if (emp->email[i] == '.') {
            has_dot = true;
        }
    }

    if (!has_at || !has_dot) {
        fprintf(stderr, "Invalid email format: %s\n", emp->email);
        return false;
    }

    return true;
}

// Usage:
Employee emp = { 25, 50000.0, "john@example.com" };
if (!validate_employee(&emp)) {
    fprintf(stderr, "Validation failed\n");
    return EXIT_FAILURE;
}
```

**Null Pointer Checks**
```c
// ✅ GOOD - Comprehensive null checking
void process_user_data(const User* user) {
    if (user == NULL) {
        fprintf(stderr, "User is NULL\n");
        return;
    }

    if (user->name == NULL) {
        fprintf(stderr, "User name is NULL\n");
        return;
    }

    if (user->address == NULL) {
        fprintf(stderr, "User address is NULL\n");
        return;
    }

    printf("User: %s\n", user->name);
    printf("Address: %s\n", user->address->street);
}

// ✅ GOOD - Using assert for debug builds
#include <assert.h>

void safe_divide(double numerator, double denominator) {
    assert(denominator != 0 && "Division by zero");
    return numerator / denominator;
}

// Use NDEBUG to disable asserts in release builds
// #define NDEBUG
```

### Error Handling Patterns

**Error Codes**
```c
// ✅ GOOD - Using error codes
typedef enum {
    SUCCESS = 0,
    ERROR_NULL_POINTER,
    ERROR_INVALID_INPUT,
    ERROR_OUT_OF_MEMORY,
    ERROR_NOT_FOUND
} ErrorCode;

// ✅ GOOD - Functions returning error codes
ErrorCode parse_user(const char* input, User* user) {
    if (input == NULL || user == NULL) {
        return ERROR_NULL_POINTER;
    }

    if (strlen(input) == 0) {
        return ERROR_INVALID_INPUT;
    }

    // Parse input and fill user
    user->id = 1;
    user->age = 30;
    strncpy(user->name, input, sizeof(user->name) - 1);

    return SUCCESS;
}

// Usage:
ErrorCode result = parse_user("Alice", &user);
if (result != SUCCESS) {
    switch (result) {
        case ERROR_NULL_POINTER:
            printf("Null pointer error\n");
            break;
        case ERROR_INVALID_INPUT:
            printf("Invalid input\n");
            break;
        case ERROR_OUT_OF_MEMORY:
            printf("Out of memory\n");
            break;
        default:
            printf("Unknown error\n");
    }
    return EXIT_FAILURE;
}
```

**Logging**
```c
// ✅ GOOD - Logging utility
#include <stdio.h>
#include <time.h>

typedef enum {
    LOG_DEBUG = 0,
    LOG_INFO,
    LOG_WARNING,
    LOG_ERROR
} LogLevel;

void log_message(LogLevel level, const char* message) {
    const char* level_str[] = {"DEBUG", "INFO", "WARNING", "ERROR"};
    const char* timestamp = ctime(&time(NULL));

    printf("[%s] [%s] %s",
           timestamp ? timestamp : "N/A",
           level_str[level],
           message);

    if (level == LOG_ERROR) {
        fflush(stderr);
    }
}

// Usage:
log_message(LOG_INFO, "Application started");
log_message(LOG_WARNING, "Memory usage high");
log_message(LOG_ERROR, "Database connection failed");
```

### Performance Best Practices

**Efficient Memory Usage**
```c
// ✅ GOOD - Using fixed-size arrays when possible
typedef struct {
    int items[100];  // Fixed size for better cache locality
    size_t count;
} FixedSizeArray;

// ✅ GOOD - Using bit fields for flags
typedef struct {
    unsigned int is_active : 1;
    unsigned int is_admin : 1;
    unsigned int is_verified : 1;
    unsigned int is_deleted : 1;
} UserFlags;

// ✅ GOOD - Using static allocation when possible
static const int MAX_RETRIES = 3;
static int global_counter = 0;
```

**Cache Optimization**
```c
// ✅ GOOD - Cache-friendly data structures
typedef struct {
    float x;
    float y;
    float z;
} Vector3;

typedef struct {
    Vector3 positions[100];  // Contiguous memory
    size_t count;
} Points;

// ✅ GOOD - Avoid false sharing
typedef struct {
    alignas(64) int counter1;  // Separate cache lines
    alignas(64) int counter2;
} CacheFriendlyCounter;
```

### Common C Pitfalls to Avoid

- **Buffer overflows** - Always check bounds
- **Memory leaks** - Always free allocated memory
- ** dangling pointers** - NULL out pointers after freeing
- **using strcpy/sprintf** - Use strncpy/snprintf
- **ignoring return values** - Always check malloc/realloc failures
- **not initializing memory** - Use memset or calloc
- **off-by-one errors** - Be careful with array indices
- **not checking null pointers** - Always validate pointers
- **using C89 features** - Use modern C features (C11/C17)
- **not using const** - Mark constants as const

## Resources

- [C Standard Reference](https://en.cppreference.com/w/c)
- [The C Programming Language (K&R)](https://www.amazon.com/The-Programming-Language-Brian-Kernighan/dp/0131103628)
- [Secure Coding in C and C++](https://www.amazon.com/Secure-Coding-Language-C/dp/0136155373)
- [C Programming Best Practices](https://www.youtube.com/playlist?list=PLrA0o7Rd5o7gBZT1vZc-4x3kq2a2gNzI)
- [Using GNU C Library](https://www.gnu.org/software/libc/manual/)

## Ask Before Proceeding

Clarify these questions when needed:
- What C standard is being used (C89, C99, C11, C17, C20)?
- What compiler is being used (gcc, clang, MSVC)?
- Should NULL checks be used?
- Are there specific memory management requirements?
- What type of application is being developed (embedded, systems, application)?
- Should specific C11/C17 features be used?
