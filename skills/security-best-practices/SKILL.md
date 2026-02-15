---
name: security-best-practices
description: Security guidelines, OWASP standards, vulnerability patterns, and secure coding standards
license: MIT
compatibility: opencode
metadata:
  audience: developers
  experience: all levels
  security-level: high
---

## What I do

Provide comprehensive security guidance for secure application development, OWASP compliance, vulnerability prevention, and secure coding patterns.

### Core Areas Covered

**OWASP Compliance**
- OWASP Top 10 mitigation strategies
- Secure coding standards and guidelines
- Security requirements definition
- Threat modeling guidance

**Vulnerability Prevention**
- SQL injection prevention
- XSS prevention
- Authentication and authorization best practices
- Input validation and sanitization

**Secure Coding Patterns**
- Secure data handling
- Cryptography best practices
- Session management
- API security

**Security Operations**
- Secure deployment practices
- Dependency vulnerability scanning
- Security testing integration
- Incident response basics

## When to use me

Use this skill when you need to:
- Implement OWASP-compliant security controls
- Prevent common vulnerabilities (SQLi, XSS, CSRF)
- Design secure authentication and authorization systems
- Handle sensitive data securely
- Review security in code reviews
- Integrate security testing into development workflows
- Secure APIs and external integrations
- Implement secure session management
- Handle secrets and credentials safely

### Common Scenarios

- **New application**: Implement security requirements from the start
- **Security audit**: Review code for OWASP Top 10 compliance
- **Vulnerability fix**: Address specific security issues (SQLi, XSS, etc.)
- **Authentication**: Set up secure login systems, JWT, sessions
- **Data security**: Encrypt sensitive data, secure storage practices
- **API security**: Implement rate limiting, CORS, auth, input validation
- **Dependency management**: Check for known vulnerabilities in packages
- **Secret management**: Secure handling of API keys, credentials

## Guidelines

### OWASP Top 10 Mitigations

**1. Broken Access Control**
- Always validate authorization before allowing operations
- Implement least privilege principle
- Use role-based access control (RBAC)
- Avoid direct object references in URLs

```typescript
// ✅ GOOD - Validate authorization
async function deleteUser(userId: string): Promise<void> {
  const currentUser = await auth.getCurrentUser();
  const targetUser = await db.users.findById(userId);

  if (targetUser?.role !== 'admin' && currentUser.role !== 'admin') {
    throw new ForbiddenError('You do not have permission to delete users');
  }

  await db.users.delete(userId);
}

// ❌ BAD - Trusting authorization from client
async function deleteUser(userId: string): Promise<void> {
  await db.users.delete(userId); // User can delete anyone!
}
```

**2. Cryptographic Failures**
- Never store plaintext passwords
- Always use strong, modern algorithms
- Validate encryption parameters
- Use proper key management

```typescript
// ✅ GOOD - Secure password hashing
import bcrypt from 'bcrypt';

async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// ❌ BAD - Plaintext passwords
async function verifyPassword(password: string, stored: string): Promise<boolean> {
  return password === stored; // Insecure!
}
```

```typescript
// ✅ GOOD - Secure encryption
import crypto from 'crypto';

const algorithm = 'aes-256-gcm';
const key = crypto.scryptSync(process.env.ENCRYPTION_KEY!, 'salt', 32);

function encrypt(text: string): { encrypted: string; iv: string; authTag: string } {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return {
    encrypted,
    iv: iv.toString('hex'),
    authTag: cipher.getAuthTag().toString('hex')
  };
}

function decrypt(encrypted: string, iv: string, authTag: string): string {
  const decipher = crypto.createDecipheriv(
    algorithm,
    key,
    Buffer.from(iv, 'hex')
  );
  decipher.setAuthTag(Buffer.from(authTag, 'hex'));
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
```

**3. Injection**
- Never trust user input
- Use parameterized queries
- Validate and sanitize all input
- Use frameworks' built-in protection

```javascript
// ✅ GOOD - Parameterized queries
const query = 'SELECT * FROM users WHERE email = ?';
const results = await db.execute(query, [userInput]);

// ❌ BAD - SQL Injection
const query = `SELECT * FROM users WHERE email = '${userInput}'`;
const results = await db.execute(query); // Vulnerable!
```

```typescript
// ✅ GOOD - Input validation
import Joi from 'joi';

const userSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).pattern(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/
  ).required(),
  age: Joi.number().integer().min(18).max(120).optional()
});

async function registerUser(userData: any) {
  const { error, value } = userSchema.validate(userData);
  if (error) throw new ValidationError(error.details);
  // Proceed with safe user data
}
```

**4. Insecure Design**
- Perform threat modeling early
- Design for failure
- Implement security controls at all layers
- Consider data at rest and in transit

```typescript
// ✅ GOOD - Multi-factor authentication
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';

async function setupMFA(userId: string) {
  const secret = speakeasy.generateSecret({
    name: `MyApp (${userId})`,
    issuer: 'MyApp'
  });

  const qrCode = await QRCode.toDataURL(secret.otpauth_url);
  await saveSecret(userId, secret.base32);

  return { qrCode, secret: secret.base32 };
}

async function verifyTOTP(token: string, secret: string): Promise<boolean> {
  return speakeasy.verify({
    secret,
    encoding: 'base32',
    token,
    window: 3 // Allow 3 time steps for clock skew
  });
}
```

