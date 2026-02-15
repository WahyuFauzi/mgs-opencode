---
name: java-best-practices
description: Java best practices, Spring patterns, streams API, and concurrency
license: MIT
compatibility: opencode
metadata:
  audience: Java developers
  experience: intermediate
---

## What I do

Provide comprehensive Java best practices for writing clean, maintainable, and efficient Java code following Java best practices and Spring patterns.

### Core Areas Covered

**Java Basics**
- Naming conventions
- Best practices
- Common pitfalls
- Code organization

**Streams API**
- Stream operations
- Optional handling
- Performance considerations
- Functional programming

**Spring Framework**
- Dependency injection
- Spring annotations
- Spring Boot best practices
- REST API patterns

**Concurrency**
- Thread safety
- Executor services
- Synchronization
- Parallel processing

## When to use me

Use this skill when you need to:
- Write clean, idiomatic Java code
- Use Java Streams effectively
- Implement Spring applications
- Follow Java naming conventions
- Handle concurrency properly
- Use Spring annotations correctly
- Write efficient Java code
- Follow Java best practices

### Common Scenarios

- **New Java Project**: Set up project structure and coding standards
- **Spring Development**: Build REST APIs and services with Spring
- **Legacy Code Refactoring**: Modernize old Java code
- **Data Processing**: Use Streams for efficient data manipulation
- **API Development**: Create RESTful APIs with Spring Boot
- **Code Review**: Apply Java best practices during reviews
- **Performance Optimization**: Improve code efficiency

## Guidelines

### Java Naming Conventions

**Classes and Interfaces**
```java
// ✅ GOOD - PascalCase for classes and interfaces
public class UserService {
    public interface UserRepository {
        // ...
    }
}

// ❌ BAD - camelCase for classes
public class userService {
    // ...
}

// ❌ BAD - lowercase for classes
public class user {
    // ...
}
```

**Methods and Variables**
```java
// ✅ GOOD - camelCase for methods and variables
public void calculateTotal() {
    int userAge = 30;
    String userName = "Alice";
}

// ❌ BAD - PascalCase for methods
public void CalculateTotal() {
    // ...
}

// ❌ BAD - UPPER_CASE for variables
public void calculateTotal() {
    int USER_AGE = 30;
    // ...
}
```

**Constants**
```java
// ✅ GOOD - UPPER_CASE with underscores for constants
public class Constants {
    public static final int MAX_RETRY_COUNT = 3;
    public static final String DEFAULT_USER_ROLE = "USER";
    public static final double TAX_RATE = 0.1;
}

// ❌ BAD - camelCase for constants
public static final int maxRetryCount = 3;
```

**Packages**
```java
// ✅ GOOD - Lowercase, reverse domain convention
package com.example.user.service;

import com.example.user.model.User;
import com.example.user.repository.UserRepository;

// ❌ BAD - Uppercase or non-standard naming
package com.example.UserService;
package com.example.User.Service;
```

### Java Best Practices

**Avoid Mutable Static State**
```java
// ❌ BAD - Mutable static state
public class AppState {
    public static List<String> activeUsers = new ArrayList<>();
}

// ✅ GOOD - Use immutable objects
public class AppState {
    private static final List<String> ACTIVE_USERS = Collections.unmodifiableList(new ArrayList<>());
}
```

**Use Optional**
```java
// ❌ BAD - Returning null
public User getUserById(String id) {
    User user = database.findById(id);
    if (user == null) {
        throw new UserNotFoundException();
    }
    return user;
}

// ✅ GOOD - Using Optional
public Optional<User> getUserById(String id) {
    return Optional.ofNullable(database.findById(id))
                   .filter(user -> user.isActive());
}

// Usage
Optional<User> userOpt = getUserById("123");
userOpt.ifPresentOrElse(
    user -> processUser(user),
    () -> System.out.println("User not found")
);
```

