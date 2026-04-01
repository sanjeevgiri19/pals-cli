# @clack/prompts — Complete Tutorial

## 1. Introduction

`@clack/prompts` is a modern, lightweight CLI prompt library for Node.js used to build interactive command-line applications. It is especially popular in backend tools, developer CLIs, scaffolding tools, and automation scripts.

It provides:

* Clean and minimal UI
* Interactive user inputs
* Type-safe and async-friendly API
* Better UX compared to older libraries like `inquirer`

---

## 2. Why Use @clack/prompts?

### Problems with traditional CLI tools:

* Verbose APIs
* Poor UX
* Hard to manage async flows

### Advantages of Clack:

* Simple and clean syntax
* Built-in cancellation handling
* Works well with async/await
* Beautiful terminal output
* Lightweight and fast

---

## 3. Installation

```bash
npm install @clack/prompts
```

---

## 4. Core Concepts

### 1. Prompts

Functions that collect input from users.

### 2. Cancellation

User can cancel using `Ctrl+C` or `Esc`.

### 3. Async Flow

All prompts return promises.

---

## 5. Available Prompt Methods

---

## 5.1 text()

### Description:

Used to take string input from the user.

### Example:

```js
import { text } from '@clack/prompts';

const name = await text({
  message: 'What is your name?'
});

console.log(name);
```

### Options:

* `message` → Question to display
* `placeholder` → Default hint
* `validate` → Validation function

### With Validation:

```js
const username = await text({
  message: 'Enter username',
  validate(value) {
    if (value.length < 3) return 'Too short';
  }
});
```

---

## 5.2 password()

### Description:

Hidden input for sensitive data.

### Example:

```js
import { password } from '@clack/prompts';

const pass = await password({
  message: 'Enter password'
});
```

---

## 5.3 confirm()

### Description:

Yes/No confirmation.

### Example:

```js
import { confirm } from '@clack/prompts';

const ok = await confirm({
  message: 'Do you want to continue?'
});
```

Returns:

* `true` or `false`

---

## 5.4 select()

### Description:

Choose one option from a list.

### Example:

```js
import { select } from '@clack/prompts';

const framework = await select({
  message: 'Choose a framework',
  options: [
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue' },
    { value: 'svelte', label: 'Svelte' }
  ]
});
```

---

## 5.5 multiselect()

### Description:

Select multiple options.

### Example:

```js
import { multiselect } from '@clack/prompts';

const tools = await multiselect({
  message: 'Select tools',
  options: [
    { value: 'docker', label: 'Docker' },
    { value: 'git', label: 'Git' },
    { value: 'node', label: 'Node.js' }
  ]
});
```

Returns array of values.

---

## 5.6 spinner()

### Description:

Used to show loading or progress.

### Example:

```js
import { spinner } from '@clack/prompts';

const s = spinner();

s.start('Installing dependencies...');

await new Promise(r => setTimeout(r, 2000));

s.stop('Done!');
```

---

## 5.7 note()

### Description:

Display informational messages.

```js
import { note } from '@clack/prompts';

note('Setup completed successfully', 'Success');
```

---

## 5.8 intro() and outro()

### Description:

Used to show start and end messages.

```js
import { intro, outro } from '@clack/prompts';

intro('Welcome to CLI tool');
outro('Goodbye!');
```

---

## 5.9 cancel() and isCancel()

### Description:

Handle user cancellation.

```js
import { isCancel, cancel, text } from '@clack/prompts';

const name = await text({ message: 'Enter name' });

if (isCancel(name)) {
  cancel('Operation cancelled');
  process.exit(0);
}
```

---

## 6. Full Example Program

### CLI App: Project Generator

```js
import {
  intro,
  outro,
  text,
  select,
  confirm,
  multiselect,
  spinner,
  note,
  isCancel,
  cancel
} from '@clack/prompts';

async function main() {
  intro('🚀 Project Setup CLI');

  const projectName = await text({ message: 'Project name?' });
  if (isCancel(projectName)) return cancel('Cancelled');

  const framework = await select({
    message: 'Select framework',
    options: [
      { value: 'node', label: 'Node.js' },
      { value: 'express', label: 'Express' },
      { value: 'nestjs', label: 'NestJS' }
    ]
  });

  if (isCancel(framework)) return cancel('Cancelled');

  const features = await multiselect({
    message: 'Select features',
    options: [
      { value: 'docker', label: 'Docker' },
      { value: 'eslint', label: 'ESLint' },
      { value: 'prettier', label: 'Prettier' }
    ]
  });

  const proceed = await confirm({ message: 'Continue?' });

  if (!proceed) return cancel('Aborted');

  const s = spinner();
  s.start('Creating project...');

  await new Promise(r => setTimeout(r, 2000));

  s.stop('Project created!');

  note(`Project: ${projectName}\nFramework: ${framework}\nFeatures: ${features}`, 'Summary');

  outro('Setup complete 🎉');
}

main();
```

---

## 7. Best Practices

* Always handle cancellation using `isCancel`
* Use async/await for clean flow
* Validate user input
* Use spinner for long tasks
* Keep prompts minimal

---

## 8. Conclusion

`@clack/prompts` is a powerful and modern solution for building interactive CLI tools. It is simple, clean, and highly effective for backend developers building developer tools.

---


