# clientele.js

[![Build Status](https://travis-ci.org/The2ndOne3/clientele.js.png?branch=master)](https://travis-ci.org/The2ndOne3/clientele.js)

Template engine consolidation library, for the client. Works as Express/Connect middleware.

Clientele greatly inspired by [Consolidate.js](//github.com/visionmedia/consolidate.js), [jade-browser](//github.com/storify/jade-browser), [Blade](//github.com/bminer/node-blade), and [Dust](//github.com/akdubya/dustjs).

## Installation
Clientele is still under development.

## Usage
Clientele is built as an Express/Connect middleware. To serve pre-compiled client-side templates of any engine, simply embed the endpoint (default: `/js/templates.js`) into the page and add `clientele.engine()` to the stack of any Express-like app to access pre-compiled client-side views (default: `public/templates/**`).

All engines use the following signature: `clientele.engine(templates, endpoint, options);`

### Params
* `templates` A pattern to glob for templates (default: `public/templates/**`)
* `endpoint` The filename of the resulting compiled templates (default: `/js/templates.js`)
* `options` Options object, see below (optional)

#### Options
* `namespace` Namespace for the browser (default: engine name)
* `minify` Minifies the output (default: false)
* `noCache` Do not cache compiled templates (default: false)

```js
var clt = require('clientele');

//...
app.use(clt.engine('public/templates/**', '/js/templates.js', {
  namespace: 'engine-name',
  minify: false,
  noCache: false
}));
//...
```

### Browser Usage
On the client, loading the script at the endpoint will load the engine runtime at `window.namespace`, which defaults to `window.engine`. For example, a Jade engine will default to a Jade runtime at `window.jade`. From there, you can call either `window.jade.render(template, locals, callback)` or `window.jade.renderSync(template, locals)`.

Templates are specified by filename relative to the template directory. Including the extension is not necessary.

```js
// Asynchronous rendering.
jade.render('example', {title: 'yes'}, function(err, result){
  if(err){
    return console.error('Something went wrong!');
  }
  doSomething(result);
});

// Synchronous rendering.
result = jade.renderSync('example', {title: 'yes'});
```

By default, Clientele will cache loaded templates on the client. To force a reload, call `engine.reload(template)`.

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
