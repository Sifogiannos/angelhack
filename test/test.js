var request = require('supertest');
var should  = require("should");
var express = require('express');

var app = require('../app.js');

/*
  GET / (Not Authorized)
*/
describe('GET', function(){
  it('/ (Not Authorized)', function(done){
    request(app)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(200)
      .end(done);
  });
});
/*
  GET /login
*/
describe('GET', function(){
  var data = {
    username : "sifogiannos",
    password : "123456"
  };
  it('/login', function(done){
    request(app)
      .get('/login')
      .send(data)
      .expect('Content-Type', /html/)
      .expect(200)
      .end(done);
  });
});
/*
  POST /login
  with invalid data
*/
describe('POST', function(){

  it('/login (invalid data)', function(done){
    request(app)
      .post('/login')
      .send({
        username : 'sifogiannosssdasdsad',
        password : '123456'
      })
      .expect('Location', '/login')
      .end(function(err, res){
        if(res.text.indexOf('login') > -1){
          done();
        }else{
          err = new Error('Not Found');
          err.message = "Should have returned error";
          done(err);
        }
      });
  });
});
/*
  POST /login
  with valid data
*/
describe('POST', function(){
  it('/login (valid data)', function(done){
    request(app)
      .post('/login')
      .send({
        username : 'sifogiannos',
        password : '123456'
      })
      .expect('Location', '/')
      .end(function(err, res){
        console.log();
        if( res.text.indexOf('/') == res.text.length-1){
          done();
        }else{
          err = new Error('Not Found');
          err.message = "Should have returned error";
          done(err);
        }
      });
  });
});