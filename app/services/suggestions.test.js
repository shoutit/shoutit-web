/* eslint prefer-arrow-callback: 0 */

import { expect } from 'chai';
import { Request } from 'superagent';
import sinon from 'sinon';

import suggestions from './suggestions';

describe('services/suggestions', () => {

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

    it('should send a API request to the right endpoint', done => {
      sinon.stub(Request.prototype, 'end', function callback() {
        expect(this.url).to.contain('/misc/suggestions');
        done();
      });
      suggestions.read({}, resource, params, config, serviceCallback);
    });

    it('should send a request to the given endpoint', done => {
      sinon.stub(Request.prototype, 'end', function callback() {
        expect(this.url).to.contain('my/foo/api');
        done();
      });
      suggestions.read({}, resource, { endpoint: 'my/foo/api' }, config, serviceCallback);
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
      suggestions.read({}, resource, params, config, callback);
    });

    it('should pass the session\'s access token', done => {
      sinon.stub(Request.prototype, 'end', function callback() {
        expect(this.header).to.have.property('Authorization', 'Bearer foo');
        done();
      });
      suggestions.read({ session: { accessToken: 'foo' } }, resource, params, config, serviceCallback);
    });


    it('should pass the type from params', done => {
      sinon.stub(Request.prototype, 'end', function callback() {
        expect(this.qs).to.eql({ type: 'a-type' });
        done();
      });
      suggestions.read({}, resource, { type: 'a-type' }, config, serviceCallback);
    });

    it('should pass the country from params', done => {
      sinon.stub(Request.prototype, 'end', function callback() {
        expect(this.qs).to.eql({ country: 'it' });
        done();
      });
      suggestions.read({}, resource, { location: { country: 'it', state: 'lazio' } }, config, serviceCallback);
    });

  });


});
