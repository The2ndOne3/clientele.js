# clientele.js
Template engine consolidation library, for the client. Works as Express/Connect middleware.

Codebase greatly inspired by [Consolidate.js](//github.com/visionmedia/consolidate.js).

## Installation
Clientele is still under development.

## Usage
Clientele is built as an Express/Connect middleware. To serve pre-compiled client-side templates of any engine, simply embed the endpoint (default: `/js/templates.js`) into the page and add `clt.engine()` to the stack of any Express-like app to access pre-compiled client-side views (default: `public/templates`).

## Supported Engines
<!-- * Jade -->

## Example
app.js:

```js
var clt = require('clientele')
  , express = require('express');

var app = express();

// ...
app.use(clt.jade()); 
// ...

```

public/templates/example.jade:

```jade
doctype html
html
  head
    title Example client-side template.
  body
    p Hello!
```

public/views/index.jade:

```jade
doctype html
html
  head
    title Example website.
    script(src='/js/templates.js')
    script.
      jade.render('example', callback); // Render the template asynchronously.
      jade.renderSync('example', callback); // Render the template synchronously.
  body
    p Hello from the server!
```
