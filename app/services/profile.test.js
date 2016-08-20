/* eslint-env mocha, browser */
/* eslint-disable no-underscore-dangle */
import { expect } from 'chai';
import sinon from 'sinon';
import { Request } from 'superagent';

import service from './profile';
import { shoutit_signup } from '../constants/grantTypes';

describe('services/profile', () => {

  let callback;
  let req;
  let resource;
  let params;
  let body;
  let config;

  beforeEach(() => {
    callback = sinon.spy();
    req = { session: { cookie: {} } };
    config = {};
    resource = '';
    params = {};
    body = {
      firstName: 'foo',
      lastName: 'bar',
    };
  });

  afterEach(() => {
    if (Request.prototype.end.restore) {
      Request.prototype.end.restore();
    }
  });

  it('should have the right name', () => {
    expect(service.name).to.equal('profile');
  });

  describe('create method', () => {
    it('should throw an error if firstName is not set', () => {
      service.create(req, resource, params, {}, config, callback);
      expect(callback.args[0][0].errors[0]).to.have.property('location', 'first_name');
    });

    it('should throw an error if lastName is not sent', () => {
      service.create(req, resource, params, { firstName: 'foo' }, config, callback);
      expect(callback.args[0][0].errors[0]).to.have.property('location', 'last_name');
    });

    it('should send an API request to the right API endpoint', done => {
      sinon.stub(Request.prototype, 'end', function callback() {
        expect(this.method).to.equal('POST');
        expect(this.url).to.contain('/oauth2/access_token');
        done();
      });
      service.create(req, resource, params, body, config, callback);
    });

    it('should create the name from firstName and lastName', done => {
      sinon.stub(Request.prototype, 'end', function callback() {
        expect(this._data).to.have.property('name', 'foo bar');
        done();
      });
      service.create(req, resource, params, body, config, callback);
    });

    it('should pass only latitude and longitude from location', done => {
      body = {
        ...body,
        location: {
          latitude: 'foo',
          longitude: 'bar',
          city: 'a city',
          state: 'a state',
          country: 'a country',
        },
      };
      sinon.stub(Request.prototype, 'end', function callback() {
        expect(this._data.profile.location).to.have.property('latitude', 'foo');
        expect(this._data.profile.location).to.have.property('longitude', 'bar');
        expect(this._data.profile.location).to.not.have.property('city');
        expect(this._data.profile.location).to.not.have.property('state');
        expect(this._data.profile.location).to.not.have.property('country');
        done();
      });
      service.create(req, resource, params, body, config, callback);
    });

    it('should send the right data to the request', done => {
      body = {
        ...body,
        email: 'foo@example.com',
        password: '123456',
      };
      sinon.stub(Request.prototype, 'end', function callback() {
        expect(this._data).to.have.property('client_id');
        expect(this._data).to.have.property('client_secret');
        expect(this._data).to.have.property('grant_type', shoutit_signup);
        expect(this._data).to.have.property('password', '123456');
        expect(this._data).to.have.property('mixpanel_distinct_id');
        expect(this._data).to.have.property('email', 'foo@example.com');
        done();
      });
      service.create(req, resource, params, body, config, callback);
    });

    it('should not pass a profile object if location does not have latitude/longitude', done => {
      body = {
        ...body,
        location: {
          city: 'a city',
        },
      };
      sinon.stub(Request.prototype, 'end', function callback() {
        expect(this._data.profile.location).to.be.empty;
        done();
      });
      service.create(req, resource, params, body, config, callback);
    });

    it('should set the request session on success', () => {
      sinon.stub(Request.prototype, 'end', cb => {
        cb(null, { body: { profile: { foo_bar: 'bar' } } });
        expect(callback).to.have.been.calledWith(null, { fooBar: 'bar' });
      });
      service.create(req, resource, params, body, config, callback);
    });

  });

  describe('read method', () => {

    it('should send an API request to the right API endpoint', done => {
      params = { username: 'foo' };
      sinon.stub(Request.prototype, 'end', function callback() {
        expect(this.method).to.equal('GET');
        expect(this.url).to.contain('/profiles/foo');
        done();
      });
      service.read(req, resource, params, config, callback);
    });

    it('should call the callback with the response body as profile', () => {
      sinon.stub(Request.prototype, 'end', cb => {
        cb(null, { body: { username: 'foo' } });
        expect(callback).to.have.been.calledWith(null, { username: 'foo' });
      });
      service.read(req, resource, params, config, callback);
    });

  });

  describe('update method', () => {

    it('should send an API request to the right API endpoint', done => {
      sinon.stub(Request.prototype, 'end', function callback() {
        expect(this.method).to.equal('PATCH');
        expect(this.url).to.contain('/profiles/me');
        done();
      });
      service.update(req, resource, params, body, config, callback);
    });

    it('should pass the body to the request', done => {
      body = {
        foo: 'bar',
      };
      sinon.stub(Request.prototype, 'end', function callback() {
        expect(this._data).to.have.property('foo', 'bar');
        done();
      });
      service.update(req, resource, params, body, config, callback);
    });

    it('should remove unused location properties', done => {
      body = {
        foo: 'bar',
        location: {
          city: 'a city',
          state: 'a state',
          latitude: 'lat',
          longitude: 'lng',
          country: 'a country',
        },
      };
      sinon.stub(Request.prototype, 'end', function callback() {
        expect(this._data.location).to.not.have.property('city');
        expect(this._data.location).to.not.have.property('country');
        expect(this._data.location).to.not.have.property('state');
        expect(this._data.location).to.have.property('latitude', 'lat');
        expect(this._data.location).to.have.property('longitude', 'lng');
        done();
      });
      service.update(req, resource, params, body, config, callback);
    });

    it('should call the callback with the response body as profile', () => {
      sinon.stub(Request.prototype, 'end', cb => {
        cb(null, { body: { username: 'foo' } });
        expect(callback).to.have.been.calledWith(null, { username: 'foo' });
      });
      service.update(req, resource, params, body, config, callback);
    });

  });

});
