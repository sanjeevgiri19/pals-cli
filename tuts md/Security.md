# Security Best Practices — Complete Backend Guide

---

## 1. Introduction

Security is one of the most critical aspects of backend development. Poor security practices can lead to:

* Data breaches
* Unauthorized access
* Financial loss
* Reputation damage

This guide covers essential backend security concepts in depth:

* Password Hashing (bcrypt)
* SQL Injection Prevention
* XSS & CSRF Protection
* Helmet.js
* Input Sanitization
* HTTPS & SSL/TLS

---

# 2. Password Hashing (bcrypt)

## 2.1 Why Hash Passwords?

Never store plain text passwords. If your database is compromised, attackers gain instant access.

Hashing ensures:

* One-way transformation
* Impossible to reverse easily
* Secure storage

---

## 2.2 What is bcrypt?

`bcrypt` is a hashing algorithm designed specifically for passwords.

Features:

* Salt generation
* Slow hashing (resistant to brute force)
* Adaptive cost factor

---

## 2.3 How bcrypt Works

1. Generate salt
2. Combine password + salt
3. Hash using multiple rounds

---

## 2.4 Example

```js
import bcrypt from 'bcrypt';

const password = 'mypassword';

// Hashing
const hashed = await bcrypt.hash(password, 10);

// Comparing
const isMatch = await bcrypt.compare(password, hashed);
```

---

## 2.5 Best Practices

* Use salt rounds ≥ 10
* Never store raw passwords
* Use environment configs for cost factor
* Consider argon2 for higher security

---

# 3. SQL Injection Prevention

## 3.1 What is SQL Injection?

Attackers inject malicious SQL into queries.

Example attack:

```sql
SELECT * FROM users WHERE username = 'admin' --' AND password = '...'
```

---

## 3.2 Prevention Techniques

### 1. Parameterized Queries

```js
const query = 'SELECT * FROM users WHERE email = ?';
db.execute(query, [email]);
```

---

### 2. ORM Usage

Use ORMs like Prisma, Sequelize.

---

### 3. Input Validation

Validate all inputs before query.

---

### 4. Least Privilege DB Access

* Restrict DB permissions
* Avoid admin connections

---

## 3.3 Bad Example

```js
const query = `SELECT * FROM users WHERE email = '${email}'`;
```

---

# 4. XSS & CSRF Protection

---

## 4.1 XSS (Cross-Site Scripting)

### What is XSS?

Injecting malicious scripts into web pages.

Example:

```html
<script>alert('Hacked')</script>
```

---

## 4.2 Types of XSS

* Stored XSS
* Reflected XSS
* DOM-based XSS

---

## 4.3 Prevention

* Escape output
* Use templating engines
* Sanitize input
* Use CSP headers

---

## 4.4 CSRF (Cross-Site Request Forgery)

### What is CSRF?

Forcing users to perform unintended actions.

---

## 4.5 Prevention

* CSRF tokens
* SameSite cookies
* Double submit cookie pattern

---

## 4.6 Example (Express)

```js
import csurf from 'csurf';
app.use(csurf());
```

---

# 5. Helmet.js

## 5.1 What is Helmet?

Middleware to secure HTTP headers.

---

## 5.2 Installation

```bash
npm install helmet
```

---

## 5.3 Usage

```js
import helmet from 'helmet';
app.use(helmet());
```

---

## 5.4 Features

* Content Security Policy
* XSS Protection headers
* HSTS
* Frameguard

---

## 5.5 Example Config

```js
app.use(helmet({
  contentSecurityPolicy: true
}));
```

---

# 6. Input Sanitization

## 6.1 Why Important?

User input is the main attack vector.

---

## 6.2 Techniques

* Remove HTML tags
* Escape special characters
* Validate data types

---

## 6.3 Libraries

* validator.js
* DOMPurify

---

## 6.4 Example

```js
import validator from 'validator';

const email = validator.isEmail(input);
```

---

# 7. HTTPS & SSL/TLS

## 7.1 What is HTTPS?

Secure version of HTTP using encryption.

---

## 7.2 SSL/TLS

* Encrypts data in transit
* Prevents MITM attacks

---

## 7.3 How It Works

1. Client requests secure connection
2. Server sends certificate
3. Secure key exchange
4. Encrypted communication begins

---

## 7.4 Setup (Node.js)

```js
import https from 'https';
import fs from 'fs';

https.createServer({
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
}, app).listen(443);
```

---

## 7.5 Best Practices

* Use HTTPS everywhere
* Redirect HTTP → HTTPS
* Use strong TLS versions
* Use trusted certificates (Let's Encrypt)

---

# 8. Additional Best Practices

* Use environment variables for secrets
* Implement rate limiting
* Use logging & monitoring
* Keep dependencies updated
* Use authentication & authorization properly

---

# 9. Conclusion

Security is not optional. It must be integrated into every layer of backend development. Applying these practices significantly reduces vulnerabilities and improves system resilience.

---

