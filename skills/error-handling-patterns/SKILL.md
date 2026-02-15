---
name: error-handling-patterns
description: Exception handling, logging strategies, error boundaries, and graceful failure patterns
license: MIT
compatibility: opencode
metadata:
  audience: developers
  experience: intermediate
---

## What I do

Provide comprehensive guidance on error handling, exception management, logging strategies, and error boundary patterns to build robust applications.

### Core Areas Covered

**Exception Handling**
- Try-catch patterns
- Error boundaries
- Custom error types
- Error propagation

**Logging Strategies**
- Structured logging
- Error logging best practices
- Log levels and categorization
- Log retention and monitoring

**Error Boundaries**
- Frontend error boundaries
- API error responses
- User-friendly error messages
- Error recovery strategies

**Error Handling Patterns**
- Defensive programming
- Fail-fast patterns
- Error propagation patterns
- Error context and tracing

## When to use me

Use this skill when you need to:
- Implement proper exception handling in your code
- Create custom error types and error hierarchies
- Design user-friendly error messages
- Set up logging for debugging and monitoring
- Create error boundaries for frontend applications
- Handle errors gracefully in APIs
- Implement retry and fallback strategies
- Design error recovery mechanisms
- Improve debugging capabilities
- Set up error monitoring and alerting

### Common Scenarios

- **API Development**: Implement proper error responses and HTTP status codes
- **Frontend Development**: Create error boundaries for graceful error handling
- **Backend Development**: Handle exceptions and propagate errors properly
- **Debugging**: Use logging to track issues in production
- **User Experience**: Provide clear, actionable error messages to users
- **Monitoring**: Set up error tracking for production issues
- **Testing**: Test error paths and edge cases
- **Error Recovery**: Implement fallback strategies when primary operations fail

## Guidelines

### Custom Error Types

**Error Hierarchy**
```typescript
// ✅ GOOD - Structured error hierarchy
class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public isOperational: boolean = true
  ) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
  }
}

// Business logic errors
class ValidationError extends AppError {
  constructor(message: string, public field?: string) {
    super(message, 400);
  }
}

class NotFoundError extends AppError {
  constructor(resource: string, id: string) {
    super(`${resource} with id ${id} not found`, 404);
  }
}

class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized access') {
    super(message, 401);
  }
}

class ForbiddenError extends AppError {
  constructor(message: string = 'Access denied') {
    super(message, 403);
  }
}

class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409);
  }
}

class InternalServerError extends AppError {
  constructor(message: string = 'Internal server error') {
    super(message, 500, false); // Non-operational
  }
}

// Usage
async function deleteUser(userId: string): Promise<void> {
  const user = await userRepository.findById(userId);

  if (!user) {
    throw new NotFoundError('User', userId);
  }

  if (!user.isActive) {
    throw new ConflictError('Cannot delete inactive user');
  }

  await userRepository.delete(userId);
}
```

**Error Handling Pattern**
```typescript
// ✅ GOOD - Centralized error handler
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      error: {
        message: error.message,
        code: error.name,
        ...(error.field && { field: error.field })
      }
    });
  } else if (error instanceof SyntaxError && 'body' in error) {
    res.status(400).json({
      error: {
        message: 'Invalid JSON payload',
        code: 'INVALID_JSON'
      }
    });
  } else {
    console.error('Unexpected error:', error);
    res.status(500).json({
      error: {
        message: 'Internal server error',
        code: 'INTERNAL_ERROR'
      }
    });
  }
});

// Usage
app.delete('/api/users/:id', async (req, res, next) => {
  try {
    await deleteUser(req.params.id);
    res.json({ success: true });
  } catch (error) {
    next(error); // Pass to error handler
  }
});
```

### Exception Handling Patterns

