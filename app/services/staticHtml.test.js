import { expect } from 'chai';
import * as staticHtml from './staticHtml';

describe('services/staticHtml', () => {

  describe('cache', () => {
    afterEach(() => {
      staticHtml.invalidateCache();
    });
    describe('getCachedContent', () => {
      it('should get undefined if the page is not yet cached', () => {
        expect(staticHtml.getCachedContent('foo')).to.be.undefined;
      });
    });
    describe('cacheContent', () => {
      afterEach(() => {
        staticHtml.invalidateCache();
      });
      it('should cache the content even if the page name is not cached yet', () => {
        staticHtml.cacheContent('foo', 'it', 'bar');
        expect(staticHtml.getCachedContent('foo', 'it')).to.equal('bar');
      });
      it('should work with different locales', () => {
        staticHtml.cacheContent('greetings', 'it', 'ciao');
        staticHtml.cacheContent('greetings', 'de', 'hallo');
        expect(staticHtml.getCachedContent('greetings', 'it')).to.equal('ciao');
        expect(staticHtml.getCachedContent('greetings', 'de')).to.equal('hallo');
      });
      it('should replace the existing cache', () => {
        staticHtml.cacheContent('foo', 'it', 'bar');
        staticHtml.cacheContent('foo', 'it', 'test');
        expect(staticHtml.getCachedContent('foo', 'it')).to.equal('test');
      });
    });
    describe('invalidateCache', () => {
      beforeEach(() => {
        staticHtml.cacheContent('foo', 'it', 'test');
        staticHtml.cacheContent('greetings', 'it', 'ciao');
        staticHtml.cacheContent('greetings', 'de', 'hallo');
      });
      it('should get invalidate the whole cache if page is not defined', () => {
        staticHtml.invalidateCache();
        expect(staticHtml.getCachedContent('foo', 'it')).to.be.undefined;
        expect(staticHtml.getCachedContent('greetings', 'it')).to.be.undefined;
        expect(staticHtml.getCachedContent('greetings', 'de')).to.be.undefined;
      });
      it('should get invalidate only a single page', () => {
        staticHtml.invalidateCache('foo');
        expect(staticHtml.getCachedContent('foo', 'it')).to.be.undefined;
        expect(staticHtml.getCachedContent('greetings', 'it')).to.equal('ciao');
        expect(staticHtml.getCachedContent('greetings', 'de')).to.equal('hallo');
      });
    });
  });

  describe('service', () => {
    it('should invalidate the cache if `invalidateCache` is passed via query');
    it('should return the cached content if available');
    it('should return the content from AWS if no cache is available');
    it('should return the error from AWS');
  });
});
