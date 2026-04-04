# Figlet, Boxen, fs, and yocto-spinner — Complete Tutorial

---

## 1. Overview

These libraries are commonly used in Node.js CLI tools to improve UX and handle filesystem operations:

* **figlet** → ASCII art text
* **boxen** → Draw boxes around text
* **fs (Node.js built-in)** → File system operations (MOST IMPORTANT)
* **yocto-spinner** → Lightweight terminal spinner

---

# 2. Figlet

## 2.1 What is figlet?

`figlet` converts text into ASCII art fonts.

## 2.2 Installation

```bash
npm install figlet
```

## 2.3 Usage

```js
import figlet from 'figlet';

console.log(figlet.textSync('HELLO'));
```

## 2.4 Async Version

```js
figlet('Hello', (err, data) => {
  console.log(data);
});
```

## 2.5 Options

```js
figlet.textSync('Hello', {
  font: 'Standard',
  horizontalLayout: 'default',
  verticalLayout: 'default'
});
```

## 2.6 List Fonts

```js
figlet.fonts((err, fonts) => {
  console.log(fonts);
});
```

---

# 3. Boxen

## 3.1 What is boxen?

`boxen` wraps text inside a styled box in terminal.

## 3.2 Installation

```bash
npm install boxen
```

## 3.3 Basic Usage

```js
import boxen from 'boxen';

console.log(boxen('Hello World'));
```

## 3.4 Options

```js
boxen('Message', {
  padding: 1,
  margin: 1,
  borderStyle: 'round',
  borderColor: 'green',
  backgroundColor: 'black',
  align: 'center'
});
```

## 3.5 Border Styles

* single
* double
* round
* bold

---

# 4. FS Module (MOST DETAILED)

## 4.1 What is fs?

Node.js built-in module for interacting with the file system.

Supports:

* File reading/writing
* Directory management
* Streams
* Permissions

---

## 4.2 Import

```js
import fs from 'fs';
import fsPromises from 'fs/promises';
```

---

## 4.3 Synchronous vs Asynchronous

* Sync → blocking
* Async → non-blocking (preferred)

---

## 4.4 Reading Files

### Async

```js
const data = await fsPromises.readFile('file.txt', 'utf-8');
```

### Sync

```js
const data = fs.readFileSync('file.txt', 'utf-8');
```

---

## 4.5 Writing Files

```js
await fsPromises.writeFile('file.txt', 'Hello');
```

Append:

```js
await fsPromises.appendFile('file.txt', '\nMore');
```

---

## 4.6 File Existence

```js
import { access } from 'fs/promises';

try {
  await access('file.txt');
  console.log('Exists');
} catch {
  console.log('Not exists');
}
```

---

## 4.7 Creating Directories

```js
await fsPromises.mkdir('folder', { recursive: true });
```

---

## 4.8 Reading Directories

```js
const files = await fsPromises.readdir('./');
```

---

## 4.9 Deleting Files

```js
await fsPromises.unlink('file.txt');
```

---

## 4.10 Removing Directories

```js
await fsPromises.rm('folder', { recursive: true, force: true });
```

---

## 4.11 Renaming Files

```js
await fsPromises.rename('a.txt', 'b.txt');
```

---

## 4.12 File Stats

```js
const stats = await fsPromises.stat('file.txt');
console.log(stats.isFile());
```

---

## 4.13 Streams (Advanced)

### Read Stream

```js
const stream = fs.createReadStream('file.txt');
stream.on('data', chunk => console.log(chunk));
```

### Write Stream

```js
const ws = fs.createWriteStream('file.txt');
ws.write('Hello');
```

---

## 4.14 Copy Files

```js
await fsPromises.copyFile('a.txt', 'b.txt');
```

---

## 4.15 Watch Files

```js
fs.watch('file.txt', () => console.log('Changed'));
```

---

## 4.16 Permissions

```js
await fsPromises.chmod('file.txt', 0o644);
```

---

## 4.17 Real Use Case

```js
import fs from 'fs/promises';

async function saveConfig(data) {
  await fs.writeFile('config.json', JSON.stringify(data, null, 2));
}
```

---

# 5. Yocto-Spinner

## 5.1 What is yocto-spinner?

Minimal spinner for CLI loading states.

## 5.2 Installation

```bash
npm install yocto-spinner
```

## 5.3 Usage

```js
import yoctoSpinner from 'yocto-spinner';

const spinner = yoctoSpinner();

spinner.start('Loading...');

setTimeout(() => {
  spinner.success('Done');
}, 2000);
```

## 5.4 Methods

* `start(text)`
* `success(text)`
* `error(text)`
* `stop()`

---

# 6. Combined Example CLI

```js
import figlet from 'figlet';
import boxen from 'boxen';
import fs from 'fs/promises';
import yoctoSpinner from 'yocto-spinner';

async function main() {
  console.log(figlet.textSync('CLI TOOL'));

  console.log(boxen('Welcome!', { padding: 1 }));

  const spinner = yoctoSpinner();
  spinner.start('Creating file...');

  await fs.writeFile('test.txt', 'Hello World');

  spinner.success('File created!');
}

main();
```

---

# 7. Best Practices

* Use async fs APIs
* Handle errors properly
* Use streams for large files
* Use spinners for UX
* Combine UI libs for better CLI

---

# 8. Exercises

1. Create CLI that generates files
2. Add ASCII title using figlet
3. Show progress using spinner
4. Display result in box

---

# 9. Conclusion

These tools enhance CLI UX and enable powerful backend utilities.

---

