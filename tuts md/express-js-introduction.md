# Express.js Introduction

Express.js is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications. It simplifies the process of building robust APIs and web servers with Node.js.

## 1. Setting Up an Express Project

First, create a new directory and initialize a Node.js project:

```bash
mkdir my-express-app
cd my-express-app
npm init -y
npm install express --save
```

## 2. Your First Express Server

**File: `app.js`**
```javascript
// app.js

const express = require('express');
const app = express(); // Create an Express application
const port = 3000;

// Define a route for the root URL ('/')
app.get('/', (req, res) => {
  res.send('Hello World! This is an Express server.');
});

// Start the server
app.listen(port, () => {
  console.log(`Express server listening at http://localhost:${port}`);
});
```

**Run the server:**
```bash
node app.js
```
Open your browser and navigate to `http://localhost:3000/`.

## 3. Basic Routing

Routing refers to determining how an application responds to a client request to a particular endpoint, which is a URI (or path) and a specific HTTP request method (GET, POST, PUT, DELETE, etc.).

```javascript
// app.js (continued)

// GET request to /about
app.get('/about', (req, res) => {
  res.send('About Us page');
});

// POST request to /users
app.post('/users', (req, res) => {
  res.send('Create a new user');
});

// Route with parameters
app.get('/users/:id', (req, res) => {
  const userId = req.params.id;
  res.send(`Fetching user with ID: ${userId}`);
});

// Route with query parameters (e.g., /search?q=nodejs)
app.get('/search', (req, res) => {
  const searchTerm = req.query.q;
  res.send(`Searching for: ${searchTerm}`);
});
```

## 4. Middleware

Middleware functions are functions that have access to the request object (`req`), the response object (`res`), and the next middleware function in the application's request-response cycle. They can modify the request and response objects, terminate the request-response cycle, or call the next middleware function.

**Global Middleware (applied to all routes):**
```javascript
// app.js (continued)

// A simple logger middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next(); // Pass control to the next middleware/route handler
});

// Body parsing middleware for JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/data', (req, res) => {
  console.log('Received data:', req.body);
  res.json({ message: 'Data received!', data: req.body });
});
```

**Route-specific Middleware:**
```javascript
// app.js (continued)

const authMiddleware = (req, res, next) => {
  // Simulate authentication logic
  const isAuthenticated = true; // In a real app, check tokens/sessions
  if (isAuthenticated) {
    next();
  } else {
    res.status(401).send('Unauthorized');
  }
};

app.get('/admin', authMiddleware, (req, res) => {
  res.send('Welcome to the admin panel!');
});
```

## 5. Error Handling

Express comes with a default error handler. You can define custom error handling middleware functions.

```javascript
// app.js (continued)

// This middleware should be the last one defined
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack for debugging
  res.status(500).send('Something broke!');
});

// Example route that might throw an error
app.get('/broken', (req, res, next) => {
  try {
    throw new Error('This is a simulated error!');
  } catch (error) {
    next(error); // Pass the error to the error handling middleware
  }
});
```

## 6. Serving Static Files

Use `express.static` middleware to serve static files such as images, CSS files, and JavaScript files.

Create a `public` folder:
```bash
mkdir public
echo 'h1 { color: blue; }' > public/style.css
echo '<h1>Static Content</h1><link rel="stylesheet" href="/style.css">' > public/index.html
```

```javascript
// app.js (continued)

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Now you can access public/index.html at http://localhost:3000/index.html
// and public/style.css at http://localhost:3000/style.css
// or simply http://localhost:3000/ if public/index.html exists and is configured as root
```
