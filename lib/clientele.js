'use strict';

// Module dependencies.
var fs = require('fs')
  , path = require('path');

// Cached, compiled templates.
// 'filename': {
//   updated: timestamp,
//   template: compiled_template
// }
// Cache invalidates when file's last modified date is after updated timestamp.
var cache = {};

// Wrap inner module behaviour with option selection.
var wrap = function(engine_generators){
  return function(templates_location, endpoint_location, opts){
    // Set options.
    var templates = templates_location || path.join(__dirname, '..', '..', 'public', 'templates', '**')
      , endpoint = endpoint_location || '/js/templates.js'
      , options = opts || {}
      , namespace = options.namespace || null
      , minify = options.minify || false
      , noCache = options.noCache || false;

    // Construct engines.
    // engines.compiler(str) compiles a string into a template.
    // engines.renderer(tpl, locals) renders a template.
    var engines = engine_generators();

    // Construct middleware.
    return function(req, res, next){
      if(req.url == endpoint){
        return res.send('(' + engines.renderer.toString() + ')();');
      }
      if(fs.exists(req.url)){
        ;
      }
      next();
    };
  };
};

module.exports = {
  jade: wrap(function(){
    return {
      compiler: function(){},
      renderer: function(){window.jade = 'mock'}
    };
  })
};
