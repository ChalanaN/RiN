# RiN Compiler
Compiler for parsing custom HTML 🤖

> ⚠ *Please note that this package is in it's early ages of development and this is a preview version*

## Installation

```bash
npm i rin-compiler
```

## Features

* Simple and easy to use
* Use tags inside comments (HTML/CSS/JS)
* Embed JavaStript inside HTML files using `App.Run` tags
* Embed any file inside HTML code with `<File:[file]/>` tag

## Usage

### Inside the code

```js
import RiN from "rin-compiler"

// This will compile all the files in the "src" directory
RiN(path.resolve(__dirname, "src"), "default", "all", {
    outFolder: path.resolve(__dirname, "dist")
});
```

### Advanced compiling

For advanced compiling with more possibilities, consider using the `Compiler` interface.

```js
import { Compiler } from "rin-compiler"

const compiler = new Compiler(appView, options)

compiler.compile(path.resolve(__dirname, "src/index.html"))
```