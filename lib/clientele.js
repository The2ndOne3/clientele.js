'use strict';

// Module dependencies.
var fs = require('fs')
  , path = require('path')
  , shortid = require('shortid');

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
      , noCache = options.noCache || false
      , views = shortid.generate();

    // Construct engines.
    // engines.compiler(str, callback) compiles a string into a template.
    // engines.renderer(tpl, locals, callback) renders a template.
    var engines = engine_generators(views, options);

    // Construct middleware.
    return function(req, res, next){
      if(req.url == endpoint){
        return res.send('(' + engines.renderer.toString() + ')();');
      }

      if(req.url.split(path.sep)[0] == views){
        var filename = path.join(templates, req.url.substring(req.url.indexOf('/') + 1));

        if(fs.exists(filename)){
          var recompile = function(compiler, callback){
            fs.readFile(filename, {encoding: 'utf8'}, function(err1, template){
              compiler(template, function(err2, compiled){
                cache[filename] = {
                  updated: new Date(),
                  template: compiled
                };
                callback(err1 || err2 || null, compiled);
              });
            });
          };

          if(noCache || !cache[filename]){
            recompile(engines.compiler, function(err, compiled){
              return res.send(compiled.toString());
            });
          }
          else{
            fs.stat(filename, function(err, stats){
              if(cache[filename].updated < new Date(stats.mtime)){
                recompile(engines.compiler, function(err, compiled){
                  return res.send(compiled.toString());
                });
              }
            });
          }
          console.log('view detected');
        }
      }

      next();
    };
  };
};

module.exports = {
  jade: wrap(function(){
    return {
      compiler: function(){},
      renderer: function(){window.jade = 'mock';}
    };
  })
};
