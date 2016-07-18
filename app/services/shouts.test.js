/* eslint prefer-arrow-callback: 0 */

import { expect } from 'chai';
import { Request } from 'superagent';
import sinon from 'sinon';

import shouts from './shouts';

describe('services/shouts', () => {

  afterEach(() => {
    if (Request.prototype.end.restore) {
      Request.prototype.end.restore();
    }
  });

  describe('read method', () => {

    const resource = undefined;
    const params = {};
    const config = undefined;
    const serviceCallback = () => {};

    it('should send a API request to /shouts', done => {
      sinon.stub(Request.prototype, 'end', function callback() {
        expect(this.url).to.contain('/shouts');
        done();
      });
      shouts.read({}, resource, params, config, serviceCallback);
    });

    it('should send a request to the given endpoint', done => {
      sinon.stub(Request.prototype, 'end', function callback() {
        expect(this.url).to.contain('my/foo/api');
        done();
      });
      shouts.read({}, resource, { endpoint: 'my/foo/api' }, config, serviceCallback);
    });

    it('should parse API errors', done => {
      sinon.stub(Request.prototype, 'end', callback => {
        const apiError = {
          response: {
            body: {
              error: {
                errors: [],
              },
            },
          },
        };
        callback(apiError);
      });

      const callback = err => {
        expect(err).to.have.property('output');
        expect(err.output).to.have.property('errors');
        done();
      };
      shouts.read({}, resource, params, config, callback);
    });

    it('should pass the session\'s access token', done => {
      sinon.stub(Request.prototype, 'end', function callback() {
        expect(this.header).to.have.property('Authorization', 'Bearer foo');
        done();
      });
      shouts.read({ session: { accessToken: 'foo' } }, resource, params, config, serviceCallback);
    });

    it('should pass the search params', done => {
      sinon.stub(Request.prototype, 'end', function callback() {
        expect(this.qs).to.eql({ search: 'foo' });
        done();
      });
      shouts.read({}, resource, { search: 'foo' }, config, serviceCallback);
    });

    it('should spread filters to querystring', done => {
      sinon.stub(Request.prototype, 'end', function callback() {
        expect(this.qs).to.eql({ search: 'foo', foo: 'abc,pqr', bar: 'xyz' });
        done();
      });
      shouts.read({}, resource, { search: 'foo', filters: {
        foo: ['abc', 'pqr'],
        bar: ['xyz'],
      } }, config, serviceCallback);
    });

    it('should not pass the search params when an endpoint is used', done => {
      sinon.stub(Request.prototype, 'end', function callback() {
        expect(this.qs).to.eql({});
        done();
      });
      shouts.read({}, resource, { search: 'foo', endpoint: 'foo' }, config, serviceCallback);
    });
  });


});
