# Commander.js — Complete Tutorial

## 1. Introduction

`commander` is a popular Node.js library used to build command-line interfaces (CLI). It helps you parse arguments, define commands, handle options, and structure CLI applications in a clean and scalable way.

---

## 2. Why Use Commander?

### Problems without it:

* Manual parsing of `process.argv`
* Hard to scale CLI apps
* Messy command handling

### Benefits:

* Clean API
* Built-in help system
* Command & subcommand support
* Option parsing
* Validation & defaults

---

## 3. Installation

```bash
npm install commander
```

---

## 4. Basic Usage

```js
import { Command } from 'commander';

const program = new Command();

program
  .name('my-cli')
  .description('Example CLI')
  .version('1.0.0');

program.parse();
```

---

## 5. Core Methods & Functions

---

## 5.1 program.name()

### Description:

Sets CLI name.

```js
program.name('my-app');
```

---

## 5.2 program.description()

Sets description.

```js
program.description('My CLI tool');
```

---

## 5.3 program.version()

Adds version flag (`-V` or `--version`).

```js
program.version('1.0.0');
```

---

## 5.4 program.command()

### Description:

Defines a new command.

```js
program
  .command('start')
  .description('Start app')
  .action(() => {
    console.log('Starting...');
  });
```

---

## 5.5 command.arguments()

Define positional arguments.

```js
program
  .command('greet <name>')
  .action((name) => {
    console.log(`Hello ${name}`);
  });
```

---

## 5.6 command.option()

### Description:

Adds option (flags).

```js
program
  .option('-d, --debug', 'Enable debug');
```

With default:

```js
.option('-p, --port <number>', 'Port', 3000)
```

---

## 5.7 command.requiredOption()

### Description:

Mandatory option.

```js
program.requiredOption('-u, --user <name>', 'Username required');
```

---

## 5.8 program.parse()

Parses CLI input.

```js
program.parse(process.argv);
```

---

## 5.9 program.opts()

Get parsed options.

```js
const options = program.opts();
```

---

## 5.10 program.args

Access raw arguments.

```js
console.log(program.args);
```

---

## 5.11 command.action()

### Description:

Callback executed when command runs.

```js
.command('build')
.action(() => console.log('Building'))
```

---

## 5.12 command.alias()

Shortcut name.

```js
.command('serve')
.alias('s')
```

---

## 5.13 command.helpOption()

Custom help flag.

```js
program.helpOption('-h, --help', 'Display help');
```

---

## 5.14 program.help()

Display help manually.

```js
program.help();
```

---

## 5.15 program.addHelpText()

Add custom help text.

```js
program.addHelpText('after', '\nExample usage: my-cli start');
```

---

## 5.16 command.option parsing (custom)

```js
program.option('-n, --number <n>', 'Number', parseInt);
```

---

## 5.17 program.configureOutput()

Customize output behavior.

```js
program.configureOutput({
  writeOut: str => console.log(str),
});
```

---

## 5.18 program.exitOverride()

Prevent process exit.

```js
program.exitOverride();
```

---

## 5.19 program.allowUnknownOption()

Allow unknown flags.

```js
program.allowUnknownOption(true);
```

---

## 5.20 program.enablePositionalOptions()

Enable positional options.

```js
program.enablePositionalOptions();
```

---

## 5.21 program.passThroughOptions()

Pass options to subcommands.

```js
program.passThroughOptions();
```

---

## 5.22 program.hook()

Lifecycle hooks.

```js
program.hook('preAction', () => {
  console.log('Before command');
});
```

---

## 5.23 program.parseAsync()

Async parsing.

```js
await program.parseAsync();
```

---

## 5.24 command.addCommand()

Add subcommand.

```js
const sub = new Command('sub');
program.addCommand(sub);
```

---

## 5.25 command.description()

Set command description.

---

## 5.26 command.usage()

Custom usage text.

```js
.command('run')
.usage('[options] <file>')
```

---

## 5.27 command.example (via addHelpText)

```js
program.addHelpText('after', '\nExample:\n  $ my-cli run app.js');
```

---

## 6. Full Example Program

```js
import { Command } from 'commander';

const program = new Command();

program
  .name('dev-tool')
  .description('Developer CLI')
  .version('1.0.0');

program
  .command('create <project>')
  .description('Create project')
  .option('-t, --template <type>', 'Template type', 'node')
  .option('-f, --force', 'Overwrite')
  .action((project, options) => {
    console.log('Project:', project);
    console.log('Template:', options.template);
    console.log('Force:', options.force);
  });

program
  .command('deploy')
  .description('Deploy project')
  .requiredOption('-e, --env <env>', 'Environment')
  .action((options) => {
    console.log('Deploying to', options.env);
  });

program
  .hook('preAction', () => {
    console.log('Running command...');
  });

program.parse();
```

---

## 7. Best Practices

* Use subcommands for scalability
* Always validate input
* Use defaults for options
* Add help text for better UX
* Use async parsing for API calls

---

## 8. Exercises

1. Build a git-like CLI
2. Create login CLI with options
3. Build deploy CLI with environments
4. Add validation to options

---

## 9. Conclusion

Commander.js is a powerful and flexible CLI framework that simplifies command-line tool development and scales well for complex backend tools.

---
