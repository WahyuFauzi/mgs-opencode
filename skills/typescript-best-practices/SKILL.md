---
name: typescript-best-practices
description: TypeScript type safety, generics, async patterns, and modern TypeScript features
license: MIT
compatibility: opencode
metadata:
  audience: TypeScript developers
  experience: intermediate
---

## What I do

Provide comprehensive TypeScript best practices for type safety, generics, async patterns, and modern TypeScript features to write robust type-safe code.

### Core Areas Covered

**Type Safety**
- Strict mode configuration
- Type assertions vs. type guards
- Type inference and best practices
- Union and intersection types
- Literal types and enums

**Generics**
- Generic functions and classes
- Type parameters and constraints
- Utility types
- Generic type inference

**Async Patterns**
- Async/await patterns
- Promises with proper typing
- Error handling in async code
- Generator functions

**Modern TypeScript Features**
- Decorators
- Conditional types
- Mapped types
- Template literal types

## When to use me

Use this skill when you need to:
- Write type-safe TypeScript code
- Implement generic functions and classes
- Use advanced TypeScript features
- Configure TypeScript for strict type checking
- Handle async operations with proper typing
- Create type-safe API interfaces
- Use modern TypeScript features effectively
- Debug TypeScript type issues
- Follow TypeScript best practices

### Common Scenarios

- **New TypeScript Project**: Set up strict type checking
- **API Development**: Create type-safe request/response models
- **Library Development**: Use generics for reusable code
- **Async Operations**: Handle promises and async/await with proper types
- **Type Refactoring**: Improve existing code with better typing
- **Type Guards**: Create reusable type checking functions
- **Tooling Configuration**: Set up TypeScript compiler options

## Guidelines

### TypeScript Configuration

**Strict Mode Setup**
```typescript
// ✅ GOOD - Strict mode configuration (tsconfig.json)
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "module": "ESNext",
    "moduleResolution": "node",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",
    "rootDir": "./src"
  }
}

// ✅ Strict mode flags explained:
// strict: true - Enables all strict type checking options
// noImplicitAny: true - Disallows implicit any types
// strictNullChecks: true - Checks for null/undefined
// strictFunctionTypes: true - More accurate function typing
// strictBindCallApply: true - Checks bind/call/apply
// strictPropertyInitialization: true - Ensures class properties initialized
// noImplicitThis: true - Disallows implicit any in this context
// alwaysStrict: true - Ensures strict mode in all files
```

### Type Safety

**Avoid Any**
```typescript
// ❌ BAD - Using any (loses type safety)
function processValue(value: any) {
  return value.toUpperCase();
}

// ✅ GOOD - Use unknown and type guards
function processValue(value: unknown): string {
  if (typeof value === 'string') {
    return value.toUpperCase();
  }
  throw new Error('Expected a string');
}

// ✅ EVEN BETTER - Use typed function overloads
function processValue(value: string): string;
function processValue(value: number): number;
function processValue(value: unknown): string | number {
  if (typeof value === 'string') {
    return value.toUpperCase();
  } else if (typeof value === 'number') {
    return value * 2;
  }
  throw new Error('Invalid type');
}
```

**Type Inference**
```typescript
// ✅ GOOD - Let TypeScript infer types when possible
const user = {
  id: 1,
  name: 'John',
  email: 'john@example.com'
};

function createUser(name: string, email: string) {
  return { name, email };
}

// ❌ BAD - Explicitly declaring types when unnecessary
const user: { id: number; name: string; email: string } = {
  id: 1,
  name: 'John',
  email: 'john@example.com'
};

function createUser(name: string, email: string): { name: string; email: string } {
  return { name, email };
}
```

**Union Types**
```typescript
// ✅ GOOD - Using union types for flexible but typed code
function printStatus(status: 'success' | 'pending' | 'failed') {
  console.log(`Status: ${status}`);
}

function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('');
}

// Usage
printStatus('success');
printStatus('pending');
getInitials('John Doe'); // 'JD'

// ❌ BAD - Any of string
function printStatus(status: string) {
  console.log(`Status: ${status}`);
}
```

