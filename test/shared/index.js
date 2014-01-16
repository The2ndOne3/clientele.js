'use strict';

var request = require('supertest')
  , express = require('express')

  , should = require('chai').should()

  , clientele = require('../../index');

exports.test = function(name){
  var data = require('../fixtures/data');

  describe(name, function(){
    var app, server;

    before(function(done){
      app = express();
      app.use(clientele[name]());
      app.use(app.router);

      app.get('/connection-test', function(req, res){
        res.send(200, {
          succeeded: true
        });
      });

      var port = 3003;

      server = require('http').createServer(app);
      server.listen(port, function(){
        request = request('http://localhost:' + port);
        done();
      });
    });

    it('connects to the testing server', function(done){
      should.exist(app);
      request
        .get('/connection-test')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res){
          if(err || !res.body.succeeded){
            throw err;
          }
          done();
        });
    });
  });
};
