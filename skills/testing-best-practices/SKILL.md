---
name: testing-best-practices
description: Unit and integration test patterns, mocking strategies, coverage standards, and test automation
license: MIT
compatibility: opencode
metadata:
  audience: developers
  experience: intermediate
---

## What I do

Provide comprehensive testing guidance for creating effective test suites, implementing mocking strategies, and ensuring code quality through automated testing.

### Core Areas Covered

**Unit Testing Patterns**
- Test structure and organization
- Mocking and stubbing techniques
- Isolation principles
- Test helper utilities

**Integration Testing**
- Service integration patterns
- Database testing strategies
- External API mocking
- End-to-end test scenarios

**Testing Best Practices**
- Test readability and maintainability
- Test organization and naming
- Test data management
- Assertions and expectations

**Coverage Standards**
- Code coverage targets
- Branch coverage requirements
- Critical path coverage
- Coverage reporting and analysis

## When to use me

Use this skill when you need to:
- Write unit tests for functions and classes
- Set up testing frameworks (Jest, Mocha, pytest, etc.)
- Create integration tests for APIs and services
- Mock external dependencies (databases, APIs, file systems)
- Ensure code quality and prevent regressions
- Generate test coverage reports
- Implement test automation in CI/CD
- Refactor code with confidence
- Document expected behavior

### Common Scenarios

- **New feature**: Write tests alongside implementation (TDD)
- **Bug fix**: Add regression tests before fixing
- **Code review**: Review test coverage and quality
- **Refactoring**: Ensure tests pass after changes
- **Performance**: Write performance and load tests
- **Edge cases**: Test boundary conditions and error paths
- **Legacy code**: Add tests to improve maintainability
- **CI/CD**: Integrate tests into deployment pipeline

## Guidelines

### Unit Testing Fundamentals

**Test Structure**
```typescript
// ✅ GOOD - Descriptive, readable tests
describe('User Service', () => {
  describe('login()', () => {
    beforeEach(async () => {
      // Setup
      mockAuthService.authenticate.mockResolvedValue({
        user: mockUser,
        token: 'valid-token'
      });
    });

    it('should return user and token for valid credentials', async () => {
      // Arrange
      const credentials = { email: 'test@test.com', password: 'password123' };

      // Act
      const result = await userService.login(credentials);

      // Assert
      expect(result).toEqual({
        user: mockUser,
        token: 'valid-token'
      });
      expect(mockAuthService.authenticate).toHaveBeenCalledWith(credentials);
    });

    it('should throw error for invalid credentials', async () => {
      // Arrange
      mockAuthService.authenticate.mockRejectedValue(new AuthError('Invalid credentials'));

      // Act & Assert
      await expect(userService.login({ email: 'bad@test.com', password: 'wrong' }))
        .rejects.toThrow(AuthError);
    });

    it('should throw error for missing fields', async () => {
      // Arrange
      await expect(userService.login({ email: 'test@test.com' }))
        .rejects.toThrow('Email and password are required');
    });
  });
});
```

**Naming Tests**
```typescript
// ✅ GOOD - Clear test names
it('should return true when value is positive', () => { /* ... */ });
it('should throw error when value is negative', () => { /* ... */ });
it('should return null for empty input', () => { /* ... */ });
it('should sort array in ascending order', () => { /* ... */ });

// ❌ BAD - Vague test names
it('should work', () => { /* ... */ });
it('test', () => { /* ... */ });
it('test2', () => { /* ... */ });
```

**AAA Pattern**
```typescript
// ✅ GOOD - Arrange, Act, Assert pattern
describe('calculateTax', () => {
  it('should calculate correct tax for income over threshold', () => {
    // Arrange (Setup)
    const income = 50000;
    const taxRate = 0.2;
    const taxService = mockTaxService;

    // Act (Execute)
    const result = calculateTax(income, taxRate);

    // Assert (Verify)
    expect(result).toBe(10000);
    expect(taxService.calculate).toHaveBeenCalledWith(income, taxRate);
  });
});
```

### Mocking Strategies

