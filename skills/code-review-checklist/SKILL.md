---
name: code-review-checklist
description: Code review guidelines, antipatterns, code smells, and comprehensive review criteria
license: MIT
compatibility: opencode
metadata:
  audience: code reviewers, developers
  experience: all levels
---

## What I do

Provide comprehensive code review checklists and guidelines to identify antipatterns, code smells, and ensure code quality standards are met.

### Core Areas Covered

**Code Smells**
- Duplicate code patterns
- Long methods and functions
- Complex conditional logic
- Inappropriate abstraction levels
- Dead code and commented-out code

**Antipatterns**
- Magic numbers and strings
- God objects
- Feature envy
- Shotgun surgery
- Data clumps

**Code Quality Standards**
- Maintainability metrics
- Readability guidelines
- Testability considerations
- Performance implications

**Security and Best Practices**
- Security vulnerabilities
- Performance bottlenecks
- Error handling issues
- Dependency concerns

## When to use me

Use this skill when you need to:
- Perform code reviews to ensure quality
- Identify and fix code smells and antipatterns
- Review code for security vulnerabilities
- Assess code maintainability and readability
- Evaluate code for testability
- Provide constructive feedback on pull requests
- Create review checklists for team standards
- Onboard new developers to coding standards
- Ensure consistent code quality across projects

### Common Scenarios

- **Pull Request Review**: Use the checklist to ensure PR meets standards
- **Code Audit**: Systematically review code for issues
- **Technical Debt Management**: Identify and prioritize code quality improvements
- **Onboarding**: Teach code review practices to new team members
- **Code Cleanup**: Refactor code based on identified issues
- **Quality Gate**: Ensure code meets organization standards before merging
- **Mentoring**: Guide developers on writing better code
- **Automated Reviews**: Use checklist as template for automated tools

## Guidelines

### Code Smells to Identify

**Duplicate Code**
```javascript
// ❌ BAD - Duplicate code
function calculateTax1(amount, rate) {
  const tax = amount * rate;
  return tax;
}

function calculateTax2(amount, rate) {
  const tax = amount * rate;
  return tax;
}

// ✅ GOOD - Extract to reusable function
function calculateTax(amount, rate) {
  return amount * rate;
}

// Use DRY (Don't Repeat Yourself) principle
function calculateTaxWithThreshold(amount, rate, threshold) {
  const taxableAmount = amount > threshold ? amount - threshold : 0;
  return taxableAmount * rate;
}
```

**Long Methods**
```javascript
// ❌ BAD - 100+ line method, hard to test and understand
async function processOrder(order, inventory, shipping, billing) {
  // Validate order
  if (!order.id || !order.items || order.items.length === 0) {
    throw new Error('Invalid order');
  }

  // Check inventory for all items
  for (const item of order.items) {
    const stock = await inventory.getStock(item.sku);
    if (stock < item.quantity) {
      throw new Error(`Insufficient stock for ${item.sku}`);
    }
  }

  // Check inventory again (should be in a transaction)
  // ... more code ...

  // Calculate total
  let total = 0;
  for (const item of order.items) {
    const price = await inventory.getPrice(item.sku);
    total += price * item.quantity;
  }

  // Process payment
  const paymentResult = await billing.charge(total);

  // Update inventory
  // ... more code ...

  // Update shipping
  // ... more code ...

  // Send confirmation email
  // ... more code ...

  return { status: 'success', orderId: order.id };
}

// ✅ GOOD - Break into smaller, focused methods
async function processOrder(order, inventory, shipping, billing) {
  validateOrder(order);
  await ensureSufficientInventory(order, inventory);
  const total = calculateTotal(order, inventory);
  const paymentResult = await billing.charge(total);
  await updateInventory(order, inventory);
  await updateShipping(order, shipping);
  await sendConfirmation(order);
  return { status: 'success', orderId: order.id };
}
```

**Complex Conditional Logic**
```javascript
// ❌ BAD - Multiple nested conditions, hard to read
if (user.isLoggedIn && user.hasPermission('write') &&
    user.organization === 'acme' && user.plan === 'premium' &&
    user.age >= 18 && user.country === 'US' &&
    user.suspended === false && user.verified === true) {
  // Allow operation
} else {
  // Deny operation
}

// ✅ GOOD - Early returns and smaller functions
function canUserPerformOperation(user, requiredPermission) {
  if (!user.isLoggedIn) return false;
  if (!user.hasPermission(requiredPermission)) return false;
  if (user.age < 18) return false;
  if (user.suspended) return false;
  if (!user.verified) return false;
  return true;
}

function canUserWrite(user) {
  if (!canUserPerformOperation(user, 'write')) return false;
  return user.organization === 'acme' && user.plan === 'premium';
}
```

