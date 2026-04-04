# Node.js Basics

Node.js is an open-source, cross-platform, JavaScript runtime environment that executes JavaScript code outside a web browser. It's often used for building backend services, APIs, and microservices.

## 1. Installation

The recommended way to install Node.js is using a Node Version Manager (NVM), which allows you to easily switch between different Node.js versions.

### Using NVM (Recommended)

**Install NVM (macOS/Linux):**
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
# Restart your terminal after installation
```

**Install Node.js with NVM:**
```bash
nvm install --lts # Installs the latest LTS version
nvm use --lts   # Uses the latest LTS version
nvm alias default lts # Sets LTS as the default version
node -v         # Verify Node.js installation
npm -v          # Verify npm (Node Package Manager) installation
```

### Direct Download

Alternatively, you can download the installer directly from the [official Node.js website](https://nodejs.org/en/download/).

## 2. Your First Node.js Script

Let's create a simple "Hello World" script.

**File: `app.js`**
```javascript
// app.js

console.log('Hello from Node.js!');

const http = require('http'); // Import the built-in http module

const hostname = '127.0.0.1'; // localhost
const port = 3000;

// Create an HTTP server
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello, World! This is a basic Node.js server.\n');
});

// Start the server
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
```

**Run the script:**
```bash
node app.js
```
Open your browser and navigate to `http://127.0.0.1:3000/` to see the output.

## 3. `package.json` - Project Manifest

`package.json` is a manifest file for your project. It contains metadata about your project (name, version, description) and lists all dependencies.

**Initialize `package.json`:**
```bash
npm init -y # The '-y' flag answers yes to all prompts
```
This will create a `package.json` file in your current directory.

**Example `package.json`:**
```json
{
  "name": "my-node-app",
  "version": "1.0.0",
  "description": "My first Node.js application",
  "main": "app.js",
  "scripts": {
    "start": "node app.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "Your Name",
  "license": "ISC",
  "dependencies": {
    "express": "^4.18.2"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

## 4. NPM - Node Package Manager

NPM is the default package manager for Node.js. It allows you to install, manage, and share packages (libraries/modules).

**Common NPM Commands:**

*   **Install a package:**
    ```bash
    npm install <package-name>
    npm i <package-name> # Shorthand
    ```
    Adds the package to `node_modules/` and as a `dependency` in `package.json`.

*   **Install a dev dependency:**
    ```bash
    npm install <package-name> --save-dev
    npm i <package-name> -D # Shorthand
    ```
    Adds the package to `devDependencies` in `package.json` (e.g., for testing or build tools).

*   **Install all dependencies:**
    ```bash
    npm install
    ```
    Installs all packages listed in `dependencies` and `devDependencies` of `package.json`.

*   **Uninstall a package:**
    ```bash
    npm uninstall <package-name>
    ```

*   **Run a script defined in `package.json`:**
    ```bash
    npm run <script-name>
    # e.g., npm run start
    ```

*   **Update all packages:**
    ```bash
    npm update
    ```

*   **Check for outdated packages:**
    ```bash
    npm outdated
    ```