**Mocking Dependencies**
```typescript
// ✅ GOOD - Clean mocking with libraries
import { jest } from '@jest/globals';

describe('Notification Service', () => {
  let mockEmailService: jest.Mocked<EmailService>;
  let notificationService: NotificationService;

  beforeEach(() => {
    // Create mock instance
    mockEmailService = {
      sendEmail: jest.fn(),
      sendBulkEmail: jest.fn()
    };

    // Create service with mock
    notificationService = new NotificationService(mockEmailService);
  });

  describe('sendWelcomeEmail', () => {
    it('should call email service with correct params', () => {
      // Arrange
      const user = { id: 1, email: 'test@example.com', name: 'Test User' };

      // Act
      notificationService.sendWelcomeEmail(user);

      // Assert
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        user.email,
        'Welcome to the platform!',
        expect.objectContaining({
          name: user.name,
          unsubscribeLink: expect.any(String)
        })
      );
    });

    it('should skip if user has opted out', () => {
      // Arrange
      const user = { id: 1, email: 'test@example.com', name: 'Test User', emailOptedOut: true };

      // Act
      notificationService.sendWelcomeEmail(user);

      // Assert
      expect(mockEmailService.sendEmail).not.toHaveBeenCalled();
    });
  });
});
```

**Spying on Functions**
```typescript
// ✅ GOOD - Using spies for verification
describe('Service', () => {
  it('should log error when service fails', () => {
    // Arrange
    const error = new Error('Service unavailable');
    const loggerSpy = jest.spyOn(console, 'error').mockImplementation();

    // Act
    service.handleError(error);

    // Assert
    expect(loggerSpy).toHaveBeenCalledWith('Error occurred:', error);
    expect(loggerSpy).toHaveBeenCalledTimes(1);
  });
});
```

**Manual Mocking**
```typescript
// ✅ GOOD - Clean mock implementation
jest.mock('../database', () => ({
  db: {
    query: jest.fn()
  }
}));

describe('Repository', () => {
  it('should fetch data from database', async () => {
    const mockData = [{ id: 1, name: 'Test' }];
    (db.query as jest.Mock).mockResolvedValue(mockData);

    const result = await repository.findAll();

    expect(db.query).toHaveBeenCalledWith('SELECT * FROM items');
    expect(result).toEqual(mockData);
  });
});
```

### Integration Testing

**API Integration Tests**
```typescript
// ✅ GOOD - Integration test for API endpoint
describe('POST /api/users', () => {
  let app: ExpressApplication;
  let request: SuperTest;
  let userRepository: Mock<UserRepository>;

  beforeEach(async () => {
    app = await createTestApp();
    request = supertest(app);
    userRepository = createMockUserRepository();
  });

  it('should create a new user and return 201', async () => {
    // Arrange
    const userData = {
      email: 'test@example.com',
      password: 'securePassword123',
      name: 'Test User'
    };

    const mockCreatedUser = { ...userData, id: 1 };
    userRepository.create.mockResolvedValue(mockCreatedUser);

    // Act
    const response = await request
      .post('/api/users')
      .send(userData)
      .set('Authorization', `Bearer ${generateValidToken()}`);

    // Assert
    expect(response.status).toBe(201);
    expect(response.body).toEqual(mockCreatedUser);
    expect(userRepository.create).toHaveBeenCalledWith(userData);
  });

  it('should return 400 for invalid email', async () => {
    const response = await request
      .post('/api/users')
      .send({ email: 'invalid-email', password: 'password123' });

    expect(response.status).toBe(400);
    expect(response.body.errors).toHaveLength(1);
    expect(response.body.errors[0].field).toBe('email');
  });
});
```