**Try-Catch Best Practices**
```typescript
// ✅ GOOD - Proper error handling with context
async function processPayment(userId: string, amount: number): Promise<void> {
  try {
    // Validate input
    if (!userId || !amount || amount <= 0) {
      throw new ValidationError('Invalid payment details', 'amount');
    }

    // Business logic
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User', userId);
    }

    const payment = await paymentService.charge(user, amount);

    // Log success
    logger.info('Payment processed successfully', {
      userId,
      amount,
      transactionId: payment.transactionId
    });

  } catch (error) {
    if (error instanceof AppError) {
      throw error; // Re-throw known errors
    }

    // Wrap unknown errors
    throw new InternalServerError('Payment processing failed', { cause: error });
  }
}

// Usage
app.post('/api/payments', async (req, res, next) => {
  try {
    await processPayment(req.body.userId, req.body.amount);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});
```

**Async/Await Error Handling**
```typescript
// ✅ GOOD - Robust async error handling
async function handleAsync<T>(
  operation: () => Promise<T>,
  fallbackValue?: T
): Promise<T | undefined> {
  try {
    return await operation();
  } catch (error) {
    logger.warn('Async operation failed', { error: error.message, operation });
    return fallbackValue;
  }
}

// Usage
const user = await handleAsync(
  () => userRepository.findById(userId),
  undefined
);

const order = await handleAsync(
  () => orderService.createOrder(orderData),
  null
);
```

### Error Boundaries

**Frontend Error Boundaries**
```typescript
// ✅ GOOD - React Error Boundary
class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to monitoring service
    logErrorToMonitoring(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback
          error={this.state.error}
          onReset={() => this.setState({ hasError: false, error: null })}
        />
      );
    }

    return this.props.children;
  }
}

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

// User-friendly error fallback
function ErrorFallback({ error, onReset }: { error: Error, onReset: () => void }) {
  const isOperational = (error as any).isOperational;

  return (
    <div className="error-fallback">
      <h2>{isOperational ? 'Oops! Something went wrong' : 'Error'}</h2>
      <p>
        {isOperational
          ? 'An unexpected error occurred. Please try again.'
          : error.message}
      </p>
      {isOperational && (
        <button onClick={onReset}>Try Again</button>
      )}
      <button onClick={() => window.location.reload()}>Reload Page</button>
    </div>
  );
}

// Usage
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

**API Error Responses**
```typescript
// ✅ GOOD - Standardized API error responses
interface ErrorResponse {
  error: {
    message: string;
    code: string;
    details?: Record<string, any>;
    timestamp: string;
  };
}

function sendErrorResponse(
  res: Response,
  error: AppError,
  details?: Record<string, any>
) {
  res.status(error.statusCode).json({
    error: {
      message: error.message,
      code: error.name,
      details,
      timestamp: new Date().toISOString()
    }
  });
}

