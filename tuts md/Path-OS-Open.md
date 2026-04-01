# Node.js `os`, `path`, and `open` — Complete Tutorial

---

## 1. Introduction

In backend CLI and system-level Node.js applications, interacting with the operating system and file paths is essential. Three commonly used utilities are:

* `os` → System information (CPU, memory, OS, user, etc.)
* `path` → File and directory path manipulation
* `open` → Open files/URLs in the default system apps

---

# 2. OS Module (`os`)

## 2.1 What is `os`?

The built-in `os` module provides information about the system environment.

---

## 2.2 Import

```js
import os from 'os';
```

---

## 2.3 Common Methods

### os.platform()

Returns OS platform.

```js
console.log(os.platform()); // win32, linux, darwin
```

---

### os.arch()

CPU architecture.

```js
console.log(os.arch()); // x64, arm
```

---

### os.cpus()

Returns CPU core info.

```js
console.log(os.cpus());
```

---

### os.totalmem()

Total system memory (bytes).

```js
console.log(os.totalmem());
```

---

### os.freemem()

Available memory.

```js
console.log(os.freemem());
```

---

### os.homedir()

User home directory.

```js
console.log(os.homedir());
```

---

### os.hostname()

System hostname.

---

### os.uptime()

System uptime (seconds).

---

### os.userInfo()

Current user info.

```js
console.log(os.userInfo());
```

---

### os.networkInterfaces()

Network details.

---

### os.tmpdir()

Temporary directory.

---

## Use Case Example

```js
console.log(`System: ${os.platform()} (${os.arch()})`);
console.log(`Memory: ${os.freemem()}/${os.totalmem()}`);
```

---

# 3. Path Module (`path`)

## 3.1 What is `path`?

Used to handle and transform file paths safely across OS.

---

## 3.2 Import

```js
import path from 'path';
```

---

## 3.3 Core Methods

### path.join()

Join paths safely.

```js
path.join('folder', 'file.txt');
```

---

### path.resolve()

Creates absolute path.

```js
path.resolve('file.txt');
```

---

### path.basename()

Get file name.

```js
path.basename('/a/b/file.txt'); // file.txt
```

---

### path.dirname()

Directory path.

```js
path.dirname('/a/b/file.txt');
```

---

### path.extname()

File extension.

```js
path.extname('file.txt'); // .txt
```

---

### path.parse()

Break path into parts.

```js
console.log(path.parse('/a/b/file.txt'));
```

---

### path.format()

Build path from object.

```js
path.format({ dir: '/a/b', base: 'file.txt' });
```

---

### path.isAbsolute()

Check absolute path.

---

### path.normalize()

Clean path.

---

### path.sep

Path separator (`/` or `\\`).

---

## Example

```js
const filePath = path.join(os.homedir(), 'app', 'data.json');
console.log(filePath);
```

---

# 4. Open Package (`open`)

## 4.1 What is `open`?

`open` is an npm package used to open files, URLs, or apps from Node.js.

---

## 4.2 Installation

```bash
npm install open
```

---

## 4.3 Import

```js
import open from 'open';
```

---

## 4.4 Usage

### Open URL

```js
await open('https://google.com');
```

---

### Open File

```js
await open('file.txt');
```

---

### Open with specific app

```js
await open('file.txt', { app: { name: 'notepad' } });
```

---

### Open in browser (CLI tools)

```js
await open('http://localhost:3000');
```

---

### Options

* `app.name` → Application name
* `wait` → Wait for app to close
* `background` → Open in background

---

# 5. Combined Example

## CLI Tool Example

```js
import os from 'os';
import path from 'path';
import open from 'open';

async function main() {
  const home = os.homedir();

  const file = path.join(home, 'test.txt');

  console.log('Opening:', file);

  await open(file);
}

main();
```

---

# 6. Real Use Cases

* CLI tools storing config in home directory
* Opening browser after server start
* Generating platform-specific paths
* System diagnostics tools

---

# 7. Best Practices

* Always use `path.join()` instead of manual paths
* Use `os.homedir()` for user-specific files
* Avoid hardcoding OS paths
* Use `open` for better UX in CLI tools

---

# 8. Exercises

1. Build CLI to show system info
2. Create file in home directory
3. Open browser after starting server
4. Parse and display path components

---

# 9. Conclusion

These three utilities are essential for backend CLI and system-level programming in Node.js. Together, they help you build cross-platform and user-friendly tools.

---

