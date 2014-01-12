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

// Module options.
var templates = path.join(__dirname, '..', '..', 'public', 'templates', '**')
  , endpoint = '/js/templates.js'
  , namespace = null
  , minify = false
  , caching = true;

// Mount client-side renderer in Express stack.
var mount_renderer = function(renderer){
  return function(req, res, next){
    ;
  };
};

// Mount compiled view access.
var mount_compiled_views = function(compiler){
  return function(req, res, next){
    ;
  };
};

// Wrap inner module behaviour with option selection.
var module_wrapper = function(inner){
  return function(templates_location, endpoint_location, options){
    templates = templates_location !== undefined? templates_location : templates;
    endpoint = endpoint_location !== undefined? endpoint_location : endpoint;
    if(options !== undefined){
      namespace = options.namespace !== undefined? options.namespace : namespace;
      minify = options.minify !== undefined? options.minify : minify;
      caching = options.caching !== undefined? options.caching : caching;
    }

    var engines = inner();

    return function(req, res, next){
      mount_renderer(engines.renderer)(req, res, next);
      mount_compiled_views(engines.compiler)(req, res, next);
    };
  };
};

module.exports = {
  jade: module_wrapper(function(){
    ;
  })
};