// Usage
app.get('/api/users/:id', async (req, res, next) => {
  try {
    const user = await userRepository.findById(req.params.id);
    if (!user) {
      throw new NotFoundError('User', req.params.id);
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
});

// Error handler catches and formats
app.use((error: AppError, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof AppError) {
    sendErrorResponse(res, error, { path: req.path });
  } else {
    sendErrorResponse(res, new InternalServerError(), {
      path: req.path,
      error: error.message
    });
  }
});
```

### Logging Strategies

**Structured Logging**
```typescript
// ✅ GOOD - Structured logging with context
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

// Usage
logger.info('User logged in', {
  userId,
  email,
  ip: req.ip,
  userAgent: req.get('User-Agent'),
  timestamp: new Date().toISOString()
});

logger.warn('Payment failed', {
  userId,
  amount,
  reason: 'Insufficient funds',
  attempts: 3
});

logger.error('Database connection failed', {
  error: error.message,
  stack: error.stack,
  timeout: 5000,
  retryAttempts: 3
});
```

**Error Logging Best Practices**
```typescript
// ✅ GOOD - Comprehensive error logging
function logError(context: string, error: Error, additionalInfo?: Record<string, any>) {
  logger.error(context, {
    message: error.message,
    stack: error.stack,
    name: error.name,
    code: (error as any).code,
    ...(additionalInfo && { details: additionalInfo }),
    timestamp: new Date().toISOString(),
    process: {
      pid: process.pid,
      hostname: os.hostname()
    }
  });
}

// Usage
try {
  const result = await complexOperation();
} catch (error) {
  logError('Complex operation failed', error, {
    userId: currentUserId,
    operationType: 'processing'
  });
  throw error; // Still re-throw for error handler
}
```

**Log Levels**
```typescript
// ✅ GOOD - Appropriate log levels
logger.info('Application started'); // Informational - normal flow
logger.info('User authenticated', { userId }); // Important events
logger.warn('Low disk space', { percentage: 20 }); // Warnings - potential issues
logger.error('Payment failed', { transactionId, reason }); // Errors - problems
logger.debug('Query executed', { sql, params }); // Debugging - detailed info

// Configuration
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  // ...
});
```

### Error Recovery Strategies

**Retry Pattern**
```typescript
// ✅ GOOD - Configurable retry pattern
async function retry<T>(
  operation: () => Promise<T>,
  options: {
    maxAttempts?: number;
    delay?: number;
    backoff?: 'linear' | 'exponential';
  } = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    delay = 1000,
    backoff = 'linear'
  } = options;

  let lastError: Error;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;

      if (attempt === maxAttempts) {
        break;
      }

      const delayMs = backoff === 'exponential'
        ? delay * Math.pow(2, attempt - 1)
        : delay;

      logger.warn(`Operation failed, retrying (${attempt}/${maxAttempts})`, {
        error: error.message,
        delayMs
      });

      await sleep(delayMs);
    }
  }

  throw lastError!;
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Usage
async function createOrder(orderData: OrderData): Promise<Order> {
  return retry(() => orderService.create(orderData), {
    maxAttempts: 3,
    delay: 2000,
    backoff: 'exponential'
  });
}
```

**Fallback Pattern**
```typescript
// ✅ GOOD - Graceful fallback
async function getPaymentProvider(): Promise<PaymentProvider> {
  const providers = ['stripe', 'paypal', 'adyen'];

  for (const provider of providers) {
    try {
      const client = await getProviderClient(provider);
      logger.info(`Successfully connected to ${provider}`);
      return client;
    } catch (error) {
      logger.warn(`Failed to connect to ${provider}`, { error: error.message });
    }
  }

  throw new Error('No payment provider available');
}

// Usage
const provider = await getPaymentProvider();
const result = await provider.charge(payment);
```

**Circuit Breaker Pattern**
```typescript
// ✅ GOOD - Circuit breaker implementation
class CircuitBreaker {
  private failures = 0;
  private lastFailureTime: Date | null = null;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';

  constructor(
    private threshold = 5,
    private timeout = 60000,
    private onOpen: () => void = () => {}
  ) {}

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime.getTime() > this.timeout) {
        this.state = 'HALF_OPEN';
        logger.info('Circuit breaker entering HALF_OPEN state');
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }

    try {
      const result = await operation();

      if (this.state === 'HALF_OPEN') {
        this.state = 'CLOSED';
        this.failures = 0;
        logger.info('Circuit breaker closed');
      }

      return result;
    } catch (error) {
      this.failures++;
      this.lastFailureTime = new Date();

      if (this.failures >= this.threshold) {
        this.state = 'OPEN';
        logger.error('Circuit breaker opened', { error: error.message });
        this.onOpen();
      }

      throw error;
    }
  }
}

// Usage
const circuitBreaker = new CircuitBreaker(
  5, // Failures threshold
  60000, // 60 seconds timeout
  () => alert('Service unavailable')
);

const result = await circuitBreaker.execute(async () => {
  return await apiClient.makeRequest('/endpoint');
});
```

### Error Context and Tracing

**Error Context Propagation**
```typescript
// ✅ GOOD - Error context tracking
class RequestContext {
  private static currentContext = new Map<string, any>();