**Use Try-With-Resources**
```java
// ❌ BAD - Not using try-with-resources
public String readFile(String filePath) throws IOException {
    BufferedReader reader = new BufferedReader(new FileReader(filePath));
    String line = reader.readLine();
    reader.close();
    return line;
}

// ✅ GOOD - Using try-with-resources
public String readFile(String filePath) throws IOException {
    try (BufferedReader reader = new BufferedReader(new FileReader(filePath))) {
        return reader.readLine();
    } // Resource is automatically closed
}
```

### Java Streams API

**Stream Operations**
```java
// ✅ GOOD - Using streams for data processing
List<User> users = userService.getAllUsers();

// Filter
List<User> activeUsers = users.stream()
    .filter(User::isActive)
    .collect(Collectors.toList());

// Transform
List<String> names = users.stream()
    .map(User::getName)
    .collect(Collectors.toList());

// Sort
List<User> sortedUsers = users.stream()
    .sorted(Comparator.comparing(User::getName))
    .collect(Collectors.toList());

// Map and filter combined
List<String> activeUserNames = users.stream()
    .filter(User::isActive)
    .map(User::getName)
    .collect(Collectors.toList());

// Collect to map
Map<String, User> userMap = users.stream()
    .collect(Collectors.toMap(
        User::getId,
        Function.identity(),
        (existing, replacement) -> existing
    ));
```

**Optional Handling**
```java
// ✅ GOOD - Using Optional with streams
Optional<User> optionalUser = users.stream()
    .filter(u -> u.getId().equals("123"))
    .findFirst();

optionalUser.ifPresentOrElse(
    user -> processUser(user),
    () -> System.out.println("User not found")
);

// ✅ GOOD - Using orElseThrow
User user = optionalUser.orElseThrow(() -> new UserNotFoundException());
```

### Spring Framework Best Practices

**Dependency Injection**
```java
// ✅ GOOD - Constructor injection (recommended)
@Service
public class UserService {
    private final UserRepository userRepository;
    private final EmailService emailService;

    @Autowired
    public UserService(UserRepository userRepository, EmailService emailService) {
        this.userRepository = userRepository;
        this.emailService = emailService;
    }
}

// ✅ GOOD - Setter injection (for optional dependencies)
@Service
public class EmailService {
    private EmailConfiguration emailConfig;

    @Autowired
    public void setEmailConfig(EmailConfiguration emailConfig) {
        this.emailConfig = emailConfig;
    }
}

// ❌ BAD - Field injection (discouraged)
@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private EmailService emailService;
}
```

**Spring Annotations**
```java
// ✅ GOOD - Common Spring annotations
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable String id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        User createdUser = userService.createUser(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable String id, @RequestBody User user) {
        User updatedUser = userService.updateUser(id, user);
        return ResponseEntity.ok(updatedUser);
    }
}

// ✅ GOOD - Using @Valid for validation
@PostMapping
public ResponseEntity<User> createUser(@Valid @RequestBody UserDto userDto) {
    User user = userDto.toEntity();
    User createdUser = userService.createUser(user);
    return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
}
```

**Spring Boot Best Practices**
```java
// ✅ GOOD - Application configuration
@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}

// ✅ GOOD - Logging configuration
@Slf4j
@Service
public class EmailService {
    public void sendEmail(String to, String subject, String body) {
        log.info("Sending email to: {}", to);
        // Send email logic
        log.info("Email sent successfully to: {}", to);
    }
}

// ✅ GOOD - Global exception handling
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleUserNotFound(UserNotFoundException ex) {
        ErrorResponse error = new ErrorResponse(
            "USER_NOT_FOUND",
            ex.getMessage(),
            LocalDateTime.now()
        );
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationErrors(
        MethodArgumentNotValidException ex) {
        List<String> errors = ex.getBindingResult()
            .getFieldErrors()
            .stream()
            .map(FieldError::getDefaultMessage)
            .collect(Collectors.toList());

        ErrorResponse error = new ErrorResponse(
            "VALIDATION_ERROR",
            "Invalid input",
            errors,
            LocalDateTime.now()
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }
}
```