**Database Testing**
```typescript
// ✅ GOOD - Database integration test with test database
describe('User Repository', () => {
  let db: Database;
  let userRepository: UserRepository;

  beforeAll(async () => {
    // Setup test database
    db = await Database.create({
      host: process.env.TEST_DB_HOST,
      database: 'test_db',
      user: process.env.TEST_DB_USER,
      password: process.env.TEST_DB_PASSWORD
    });
  });

  beforeEach(async () => {
    await db.migrate(); // Reset database schema
    userRepository = new UserRepository(db);
  });

  afterAll(async () => {
    await db.close();
  });

  it('should save user to database', async () => {
    // Arrange
    const user = new User('test@example.com', 'hashedPassword');

    // Act
    await userRepository.save(user);

    // Assert
    const savedUser = await userRepository.findByEmail('test@example.com');
    expect(savedUser).toEqual(user);
    expect(savedUser?.password).not.toBe('hashedPassword'); // Password should be hashed
  });
});
```

**External API Testing**
```typescript
// ✅ GOOD - Testing with mock HTTP client
describe('Payment Service', () => {
  let paymentService: PaymentService;
  let axiosClient: AxiosInstance;

  beforeEach(() => {
    axiosClient = axios.create();
    jest.spyOn(axiosClient, 'post').mockResolvedValue({
      data: { status: 'success', transactionId: 'tx_123' }
    });
    paymentService = new PaymentService(axiosClient);
  });

  it('should process payment successfully', async () => {
    const payment = {
      amount: 100,
      currency: 'USD',
      card: {
        number: '4242424242424242',
        expiry: '12/25',
        cvv: '123'
      }
    };

    const result = await paymentService.charge(payment);

    expect(result.status).toBe('success');
    expect(result.transactionId).toBe('tx_123');
    expect(axiosClient.post).toHaveBeenCalledWith(
      '/charges',
      expect.objectContaining({
        amount: payment.amount * 100, // Convert to cents
        currency: payment.currency
      })
    );
  });
});
```

### Testing Utilities

**Test Helpers**
```typescript
// ✅ GOOD - Reusable test helpers
export class TestHelpers {
  static async createTestUser(overrides: Partial<User> = {}) {
    return {
      id: 1,
      email: `test-${Date.now()}@example.com`,
      password: 'hashedPassword',
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides
    };
  }

  static generateValidToken() {
    return jwt.sign({ userId: 1 }, process.env.JWT_SECRET!, { expiresIn: '1h' });
  }

  static async createTestSession(userId: number) {
    const token = this.generateValidToken();
    return { token, userId };
  }
}

// Usage
it('should authenticate user', async () => {
  const user = await TestHelpers.createTestUser();
  const session = await TestHelpers.createTestSession(user.id);

  // Test logic
});
```

**Test Data Builders**
```typescript
// ✅ GOOD - Builder pattern for test data
export class UserBuilder {
  private user: Partial<User> = {
    email: 'test@example.com',
    password: 'hashedPassword',
    name: 'Test User'
  };

  withEmail(email: string): this {
    this.user.email = email;
    return this;
  }

  withName(name: string): this {
    this.user.name = name;
    return this;
  }

  withPassword(password: string): this {
    this.user.password = password;
    return this;
  }

  build(): User {
    return new User(
      this.user.email!,
      this.user.password!,
      this.user.name!
    );
  }
}

// Usage
it('should create user with valid data', () => {
  const user = new UserBuilder()
    .withEmail('test@example.com')
    .withName('John Doe')
    .build();

  expect(user.email).toBe('test@example.com');
});
```

**Snapshot Testing**
```typescript
// ✅ GOOD - Snapshot testing for UI components
it('should render user card correctly', () => {
  const user = { id: 1, name: 'John Doe', email: 'john@example.com' };

  const component = renderer.create(<UserCard user={user} />);

  expect(component.toJSON()).toMatchSnapshot();
});
```

### Coverage Standards

**Code Coverage Targets**
```typescript
// ✅ GOOD - Coverage configuration
module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/*.spec.ts',
    '!src/**/__tests__/**'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    },
    './src/api/': {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90
    }
  },
  coverageReporters: ['text', 'lcov', 'html'],
  coverageDirectory: 'coverage'
};
```

