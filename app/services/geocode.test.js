/* eslint prefer-arrow-callback: 0 */

import { expect } from 'chai';
import { Request } from 'superagent';
import sinon from 'sinon';

import service from './geocode';

describe('services/geocode', () => {
  afterEach(() => {
    if (Request.prototype.end.restore) {
      Request.prototype.end.restore();
    }
  });

  it('should have the right name', () => {
    expect(service.name).to.equal('geocode');
  });

  describe('read method', () => {
    const resource = undefined;
    const config = undefined;
    const serviceCallback = () => {};
    it('should send a API request to the right API endpoint', done => {
      sinon.stub(Request.prototype, 'end', function callback() {
        expect(this.url).to.contain('/misc/geocode');
        expect(this.qs).to.eql({ latlng: 'foo,bar' });
        done();
      });
      service.read({ session: {} }, resource, { query: { latlng: 'foo,bar' } }, config, serviceCallback);
    });
  });
});
