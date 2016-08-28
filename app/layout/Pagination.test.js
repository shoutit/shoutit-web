
import { expect } from 'chai';
import * as Pagination from './Pagination';

describe('layout/Pagination', () => {

  describe('helpers/getPageNumbers', () => {

    it('should return a single page if count is less or equal than the page size', () => {
      expect(Pagination.getPageNumbers({
        count: 5,
        pageSize: 10,
      })).to.eql(0);
      expect(Pagination.getPageNumbers({
        count: 10,
        pageSize: 10,
      })).to.eql(0);
    });

    it('should return the correct number of pages', () => {
      expect(Pagination.getPageNumbers({
        count: 15,
        pageSize: 10,
      })).to.eql(2);
    });

  });

});