**Critical Path Coverage**
```typescript
// ✅ GOOD - Ensure critical paths are covered
describe('Error Handling', () => {
  it('should handle 404 errors gracefully', async () => {
    // Critical path: Resource not found
    await expect(someService.getById('non-existent-id'))
      .rejects.toThrow(NotFoundError);
  });

  it('should handle 500 errors gracefully', async () => {
    // Critical path: Server error
    await expect(someService.riskyOperation())
      .rejects.toThrow(InternalServerError);
  });
});
```

### Async Testing

**Handling Async Operations**
```typescript
// ✅ GOOD - Proper async test handling
describe('Async Operations', () => {
  it('should complete within timeout', async () => {
    const promise = service.longRunningOperation();
    await expect(promise).resolves.toBe('done');
  });

  it('should reject with correct error for timeout', async () => {
    await expect(service.timeoutOperation())
      .rejects.toMatchObject({ code: 'TIMEOUT' });
  });

  it('should handle multiple promises', async () => {
    const promises = [
      service.operation1(),
      service.operation2(),
      service.operation3()
    ];

    const results = await Promise.all(promises);
    expect(results).toHaveLength(3);
  });

  it('should settle when one promise fails', async () => {
    const promises = [
      service.operation1(),
      Promise.reject(new Error('Failed')),
      service.operation3()
    ];

    await expect(Promise.any(promises)).resolves.toBeDefined();
  });
});
```

### Testing Frameworks by Language

**JavaScript/TypeScript (Jest)**
```typescript
// ✅ GOOD - Jest configuration and setup
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@tests/(.*)$': '<rootDir>/tests/$1'
  }
};
```

**Python (pytest)**
```python
# ✅ GOOD - pytest configuration
[tool.pytest.ini_options]
testpaths = ["tests"]
python_files = ["test_*.py"]
python_functions = ["test_*"]
python_classes = ["Test*"]
addopts = [
    "--strict-markers",
    "--tb=short",
    "--cov=src",
    "--cov-report=html",
    "--cov-report=term-missing"
]
```

**Java (JUnit 5)**
```java
// ✅ GOOD - JUnit 5 setup
@ExtendWith(MockitoExtension.class)
public class UserServiceTest {
    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @Test
    void testGetUserById() {
        // Arrange
        when(userRepository.findById(1)).thenReturn(Optional.of(user));

        // Act
        User result = userService.findById(1);

        // Assert
        assertEquals(user, result);
        verify(userRepository).findById(1);
    }
}
```

## Common Testing Pitfalls to Avoid

- **Not mocking dependencies** - Tests become fragile and slow
- **Too many assertions per test** - Makes tests hard to debug
- **Test ordering dependencies** - Make tests independent
- **Not cleaning up after tests** - Leads to flaky tests
- **Using real database in tests** - Slow and hard to reproduce issues
- **Ignoring test failures** - Failing tests indicate problems
- **Tests that take too long** - Slow CI/CD pipelines
- **Tests that depend on external services** - Unreliable and slow
- **Not testing edge cases** - Hidden bugs in unusual paths
- **Not measuring coverage** - Missed code paths and bugs

## Resources

- [Testing Best Practices (OWASP)](https://owasp.org/www-project-web-security-testing-guide/)
- [Jest Documentation](https://jestjs.io/)
- [Mockito Documentation](https://javadoc.io/doc/org.mockito/mockito-core/latest/org/mockito/Mockito.html)
- [Pytest Documentation](https://docs.pytest.org/)
- [JUnit 5 User Guide](https://junit.org/junit5/docs/current/user-guide/)
- [The Art of Unit Testing](https://martinfowler.com/articles/practical-test-pyramid.html)

## Ask Before Proceeding

Clarify these questions when needed:
- What testing framework is being used (Jest, Mocha, pytest, JUnit, etc.)?
- What type of tests are needed (unit, integration, E2E, performance)?
- What mock/stub strategy is preferred for external dependencies?
- What is the target code coverage percentage?
- Are there specific test scenarios that must be covered (edge cases, error paths)?
- What CI/CD pipeline is used (GitHub Actions, GitLab CI, Jenkins, etc.)?
- Are there existing test files that need to be followed for patterns?
- Should tests be written before or after implementation (TDD vs. BDD)?