**Literal Types**
```typescript
// ✅ GOOD - Using literal types for precise typing
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface RequestOptions {
  method: HttpMethod;
  url: string;
  headers?: Record<string, string>;
  body?: unknown;
}

function makeRequest(options: RequestOptions): Promise<Response> {
  // Implementation
}

makeRequest({
  method: 'POST',
  url: '/api/users',
  body: { name: 'John' }
});

// ❌ BAD - Loose typing
interface RequestOptions {
  method: string;
  url: string;
}

makeRequest({
  method: 'PATCH', // Different literal value
  url: '/api/users'
});
```

**Enums**
```typescript
// ✅ GOOD - Using enums for meaningful type safety
enum UserRole {
  ADMIN = 'ADMIN',
  EDITOR = 'EDITOR',
  VIEWER = 'VIEWER'
}

interface User {
  id: number;
  name: string;
  role: UserRole;
}

function canEdit(user: User): boolean {
  return user.role === UserRole.ADMIN || user.role === UserRole.EDITOR;
}

// ✅ String enums (more performant)
enum UserRole {
  ADMIN = 'ADMIN',
  EDITOR = 'EDITOR',
  VIEWER = 'VIEWER'
}

// ❌ BAD - Using plain objects
type Role = 'ADMIN' | 'EDITOR' | 'VIEWER'; // Works but less explicit
```

### Type Guards

**Custom Type Guards**
```typescript
// ✅ GOOD - Creating reusable type guards
interface Dog {
  type: 'dog';
  bark(): void;
}

interface Cat {
  type: 'cat';
  meow(): void;
}

type Animal = Dog | Cat;

function isDog(animal: Animal): animal is Dog {
  return animal.type === 'dog';
}

function isCat(animal: Animal): animal is Cat {
  return animal.type === 'cat';
}

function makeNoise(animal: Animal) {
  if (isDog(animal)) {
    animal.bark(); // TypeScript knows it's a Dog
  } else if (isCat(animal)) {
    animal.meow(); // TypeScript knows it's a Cat
  }
}

// ✅ Using with assertions
function getAnimal(animal: Animal): Dog | Cat {
  if (animal.type === 'dog') {
    return animal as Dog;
  }
  return animal as Cat;
}
```

**Type Guards with Primitives**
```typescript
// ✅ GOOD - Type guards for primitives
function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function isNumber(value: unknown): value is number {
  return typeof value === 'number';
}

function isFunction(value: unknown): value is Function {
  return typeof value === 'function';
}

function process(value: unknown) {
  if (isString(value)) {
    console.log(value.toUpperCase());
  } else if (isNumber(value)) {
    console.log(value.toFixed(2));
  } else if (isFunction(value)) {
    value();
  }
}
```

### Generics

**Generic Functions**
```typescript
// ✅ GOOD - Generic function with type inference
function identity<T>(value: T): T {
  return value;
}

function first<T>(array: T[]): T | undefined {
  return array[0];
}

function filter<T>(array: T[], predicate: (item: T) => boolean): T[] {
  return array.filter(predicate);
}

// Usage
const name = identity<string>('Hello'); // Explicit type
const num = identity(42); // Type inferred
const firstItem = first(['a', 'b', 'c']); // Type inferred as string
const numbers = filter([1, 2, 3, 4], n => n % 2 === 0); // Type inferred as number[]
```

**Generic Classes**
```typescript
// ✅ GOOD - Generic class
class Stack<T> {
  private items: T[] = [];

  push(item: T): void {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  size(): number {
    return this.items.length;
  }
}

const stringStack = new Stack<string>();
stringStack.push('hello');
stringStack.push('world');
console.log(stringStack.peek()); // 'world'

const numberStack = new Stack<number>();
numberStack.push(1);
numberStack.push(2);
console.log(numberStack.peek()); // 2
```

