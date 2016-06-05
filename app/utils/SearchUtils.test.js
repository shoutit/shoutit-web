/* eslint-env mocha */

import { expect } from 'chai';

import * as SearchUtils from './SearchUtils';

describe('utils/SearchUtils', () => {
  describe('filtersObjectToUriComponent', () => {

    it('should create a string with slugs and values', () => {
      const component = SearchUtils.filtersObjectToUriComponent({
        foo: 'bar',
        abc: 'xyz',
      });
      expect(component).to.equal('foo:bar;abc:xyz');
    });

  });

  describe('uriComponentToFiltersObject', () => {

    it('should create an object from a string with slugs and values', () => {
      const obj = SearchUtils.uriComponentToFiltersObject('foo:bar;bar:foo');
      expect(obj).to.eql({ foo: 'bar', bar: 'foo' });
    });

  });

  describe('getQuerystringFromSearchParams', () => {

    it('should create a querystring with the search values', () => {
      const querystring = SearchUtils.getQuerystringFromSearchParams({
        shout_type: 'request',
        category: 'foo-category',
        min_price: '1',
        max_price: '2',
        search: 'with space',
        filters: { foo: 'bar', bar: 'foo' },
      });
      expect(querystring).to.equal('shout_type=request&category=foo-category&search=with%20space&min_price=1&max_price=2&filters=foo:bar;bar:foo');
    });

    it('should ignore invalid shout types', () => {
      const querystring = SearchUtils.getQuerystringFromSearchParams({
        shout_type: 'foo',
      });
      expect(querystring).to.equal('');
    });

    it('should ignore `all` shout types', () => {
      const querystring = SearchUtils.getQuerystringFromSearchParams({
        shout_type: 'all',
      });
      expect(querystring).to.equal('');
    });

  });

  describe('getSearchParamsFromQuery', () => {

    it('should create a valid search params object', () => {
      const searchParams = SearchUtils.getSearchParamsFromQuery({
        shout_type: 'request',
        category: 'foo-category',
        min_price: '1',
        max_price: '2',
        search: 'with%20space',
        filters: 'foo:bar;abc:xyz',
      });
      expect(searchParams).to.eql({
        shout_type: 'request',
        category: 'foo-category',
        min_price: 1,
        max_price: 2,
        search: 'with space',
        foo: 'bar',
        abc: 'xyz',
      });
    });

  });

});
