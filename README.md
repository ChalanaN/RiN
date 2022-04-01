<!-- omit in toc -->
# RiN Compiler 🌺✨

<img src="./assets/logo.png" alt="RiN" width="250px">

Compiler for parsing custom HTML 🤖

- [Installation](#installation)
- [Features](#features)
- [Usage](#usage)
  - [Basic compilation](#basic-compilation)
  - [Advanced compiling](#advanced-compiling)
- [Tags](#tags)
- [Widgets](#widgets)
  - [App Widgets](#app-widgets)
  - [Functional Widgets](#functional-widgets)
  - [Files Widget](#files-widget)
- [Components](#components)

## Installation

```bash
npm i rin-compiler
```

## Features

- Simple and easy to use
- Use tags inside comments (HTML/CSS/JS)
- Components
- Custom Widgets
- Functional Widgets to run custom JavaScript when compiling

## Usage

### Basic compilation

This will automatically compile the files and write it to the disk.

```js
import RiN from "rin-compiler"

// This will compile all the files in the "src" directory and output the files for the "dist" directory
RiN(path.resolve(__dirname, "src"), "default", "all", {
    outFolder: path.resolve(__dirname, "dist")
});
```

### Advanced compiling

For advanced compiling with more possibilities, consider using the `Compiler` interface.

```ts
import { readFile } from "node:fs"
import { resolve } from "node:path"
import { Compiler, CompiledPageInfo } from "rin-compiler"

let srcDir: string = resolve(__dirname, "src"),
    appView: string = "./views/App.html",
    options = {
        title: "My App",
        minify: true,
        CacheMaxAge: 30000,
        appWidgets: {
            /* Anything defined in appWidgets can be accessed in HTML via <App.[widget-name]/> widgets.
            As example, this can be accessed via <App.CommonName/> widget. */
            CommonName: "My App"
        },
        functionalWidgets: {
            /* Anything defined in functionalWidgets can be executed in HTML like
                <App.[functional-widget-name]>value<App.[functional-widget-name]/>
            You can access the value via the first parameter of the function you provide. The returned value will be rendered */
            Capitalize: (value: string, App: CompiledPageInfo) => value[0].toUpperCase() + value.slice(1, value.length)
        }
    }

const compiler = new Compiler(srcDir, appView, options)

let renderedPage: CompiledPageInfo = await compiler.compile((await readFile(resolve(__dirname, "src/index.html"))).toString())
```

## Tags

| Tag                               | Description                                 |
| --------------------------------- | ------------------------------------------- |
| `<App.[widget-name]/>`            | Access [App Widgets](#app-widgets) (*⭐📃🔄*) |
| `<App.[functional-widget-name]/>` | Execute [Functional Widgets.](#functional-widgets) (*⭐📃🔄*) |
| `<Page.[widget-name]/>`            | Define [App Widgets](#app-widgets) (*📃*) |
| `<File:[path-to-the-file]/>` | Embed the text content of a file using [Files Widget](#files-widget) (*⭐📃🔄*) |
| `<[component-name]/>` | [Components](#components) (*⭐📃*) |
| `<[component-name].[attribute-name]/>` | Get the attributes passed to the Component (*🔄*) |

*⭐ Can be used in app view*\
*📃 Can be used in pages*\
*🔄 Can be used in components*

> **⚠ ATTENTION ⚠**\
> **All these tags must be used inside comments.**

## Widgets

### App Widgets

App Widgets are like a variable, you can define them in pages and access them anywhere in HTML.

There are some App Widgets available by default:

| Widget                   | Description                                                                                       |
|--------------------------|---------------------------------------------------------------------------------------------------|
| `<App.Page/>`            | HTML Content of the page. This should be rendered inside the app view in order to be a full page. |
| `<App.Title/>`           | Title of the page                                                                                 |
| `<App.Imports.cssTags/>` | HTML Tags to import the CSS files (`<link>` tags)                                                 |
| `<App.Imports.jsTags/>`  | HTML Tags to import the JS files (`<script>` tags)                                                |

App widgets are always definable.

- To define a app widget, use the `<Page.[widget-name]>` tag inside a page (This tag only works inside a page).
- To access a app widget, use the `<App.[widget-name]/>` tag inside the app view.

Example:

*index.html*

```html
<!-- ✨ Using this tag, we can define a custom widget. In this example we are defining the custom widget PageID, to a value of "home". This can be later accessed in the app view ✨ -->
<!-- <Page.PageID>home<Page.PageID/> -->
```

*views/App.html*

```html
<!-- ✨ Using this tag, we can access the custom widget defined in the index.html ✨ -->
<!-- ✨ This will be replaced to "home" ✨ -->
<!-- <App.PageID/> -->
```

It's also possible to define app widgets by the options passed to the RiN Compiler. But the problem with this is that widgets defined in the compiler options are same for all pages.

Example:

```js
let options = {
    appWidgets: {
        PageID: "home"
    }
}

RiN(srcDir, appView, files, options);
```

### Functional Widgets

Functional Widgets are used to run JavaScript when compiling to get a different output. These can be used anywhere in HTML.

There are some Functional Widgets available by default:

| Functional Widget | Description |
|-|-|
| `<App.Run>` | Evaluate JavaScript when compiling |

Functional Widgets are always definable.

- To define a functional widget, pass a function `(value: string, App: RiN.CompiledPageInfo) => string` in the compiler options.
- To execute a functional widget, use the `<App.[functional-widget-name]>` tag anywhere in the HTML.

Example:

```js
let options = {
    functionalWidgets: {
        /**
         * Capitalize a sentence
         * @param {string} value String inside the functional widget tags.
         * @param {CompiledPageInfo} App Information about the compiling page
         * @example <App.Capitalize>this is the value</App.Capitalize>
         */
        Capitalize: (value, App) => value[0].toUpperCase() + value.slice(1, value.length)
    }
}

RiN(srcDir, appView, files, options);
```

*index.html*

```html
<!-- ✨ This would be replaced as "This is the value" since our Capitalize functional widget capitalizes the sentence ✨ -->
<!-- <App.Capitalize>this is the value</App.Capitalize> -->
```

### Files Widget

Files Widget is used to embed a file containing text into a HTML file. This widget can be used anywhere in HTML. This tag is replaced by the text of the file.

Use `<File:[path-to-the-file]/>` tag for this widget. Note that the path is relative to the `srcDir` passed to the compiler.

Example:

```html
<!-- ✨ These type of widgets are important because loading external css files are much slower than internal css. ✨ -->
<style>/* <File:./css/main.css/> */</style>
```

## Components

Components are reusable bits of HTML code.

- To define a component,
  - Create a directory named `components` in the source directory.
  - Create a HTML file and provide a name for it. The filename is the name of the component.
- To use a component, use the `<[component-name]/>` tag anywhere in the HTML. It's also possible to pass attributes to the component and access them in the component file via the `<Component.[attribute]/>` tag.

Example:

*components/Popup.html*

```html
<!-- You can also define styles for the component in this file with the <style> tag as usual -->

<div class="popup">
    <!-- ✨ Access the attributes passed to the component ✨ -->
    <h1><!-- <Component.heading/> --></h1>
    <p><!-- <Component.description/> --></p>

    <!-- ✨ Component.Run is a functional widget which is only available inside component files. It gives the information of the component via the Component object. ✨ -->
    <!-- <Component.Run>Component.buttons?.split(",")?.map(text=>`<button>${text.trim()}</button>`).join("")</Component.Run> -->
</div>
```

*index.html*

```html
<!-- ✨ Since we named that file as Popup.html, we can call it like this. ✨ -->
<!-- <Popup heading="Hello" description="RiN by RahalDevs" buttons="CLOSE, OK"/> -->
```