**Feature Envy**
```javascript
// ❌ BAD - Feature envy - controller accessing repository methods directly
class UserController {
  async updateUser(id, updates) {
    const user = await this.userRepository.findById(id);
    // Many operations on the user object
    user.email = updates.email;
    user.name = updates.name;
    user.address = updates.address;
    user.phone = updates.phone;
    user.preferences = updates.preferences;
    // ... 50 more lines of updates ...
    return await this.userRepository.save(user);
  }
}

// ✅ GOOD - Let the domain object handle its own updates
class User {
  update(updates) {
    if (updates.email) this.email = updates.email;
    if (updates.name) this.name = updates.name;
    if (updates.address) this.address = updates.address;
    if (updates.phone) this.phone = updates.phone;
    if (updates.preferences) this.preferences = updates.preferences;
    // ... other updates ...
  }
}

class UserController {
  async updateUser(id, updates) {
    const user = await this.userRepository.findById(id);
    user.update(updates);
    return await this.userRepository.save(user);
  }
}
```

**God Object**
```javascript
// ❌ BAD - God object - does too much, hard to test
class App {
  constructor(config, db, logger, cache, queue, emailService) {
    this.config = config;
    this.db = db;
    this.logger = logger;
    this.cache = cache;
    this.queue = queue;
    this.emailService = emailService;
  }

  // Methods for everything
  handleRequest(req) { /* ... */ }
  processPayment(amount) { /* ... */ }
  sendEmail(to, subject, body) { /* ... */ }
  updateCache(key, value) { /* ... */ }
  log(message, level) { /* ... */ }
  // ... 100+ more methods
}

// ✅ GOOD - Separate concerns into focused classes
class UserController {
  constructor(userRepository, userService) {
    this.userRepository = userRepository;
    this.userService = userService;
  }
}

class PaymentService {
  constructor(billingService, logger) {
    this.billingService = billingService;
    this.logger = logger;
  }
}

class EmailService {
  constructor(config, queue) {
    this.config = config;
    this.queue = queue;
  }
}
```

### Antipatterns to Identify

**Magic Numbers**
```javascript
// ❌ BAD - Magic numbers make code hard to understand
if (response.status === 200) {
  // ...
}

// ✅ GOOD - Use named constants
const HTTP_OK = 200;
const HTTP_NOT_FOUND = 404;

if (response.status === HTTP_OK) {
  // ...
}

// ✅ EVEN BETTER - Use enum or enum-like object
const HTTP_STATUS = {
  OK: 200,
  NOT_FOUND: 404,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403
};

if (response.status === HTTP_STATUS.OK) {
  // ...
}
```

**Magic Strings**
```javascript
// ❌ BAD - Magic strings
if (response.data.type === 'user_created') {
  // ...
}

// ✅ GOOD - Use constants
const EVENT_TYPES = {
  USER_CREATED: 'user_created',
  USER_UPDATED: 'user_updated',
  USER_DELETED: 'user_deleted'
};

if (response.data.type === EVENT_TYPES.USER_CREATED) {
  // ...
}
```

**Shotgun Surgery**
```javascript
// ❌ BAD - Shotgun surgery - every change requires edits in multiple places
class Order {
  addLineItem(product, quantity) {
    this.items.push({ product, quantity });
  }

  removeLineItem(productId) {
    this.items = this.items.filter(item => item.product.id !== productId);
  }

  updateLineItemQuantity(productId, newQuantity) {
    const item = this.items.find(i => i.product.id === productId);
    if (item) item.quantity = newQuantity;
  }
}

// Customer needs new field
class Order {
  addLineItem(product, quantity) {
    this.items.push({ product, quantity });
  }

  removeLineItem(productId) {
    this.items = this.items.filter(item => item.product.id !== productId);
  }

  updateLineItemQuantity(productId, newQuantity) {
    const item = this.items.find(i => i.product.id === productId);
    if (item) item.quantity = newQuantity;
  }

  // Change here
  getCustomerId() {
    return this.customerId;
  }

  setCustomerId(customerId) {
    this.customerId = customerId;
  }
}

// ✅ GOOD - Extract to separate concerns
class LineItem {
  constructor(product, quantity) {
    this.product = product;
    this.quantity = quantity;
  }

  updateQuantity(newQuantity) {
    this.quantity = newQuantity;
  }

  getProductId() {
    return this.product.id;
  }
}

class Order {
  constructor() {
    this.items = [];
  }

  addLineItem(product, quantity) {
    this.items.push(new LineItem(product, quantity));
  }

  removeLineItem(productId) {
    this.items = this.items.filter(item => item.getProductId() !== productId);
  }

  updateLineItemQuantity(productId, newQuantity) {
    const item = this.items.find(i => i.getProductId() === productId);
    if (item) item.updateQuantity(newQuantity);
  }
}

// Customer changes now handled separately
class Order {
  getCustomerId() {
    return this.customerId;
  }

  setCustomerId(customerId) {
    this.customerId = customerId;
  }
}
```

