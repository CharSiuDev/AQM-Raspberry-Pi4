const assert = require('assert');
const { app } = require('../website/server.js');
const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');

describe('GET /sensor-data-tables', () => {
  it('responds with JSON array of sensor data tables', (done) => {
    request(app)
      .get('/sensor-data-tables')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        const sensorDataTables = res.body;
        expect(sensorDataTables).to.be.an('array');
        done();
      });
  });
});

  
describe('GET /', () => {
    it('responds with HTML when user is logged in as admin', (done) => {
      request(app)
        .get('/')
        .set('Cookie', 'username=admin; isAdmin=true')
        .expect('Content-Type', /html/)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          //TODO Add assertions
          done();
        });
    });
  
    it('responds with HTML when user is logged in as non-admin', (done) => {
      request(app)
        .get('/')
        .set('Cookie', 'username=user; isAdmin=false')
        .expect('Content-Type', /html/)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          //TODO Add assertions
          done();
        });
    });
  
    it('responds with HTML when user is not logged in', (done) => {
      request(app)
        .get('/')
        .expect('Content-Type', /html/)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          //TODO Add assertions
          done();
        });
    });
  });

  describe('GET /data', () => {
    it('responds with data when user is logged in as admin', (done) => {
      request(app)
        .get('/data')
        .query({tableName: 'sensor_data_1'})
        .set('Cookie', 'username=admin; isAdmin=true')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          //TODO Add assertions
          done();
        });
    });
  
    it('responds with data when user is logged in as non-admin', (done) => {
      request(app)
        .get('/data')
        .query({tableName: 'sensor_data_1'})
        .set('Cookie', 'username=user; isAdmin=false')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          //TODO Add assertions
          done();
        });
    });
  });

describe('GET /logout', function() {
    it('should redirect to home page', function(done) {
      request(app)
        .get('/logout')
        .expect('Location', '/')
        .expect(302, done);
    });
});