**Generic Constraints**
```typescript
// ✅ GOOD - Generic constraints
interface HasLength {
  length: number;
}

function getFirstElement<T extends HasLength>(arr: T): T[0] {
  return arr[0];
}

// Usage
const arr1 = ['a', 'b', 'c'];
const first = getFirstElement(arr1); // 'a'

const arr2 = { length: 3, data: [1, 2, 3] };
const first2 = getFirstElement(arr2); // 1

// ❌ BAD - No constraint
function getFirst<T>(arr: T[]): T[0] {
  return arr[0];
}
```

**Utility Types**
```typescript
// ✅ GOOD - Using utility types
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

type UserWithoutId = Omit<User, 'id'>;
// { name: string; email: string; age: number; }

type UserPick = Pick<User, 'id' | 'name'>;
// { id: number; name: string; }

type UserReadonly = Readonly<User>;
// { readonly id: number; readonly name: string; ... }

type PartialUser = Partial<User>;
// { id?: number; name?: string; email?: string; age?: number; }

type UserRequired = Required<User>;
// { id: number; name: string; email: string; age: number; }

type UserDefaults = Default<User, { email: 'default@example.com' }>;
// { id: number; name: string; email: string; age: number; }

// Usage
const user: UserWithoutId = {
  name: 'John',
  email: 'john@example.com',
  age: 30
};
```

### Async Patterns

**Async/Await Properly Typed**
```typescript
// ✅ GOOD - Properly typed async/await
interface User {
  id: number;
  name: string;
  email: string;
}

async function fetchUser(id: number): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch user: ${response.status}`);
  }
  return response.json();
}

async function getUserName(id: number): Promise<string> {
  try {
    const user = await fetchUser(id);
    return user.name;
  } catch (error) {
    console.error('Error fetching user:', error);
    return 'Unknown User';
  }
}

// Usage
getUserName(1).then(name => console.log(name)).catch(err => {
  console.error('Unhandled error:', err);
});
```

**Promise Typing**
```typescript
// ✅ GOOD - Promise typing
function fetchUser(id: number): Promise<User> {
  return fetch(`/api/users/${id}`).then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  });
}

// ✅ Using Promise.all with proper typing
function fetchMultipleUsers(ids: number[]): Promise<User[]> {
  const promises = ids.map(id => fetchUser(id));
  return Promise.all(promises);
}

// ✅ Using Promise.race
function fetchFirstUser(ids: number[]): Promise<User> {
  const promises = ids.map(id => fetchUser(id));
  return Promise.race(promises);
}
```

**Error Handling in Async**
```typescript
// ✅ GOOD - Comprehensive async error handling
async function processData<T>(
  data: T,
  process: (item: T) => Promise<T>
): Promise<T> {
  try {
    return await process(data);
  } catch (error) {
    if (error instanceof Error) {
      logger.error('Processing failed', {
        error: error.message,
        stack: error.stack,
        data
      });
    }
    throw error;
  }
}

// Usage
try {
  const result = await processData(data, complexProcessing);
} catch (error) {
  if (error instanceof Error) {
    // Handle specific errors
    if (error.message.includes('timeout')) {
      // Handle timeout
    } else if (error.message.includes('validation')) {
      // Handle validation errors
    }
  }
}
```

### Modern TypeScript Features

**Conditional Types**
```typescript
// ✅ GOOD - Conditional types for flexible typing
type ToArray<T> = T extends any[] ? T : T[];

type StrArr = ToArray<string>; // string[]
type NumArr = ToArray<number>; // number[]
type Str = ToArray<string>; // string

type TypeName<T> = T extends number
  ? 'number'
  : T extends string
  ? 'string'
  : T extends boolean
  ? 'boolean'
  : 'other';

type NumName = TypeName<number>; // 'number'
type StrName = TypeName<string>; // 'string'
```

**Mapped Types**
```typescript
// ✅ GOOD - Mapped types
type ReadOnly<T> = {
  readonly [P in keyof T]: T[P];
};

type Optional<T> = {
  [P in keyof T]?: T[P];
};

type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