**Data Clumps**
```javascript
// ❌ BAD - Data clumps - related data passed around together
function processOrder(userId, orderId, amount, currency, paymentMethod, billingAddress, shippingAddress) {
  // ...
}

function createInvoice(userId, orderId, amount, currency, taxRate, discountAmount, totalAmount, dueDate) {
  // ...
}

// ✅ GOOD - Create domain objects for related data
class Order {
  constructor(customer, items, paymentMethod, shippingAddress, billingAddress) {
    this.customer = customer;
    this.items = items;
    this.paymentMethod = paymentMethod;
    this.shippingAddress = shippingAddress;
    this.billingAddress = billingAddress;
  }
}

class Invoice {
  constructor(customer, order, taxRate, discountAmount, totalAmount, dueDate) {
    this.customer = customer;
    this.order = order;
    this.taxRate = taxRate;
    this.discountAmount = discountAmount;
    this.totalAmount = totalAmount;
    this.dueDate = dueDate;
  }
}
```

### Security Code Review Checklist

**Input Validation**
```javascript
// ❌ BAD - No input validation
app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  User.create({ name, email });
});

// ✅ GOOD - Validate all inputs
app.post('/api/users', (req, res) => {
  const { name, email } = req.body;

  if (!name || name.length < 2) {
    return res.status(400).json({ error: 'Name is required and must be at least 2 characters' });
  }

  if (!email || !isValidEmail(email)) {
    return res.status(400).json({ error: 'Valid email is required' });
  }

  User.create({ name, email });
});
```

**SQL Injection Prevention**
```javascript
// ❌ BAD - SQL injection vulnerability
app.get('/api/users/:id', (req, res) => {
  const id = req.params.id;
  db.query(`SELECT * FROM users WHERE id = ${id}`); // Vulnerable!
});

// ✅ GOOD - Parameterized queries
app.get('/api/users/:id', (req, res) => {
  const id = req.params.id;
  db.query('SELECT * FROM users WHERE id = ?', [id]); // Safe
});
```

**Error Messages**
```javascript
// ❌ BAD - Exposes sensitive information
app.delete('/api/users/:id', (req, res) => {
  try {
    await User.delete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message }); // Leaks internal info
  }
});

// ✅ GOOD - Generic error messages
app.delete('/api/users/:id', (req, res) => {
  try {
    await User.delete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
```

### Performance Code Review Checklist

**Database Queries**
```javascript
// ❌ BAD - N+1 query problem
function getOrdersWithUsers(userIds) {
  const orders = await Order.find({ user: { $in: userIds } });
  return orders.map(order => {
    const user = await User.findById(order.userId); // N+1 query!
    return { ...order, user };
  });
}

// ✅ GOOD - Single query with population
function getOrdersWithUsers(userIds) {
  const orders = await Order.find({ user: { $in: userIds } })
    .populate('user', 'name email'); // Single query
  return orders;
}
```

**Inefficient Loops**
```javascript
// ❌ BAD - O(n²) complexity
function findMatchingItems(items1, items2) {
  return items1.filter(item1 =>
    items2.some(item2 => item1.id === item2.id)
  );
}

// ✅ GOOD - Use Set for O(1) lookup
function findMatchingItems(items1, items2) {
  const itemIds = new Set(items2.map(item => item.id));
  return items1.filter(item1 => itemIds.has(item1.id));
}
```

### Code Quality Checklist

**Readability**
```javascript
// ❌ BAD - Hard to read
const u = await db.query('SELECT * FROM users WHERE id = ?', [id]);

// ✅ GOOD - Descriptive variable names
const userId = 1;
const user = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
```