### Authentication and Authorization

**Secure Session Management**
- Use secure, HttpOnly cookies
- Set appropriate SameSite flags
- Implement session timeout
- Use strong session identifiers

```typescript
// ✅ GOOD - Secure session cookie
res.cookie('session', token, {
  httpOnly: true,      // Prevent XSS access
  secure: process.env.NODE_ENV === 'production', // Only HTTPS
  sameSite: 'strict',  // CSRF protection
  maxAge: 3600000,     // 1 hour
  domain: '.yourapp.com'
});
```

**JWT Security**
```typescript
// ✅ GOOD - Secure JWT usage
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;
const TOKEN_EXPIRY = '1h';

function generateToken(payload: any): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: TOKEN_EXPIRY,
    issuer: 'myapp.com',
    audience: 'myapp.com'
  });
}

function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET, {
      issuer: 'myapp.com',
      audience: 'myapp.com'
    });
  } catch (error) {
    // Invalid token - handle appropriately
    throw new UnauthorizedError('Invalid or expired token');
  }
}
```

### Cryptography Best Practices

**Never Hardcode Secrets**
```typescript
// ❌ BAD - Hardcoded secrets
const API_KEY = 'sk_live_1234567890abcdef';

// ✅ GOOD - Environment variables
const API_KEY = process.env.STRIPE_SECRET_KEY!;

// ✅ GOOD - Inject from secrets manager
const { getSecret } = require('@aws-sdk/client-secrets-manager');
const API_KEY = await getSecret('prod/stripe-api-key');
```

**Secure Storage of Secrets**
```typescript
// ✅ GOOD - Using AWS Secrets Manager (example)
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';

const client = new SecretsManagerClient({ region: 'us-east-1' });

async function getDatabaseCredentials() {
  const response = await client.send(
    new GetSecretValueCommand({ SecretId: 'prod/database-creds' })
  );
  return JSON.parse(response.SecretString);
}
```

### API Security

**Implement Rate Limiting**
```typescript
// ✅ GOOD - Rate limiting with Redis
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';

const limiter = rateLimit({
  store: new RedisStore({ client: redisClient }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP'
});
```

**Secure Headers**
```typescript
// ✅ GOOD - Security headers middleware
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"], // For inline scripts in dev
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```

**Implement CORS Properly**
```typescript
// ✅ GOOD - Secure CORS configuration
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || [],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400 // 24 hours
}));
```

### Input Validation and Sanitization

**Comprehensive Validation**
```typescript
// ✅ GOOD - Comprehensive input validation
import { body, validationResult } from 'express-validator';

const registerValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Invalid email address'),
  body('password')
    .isLength({ min: 12 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain uppercase, lowercase, and numbers'),
  body('age')
    .isInt({ min: 18, max: 120 })
    .withMessage('Age must be between 18 and 120'),
  body('website')
    .isURL()
    .withMessage('Invalid website URL')
    .optional()
];

app.post('/register', registerValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // Proceed with safe data
});
```

### Security Testing Integration

**Include Security Tests**
```typescript
// ✅ GOOD - Security test example
describe('Security: Password Requirements', () => {
  test('should reject passwords under 8 characters', () => {
    expect(() => validatePassword('short123')).toThrow('Password too short');
  });

  test('should reject passwords without uppercase', () => {
    expect(() => validatePassword('nocaps123')).toThrow('Must contain uppercase');
  });

  test('should reject passwords without numbers', () => {
    expect(() => validatePassword('nocaps123')).toThrow('Must contain uppercase');
  });
});
```

## Common Security Pitfalls to Avoid

- **Never trust client-side input** - Always validate on server
- **Never hardcode secrets** - Use environment variables or secrets managers
- **Never use MD5/SHA1** - Use bcrypt, Argon2, or scrypt for passwords
- **Never store plain text passwords** - Always hash with strong algorithms
- **Never use eval() or Function constructor** - They execute arbitrary code
- **Never expose stack traces to clients** - Can leak sensitive information
- **Never ignore security updates** - Keep dependencies updated
- **Never use weak encryption** - Use AES-256-GCM for data at rest
- **Never skip input validation** - Even on seemingly safe inputs
- **Never use HTTP for sensitive data** - Always use HTTPS

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [OWASP JWT Guide](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html)
- [CWE/CVE Databases](https://cwe.mitre.org/)
- [National Vulnerability Database](https://nvd.nist.gov/)
- [OWASP Secure Coding Practices](https://owasp.org/www-project-secure-coding-practices-quick-reference-guide/)

## Ask Before Proceeding

Clarify these questions when needed:
- What type of application is being secured (web, API, mobile, etc.)?
- What is the data sensitivity level (PII, financial, health, etc.)?
- What are the compliance requirements (HIPAA, PCI DSS, GDPR, etc.)?
- What authentication mechanism is being used (OAuth, SAML, custom)?
- Are there third-party integrations that need security consideration?
- What is the deployment environment (cloud, on-prem, hybrid)?
- Are there existing security requirements or audit findings to address?