  static set(key: string, value: any) {
    this.currentContext.set(key, value);
  }

  static get(key: string): any {
    return this.currentContext.get(key);
  }

  static clear() {
    this.currentContext.clear();
  }
}

function withContext<T>(context: Record<string, any>, operation: () => Promise<T>): Promise<T> {
  const originalContext = new Map(RequestContext.currentContext);

  try {
    Object.entries(context).forEach(([key, value]) => {
      RequestContext.set(key, value);
    });

    return operation();
  } finally {
    RequestContext.currentContext = originalContext;
  }
}

// Usage
async function processOrder(orderId: string) {
  return withContext(
    {
      orderId,
      userId: RequestContext.get('userId'),
      requestId: RequestContext.get('requestId')
    },
    async () => {
      const order = await orderRepository.findById(orderId);
      const user = await userRepository.findById(order.userId);
      // Process order...
    }
  );
}

// When error occurs, context is automatically included in error
```

### Testing Error Handling

**Testing Error Paths**
```typescript
// ✅ GOOD - Comprehensive error testing
describe('User Service', () => {
  describe('deleteUser', () => {
    it('should throw NotFoundError when user does not exist', async () => {
      // Arrange
      jest.spyOn(userRepository, 'findById').mockResolvedValue(null);

      // Act & Assert
      await expect(userService.deleteUser('non-existent-id'))
        .rejects.toThrow(NotFoundError);
      await expect(userService.deleteUser('non-existent-id'))
        .rejects.toThrow('User with id non-existent-id not found');
    });

    it('should throw ConflictError when user is inactive', async () => {
      // Arrange
      const user = { id: '1', isActive: false } as User;
      jest.spyOn(userRepository, 'findById').mockResolvedValue(user);

      // Act & Assert
      await expect(userService.deleteUser('1'))
        .rejects.toThrow(ConflictError);
      await expect(userService.deleteUser('1'))
        .rejects.toThrow('Cannot delete inactive user');
    });

    it('should handle database errors gracefully', async () => {
      // Arrange
      jest.spyOn(userRepository, 'delete').mockRejectedValue(new Error('DB Error'));

      // Act & Assert
      await expect(userService.deleteUser('1'))
        .rejects.toThrow();
    });
  });
});
```

## Common Error Handling Pitfalls to Avoid

- **Swallowing errors silently** - Always handle or rethrow errors
- **Inconsistent error messages** - Use standard error types and messages
- **Exposing internal errors to users** - Log details, show generic message
- **No error logging** - Errors in production will go undetected
- **Inconsistent HTTP status codes** - Use correct codes (400 vs 404 vs 500)
- **No error boundaries in frontend** - Uncaught errors crash the app
- **Missing error context** - Hard to debug without context
- **Not testing error paths** - Bugs in error handling often go unnoticed
- **Overuse of try-catch** - Only catch what you can handle
- **Blocking async operations with try-catch** - Use proper async patterns

## Resources

- [Effective Error Handling in Node.js](https://blog.logrocket.com/effective-error-handling-in-node-js/)
- [The Art of Debugging](https://blog.logrocket.com/the-art-of-debugging/)
- [Microsoft Error Handling Best Practices](https://docs.microsoft.com/en-us/azure/architecture/best-practices/error-handling)
- [React Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
- [Error Logging Best Practices](https://www.elastic.co/guide/en/beats/filebeat/7.x/error-log.html)

## Ask Before Proceeding

Clarify these questions when needed:
- What error handling framework or patterns are in use?
- Are there custom error types already defined?
- What logging system is being used (Winston, Pino, etc.)?
- Are there specific error monitoring tools (Sentry, LogRocket, etc.)?
- Should errors be logged to files, monitoring services, or both?
- Are there frontend error boundary requirements?
- Should errors be sent to external error tracking services?
- What is the error recovery strategy for critical failures?
