/* eslint prefer-arrow-callback: 0 */

import { expect } from 'chai';
import { Request } from 'superagent';
import sinon from 'sinon';

import discover from './discover';

describe('services/discover', () => {

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

    it('should send a API request to the right API endpoint', done => {
      sinon.stub(Request.prototype, 'end', function callback() {
        expect(this.url).to.contain('/discover');
        done();
      });
      discover.read({}, resource, params, config, serviceCallback);
    });

    it('should send a API request to the resource API endpoint', done => {
      sinon.stub(Request.prototype, 'end', function callback() {
        expect(this.url).to.contain('/discover/foo');
        done();
      });
      discover.read({}, resource, { id: 'foo' }, config, serviceCallback);
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
      discover.read({}, resource, params, config, callback);
    });

    it('should pass the session\'s access token', done => {
      sinon.stub(Request.prototype, 'end', function callback() {
        expect(this.header).to.have.property('Authorization', 'Bearer foo');
        done();
      });
      discover.read({ session: { accessToken: 'foo' } }, resource, params, config, serviceCallback);
    });

    it('should pass the search params', done => {
      sinon.stub(Request.prototype, 'end', function callback() {
        expect(this.qs).to.eql({ search: 'foo' });
        done();
      });
      discover.read({}, resource, { searchParams: { search: 'foo' } }, config, serviceCallback);
    });

    it('should augment the search params with the request\'s geolocation', done => {
      sinon.stub(Request.prototype, 'end', function callback() {
        expect(this.qs).to.eql({ country: 'it', state: 'lazio', city: 'rome', search: 'foo' });
        done();
      });
      discover.read(
        { geolocation: { country: 'it', state: 'lazio', city: 'rome', slug: 'a-slug', name: 'A name' } },
        resource,
        { searchParams: { search: 'foo' } },
        config,
        serviceCallback);
    });

  });


});
