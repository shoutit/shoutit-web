import { expect } from 'chai';
import { Request } from 'superagent';
import { stub } from 'sinon';

import createService from './createService';

describe('services/createService', () => {

  it('should create a service with the given name', () => {
    expect(createService({ name: 'foo' })).to.eql({ name: 'foo' });
  });

  it('should create a service with a read method', () => {
    const service = createService({
      name: 'foo',
      read: '/bar',
    });
    expect(service.read).to.be.a('Function');
  });

  describe('read method requests', () => {
    afterEach(() => {
      if (Request.prototype.end.restore) {
        Request.prototype.end.restore();
      }
    });
    it('should use the given url', done => {
      stub(Request.prototype, 'end', function callback() {
        expect(this.url).to.contain('/bar');
        done();
      });
      const service = createService({
        name: 'foo',
        read: '/bar',
      });
      service.read({}, {}, { }, {}, () => {});
    });
    it('should use the params as url template', done => {
      stub(Request.prototype, 'end', function callback() {
        expect(this.url).to.contain('/bar/baz');
        done();
      });
      const service = createService({
        name: 'foo',
        read: '/bar/${value}',
      });
      service.read({}, {}, { value: 'baz' }, {}, () => {});
    });
    it('should use the params\' endpoint as url', done => {
      stub(Request.prototype, 'end', function callback() {
        expect(this.url).to.contain('/boo/zap');
        done();
      });
      const service = createService({
        name: 'foo',
        read: '/bar/${value}',
      });
      service.read({}, {}, { endpoint: '/boo/zap' }, {}, () => {});
    });

    it('should pass the query from params', done => {
      stub(Request.prototype, 'end', function callback() {
        expect(this.qs).to.eql({ abc: 'xyz' });
        done();
      });
      const service = createService({
        name: 'foo',
        read: '/bar',
      });
      service.read({}, {}, { value: 'baz', query: { abc: 'xyz' } }, {}, () => {});
    });
  });
});