interface User {
  id: number;
  name: string;
  email: string;
}

type ReadOnlyUser = ReadOnly<User>;
type OptionalUser = Optional<User>;
type NullableUser = Nullable<User>;
```

**Template Literal Types**
```typescript
// ✅ GOOD - Template literal types
type EventName = 'login' | 'logout' | 'register';

type ApiEndpoint<T extends EventName> = `/${T}`;

type LoginEndpoint = ApiEndpoint<'login'>; // '/login'
type LogoutEndpoint = ApiEndpoint<'logout'>; // '/logout'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

type ApiRequest<T extends HttpMethod> = {
  method: T;
  url: string;
};

type GetRequest = ApiRequest<'GET'>; // { method: 'GET'; url: string; }
type PostRequest = ApiRequest<'POST'>; // { method: 'POST'; url: string; }
```

**Decorators (Class Fields Only)**
```typescript
// ✅ GOOD - Decorators with TypeScript
function log(methodName: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      console.log(`Calling ${methodName} with args:`, args);
      const result = originalMethod.apply(this, args);
      console.log(`${methodName} returned:`, result);
      return result;
    };
  };
}

class Calculator {
  @log('add')
  add(a: number, b: number): number {
    return a + b;
  }

  @log('subtract')
  subtract(a: number, b: number): number {
    return a - b;
  }
}

const calc = new Calculator();
calc.add(1, 2); // Logs: 'Calling add with args: [1, 2]'
```

### Type Definition Best Practices

**Interface vs Type**
```typescript
// ✅ GOOD - Use interface for objects, type for unions and mappings
interface User {
  id: number;
  name: string;
  email: string;
}

type UserStatus = 'active' | 'inactive' | 'pending';

type UserId = string & { readonly __brand: unique symbol };

function isUserId(id: unknown): id is UserId {
  return typeof id === 'string' && id.startsWith('user_');
}

// ❌ BAD - Using type for interface-like objects (less readable)
type User = {
  id: number;
  name: string;
  email: string;
};
```

**Type Guards and Assertions**
```typescript
// ✅ GOOD - Proper type guards and assertions
function assertIsString(value: unknown): asserts value is string {
  if (typeof value !== 'string') {
    throw new Error('Expected string');
  }
}

function assertIsNumber(value: unknown): asserts value is number {
  if (typeof value !== 'number') {
    throw new Error('Expected number');
  }
}

function process(value: unknown) {
  assertIsString(value);
  console.log(value.toUpperCase());
}

// ✅ Non-null assertion (only use when you're certain)
const nonNullValue = getValue()!;

// ✅ Type assertion (should be avoided, use type guards instead)
const number = value as number;
```

## Common TypeScript Pitfalls to Avoid

- **Using `any` when you don't need it** - Always try to use specific types
- **Ignoring strict mode** - Enable strict mode in tsconfig.json
- **Not using type guards** - Relying on type assertions instead
- **Overusing `any`** - It defeats the purpose of TypeScript
- **Ignoring type inference** - Let TypeScript infer types when possible
- **Not using generics** - Creating multiple similar functions instead of one generic
- **Poorly typed async code** - Not handling Promise types properly
- **Complex type definitions without comments** - Make types self-documenting
- **Not using const assertions** - When you know a value is immutable

## Resources

- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [TypeScript Handbook - Type Guards](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#type-guards)
- [TypeScript Handbook - Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)
- [TypeScript Handbook - Utility Types](https://www.typescriptlang.org/docs/handbook/2/utility-types.html)
- [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)
- [Mastering TypeScript](https://github.com/Microsoft/TypeScript-Handbook/blob/master/pages/TypeScript-in-5-Minutes.md)

## Ask Before Proceeding

Clarify these questions when needed:
- What TypeScript version is being used?
- What are the tsconfig.json settings?
- Are there existing type definitions that need to be followed?
- Should strict mode be enabled?
- What modern TypeScript features should be used?
- Are there third-party libraries with types that need to be integrated?
- What is the target environment (Node, browser, etc.)?
