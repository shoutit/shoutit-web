/* eslint prefer-arrow-callback: 0 */

import { expect } from 'chai';
import { Request } from 'superagent';
import sinon from 'sinon';

import service from './currencies';
import { clearCache, setCache, getCache } from './createService';

describe('services/currencies', () => {

  afterEach(() => {
    clearCache('currencies');
    if (Request.prototype.end.restore) {
      Request.prototype.end.restore();
    }
  });

  it('should have the right name', () => {
    expect(service.name).to.equal('currencies');
  });

  describe('read method', () => {
    const resource = undefined;
    const params = {};
    const config = undefined;
    const serviceCallback = () => {};
    const body = { foo: 'bar' };
    it('should send a API request to the right API endpoint', done => {
      sinon.stub(Request.prototype, 'end', function callback() {
        expect(this.url).to.contain('/misc/currencies');
        done();
      });
      service.read({}, resource, params, config, serviceCallback);
    });
    it('should pass the Accept-Language header', done => {
      sinon.stub(Request.prototype, 'end', function callback() {
        expect(this.header).to.have.property('Accept-Language', 'it');
        done();
      });
      service.read({ locale: 'it' }, resource, params, config, serviceCallback);
    });
    it('should set the cache on response', done => {
      sinon.stub(Request.prototype, 'end', callback => {
        const response = { body };
        callback(null, response);
      });
      const callback = () => {
        expect(getCache('currencies')).to.eql(body);
        done();
      };
      service.read({}, resource, params, config, callback);
    });
    it('should use the cache if available', done => {
      const cached = body;
      setCache('currencies', cached);
      const callback = (err, body) => {
        expect(body).to.eql(cached);
        done();
      };
      service.read({}, resource, params, config, callback);
    });
  });

});