### Concurrency Best Practices

**Thread Safety**
```java
// ❌ BAD - Not thread-safe
public class Counter {
    private int count = 0;

    public void increment() {
        count++;
    }

    public int getCount() {
        return count;
    }
}

// ✅ GOOD - Using AtomicInteger
public class Counter {
    private final AtomicInteger count = new AtomicInteger(0);

    public void increment() {
        count.incrementAndGet();
    }

    public int getCount() {
        return count.get();
    }
}

// ✅ GOOD - Using synchronized
public class Counter {
    private int count = 0;

    public synchronized void increment() {
        count++;
    }

    public synchronized int getCount() {
        return count;
    }
}
```

**Executor Services**
```java
// ✅ GOOD - Using ExecutorService for parallel processing
@Service
public class EmailService {
    @Autowired
    private ExecutorService emailExecutor;

    public void sendBulkEmails(List<String> recipients) {
        List<Future<EmailResult>> futures = recipients.stream()
            .map(recipient -> emailExecutor.submit(() -> sendEmail(recipient)))
            .collect(Collectors.toList());

        // Wait for all emails to be sent
        futures.forEach(future -> {
            try {
                future.get();
            } catch (InterruptedException | ExecutionException e) {
                log.error("Error sending email", e);
            }
        });
    }
}

// ✅ GOOD - Using CompletableFuture
public CompletableFuture<EmailResult> sendEmailAsync(String recipient) {
    return CompletableFuture.supplyAsync(() -> sendEmail(recipient), emailExecutor);
}
```

### Spring Boot Application Structure

**Common Project Structure**
```
src/
├── main/
│   ├── java/
│   │   └── com/
│   │       └── example/
│   │           └── project/
│   │               ├── config/           # Configuration classes
│   │               ├── controller/       # REST controllers
│   │               ├── service/          # Business logic
│   │               ├── repository/       # Data access
│   │               ├── model/            # Domain models
│   │               ├── dto/              # Data transfer objects
│   │               ├── exception/        # Custom exceptions
│   │               └── Application.java  # Main class
│   └── resources/
│       ├── application.yml              # Main configuration
│       ├── application-dev.yml          # Development config
│       └── application-prod.yml         # Production config
└── test/
    └── java/
        └── com/
            └── example/
                └── project/
                    ├── controller/      # Controller tests
                    └── service/         # Service tests
```

### Common Java Pitfalls to Avoid

- **Using raw types** - Always use generics with type parameters
- **Ignoring null checks** - Always handle null values
- **Not closing resources** - Use try-with-resources
- **Mutable static state** - Avoid mutable shared state
- **Not using Optional** - Use Optional for optional return values
- **Overusing synchronized** - Use concurrent collections instead
- **Blocking I/O in threads** - Use async/await or CompletableFuture
- **Not using streams** - Use streams for data processing
- **Not using Lombok** - Consider using Lombok to reduce boilerplate

## Resources

- [Effective Java (Joshua Bloch)](https://www.oracle.com/java/technologies/javase/effective-java.html)
- [Spring Framework Documentation](https://docs.spring.io/spring-framework/docs/current/reference/html/)
- [Java Streams Guide](https://www.oracle.com/java/technologies/javase/streams.html)
- [Java Concurrency in Practice](https://jcip.net/)
- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Java Code Conventions](https://www.oracle.com/java/technologies/javase/codeconventions-contents.html)

## Ask Before Proceeding

Clarify these questions when needed:
- What Java version is being used (Java 8, 11, 17, 21, etc.)?
- What Spring version is being used?
- Should Lombok be used for reducing boilerplate?
- Are there specific Spring profiles needed (dev, prod, test)?
- What testing framework is being used (JUnit 5, TestNG)?
- Should aspect-oriented programming (AOP) be used?
- What database are you using (MySQL, PostgreSQL, MongoDB)?
