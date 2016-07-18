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
        sort: 'time',
      });
      expect(querystring).to.equal('shout_type=request&category=foo-category&search=with%20space&min_price=1&max_price=2&filters=foo:bar;bar:foo&sort=time');
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

  describe('getShoutsQuery', () => {

    it('should append a page param if not provided', () => {
      expect(SearchUtils.getShoutsQuery({})).to.eql({ page: 1 });
      expect(SearchUtils.getShoutsQuery({ page: '2' })).to.eql({ page: 2 });
    });
    it('should decode an encoded character in the search query', () => {
      const query = SearchUtils.getShoutsQuery({
        search: 'with%20space',
      });
      expect(query).to.eql({
        search: 'with space',
        page: 1,
      });
    });
    it('should create a valid query with shout type, search, sort and category', () => {
      const query = SearchUtils.getShoutsQuery({
        shout_type: 'request',
        category: 'foo-category',
        search: 'hello',
        page: '1',
        sort: 'foo',
      });
      expect(query).to.eql({
        shout_type: 'request',
        category: 'foo-category',
        search: 'hello',
        page: 1,
        sort: 'foo',
      });
    });

    it('should parse prices to integer', () => {
      const query = SearchUtils.getShoutsQuery({
        min_price: '1',
        max_price: '2',
      });
      expect(query).to.eql({
        min_price: 1,
        max_price: 2,
        page: 1,
      });
    });

    it('should create a valid query with prices having the `free` param set', () => {
      const query = SearchUtils.getShoutsQuery({
        shout_type: 'request',
        category: 'foo-category',
        min_price: '1',
        max_price: '2',
        free: true,
      });
      expect(query).to.eql({
        shout_type: 'request',
        category: 'foo-category',
        max_price: 0,
        page: 1,
      });
    });

    it('should use the location argument when passed', () => {
      const location = {
        city: 'a city',
        state: 'a state',
        country: 'a country',
        latitude: 123,
        longitude: 245,
      };
      const query = SearchUtils.getShoutsQuery({}, location);
      const expectedValue = {
        city: 'a city',
        state: 'a state',
        country: 'a country',
        latitude: 123,
        longitude: 245,
        page: 1,
      };
      expect(query).to.eql(expectedValue);
    });

    it('should use the within argument in km', () => {
      const location = {
        city: 'a city',
        state: 'a state',
        country: 'a country',
      };
      const query = SearchUtils.getShoutsQuery({ within: '200' }, location);
      const expectedValue = {
        city: 'a city',
        state: 'a state',
        country: 'a country',
        within: 200,
        page: 1,
      };
      expect(query).to.eql(expectedValue);
    });
    it('should use the within argument set as city', () => {
      const location = {
        city: 'a city',
        state: 'a state',
        country: 'a country',
        latitude: 123,
        longitude: 245,
      };
      const query = SearchUtils.getShoutsQuery({ within: 'city' }, location);
      const expectedValue = {
        city: 'a city',
        state: 'a state',
        country: 'a country',
        page: 1,
      };
      expect(query).to.eql(expectedValue);
    });
    it('should use the within argument set as state', () => {
      const location = {
        city: 'a city',
        state: 'a state',
        country: 'a country',
        latitude: 123,
        longitude: 245,
      };
      const query = SearchUtils.getShoutsQuery({ within: 'state' }, location);
      const expectedValue = {
        state: 'a state',
        country: 'a country',
        page: 1,
      };
      expect(query).to.eql(expectedValue);
    });
    it('should use the within argument set as country', () => {
      const location = {
        city: 'a city',
        state: 'a state',
        country: 'a country',
        latitude: 123,
        longitude: 245,
      };
      const query = SearchUtils.getShoutsQuery({ within: 'country' }, location);
      const expectedValue = {
        country: 'a country',
        page: 1,
      };
      expect(query).to.eql(expectedValue);
    });

  });

});