```javascript
// ❌ BAD - Deep nesting
function processData(data) {
  if (data && data.items) {
    for (let i = 0; i < data.items.length; i++) {
      const item = data.items[i];
      if (item && item.type === 'important') {
        // Process important item
      }
    }
  }
}

// ✅ GOOD - Early returns and explicit conditions
function processData(data) {
  if (!data?.items) return;

  const importantItems = data.items.filter(item =>
    item?.type === 'important'
  );

  importantItems.forEach(item => {
    // Process important item
  });
}
```

**Testability**
```javascript
// ❌ BAD - Hard to test - direct database access
class OrderService {
  async createOrder(items) {
    const order = await Order.create({ items });
    // Send email, update inventory, etc.
    await EmailService.sendConfirmation(order.id);
    await InventoryService.update(items);
    return order;
  }
}

// ✅ GOOD - Testable - inject dependencies
class OrderService {
  constructor(orderRepository, emailService, inventoryService) {
    this.orderRepository = orderRepository;
    this.emailService = emailService;
    this.inventoryService = inventoryService;
  }

  async createOrder(items) {
    const order = await this.orderRepository.create({ items });
    await this.emailService.sendConfirmation(order.id);
    await this.inventoryService.update(items);
    return order;
  }
}
```

### Code Review Checklist Template

**Functionality**
- [ ] Does the code do what it's supposed to do?
- [ ] Are edge cases handled?
- [ ] Are error cases handled?
- [ ] Are the expected outputs correct?
- [ ] Are input validations in place?

**Code Quality**
- [ ] Is the code readable and self-documenting?
- [ ] Are variable and function names clear?
- [ ] Is code structure logical and organized?
- [ ] Is code complexity reasonable (no long methods)?
- [ ] Are there appropriate comments (not explaining "what" but "why")?

**Best Practices**
- [ ] Are security best practices followed?
- [ ] Are performance considerations addressed?
- [ ] Are error messages clear and safe?
- [ ] Are dependencies used correctly?
- [ ] Is the code DRY (Don't Repeat Yourself)?

**Testing**
- [ ] Are there tests for the new functionality?
- [ ] Are edge cases and error paths tested?
- [ ] Do tests pass locally?
- [ ] Are test names clear and descriptive?
- [ ] Are mocks/stubs used appropriately?

**Maintainability**
- [ ] Is the code easy to modify in the future?
- [ ] Are the responsibilities clear?
- [ ] Is there appropriate abstraction?
- [ ] Is there any dead or commented-out code?
- [ ] Are the imports organized properly?

**Documentation**
- [ ] Are function signatures documented?
- [ ] Is complex logic explained?
- [ ] Are public APIs documented?
- [ ] Are there usage examples?

## Common Code Review Anti-Patterns to Avoid

- **Block comments covering multiple lines** - Break them into smaller, focused comments
- **One-liner comments before every line** - Use descriptive variable names instead
- **Invisible comments** - Comments that contradict the code
- **TODO comments without tracking** - Always add issue tracker reference
- **Over-commenting obvious code** - Comments should explain "why", not "what"
- **Reviewing only changes** - Always review the whole file for consistency
- **Focusing only on syntax** - Check logic, security, and performance too
- **Never discussing** - Code review should be a conversation
- **Being too harsh** - Focus on improvement, not criticism
- **Being too lenient** - Don't let bad code slide

## Resources

- [Clean Code (Robert C. Martin)](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882)
- [Refactoring (Martin Fowler)](https://refactoring.com/)
- [Working Effectively with Legacy Code (Michael Feathers)](https://www.amazon.com/Working-Effectively-Legacy-Michael-Feathers/dp/0131177052)
- [Code Review Handbook](https://google.github.io/eng-practices/review/)
- [GitHub Code Review Guidelines](https://docs.github.com/en/reviewing/managing-code-with-pull-requests)

## Ask Before Proceeding

Clarify these questions when needed:
- What is the review workflow (GitHub PR, Jira, email, etc.)?
- What are the code quality standards for the team?
- Are there specific review checklists or templates to follow?
- Should the review focus on new features, bug fixes, or refactoring?
- What is the turnaround time expectation for reviews?
- Should the review be a collaborative conversation or checklist-driven?
- Are there specific tools being used for reviews (CodeClimate, SonarQube, etc.)?
