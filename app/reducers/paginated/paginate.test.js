// import { expect } from 'chai';
// import paginate from './paginate';

describe('reducer/paginated/paginate', () => {

  describe('start action handler', () => {

    it('should throw if the payload is not valid');
    it('should throw if the query is not valid');
    it('should reset pages while keeping the count if sorting changed');
    it('should reset pages and reset the count if query changed');
    it('should update the query in the state');
    it('should set the page ids to empty if not already existing');
    it('should set the page as fetching');
    it('should reset a previous error for the page being fetched');

  });

  describe('success action handler', () => {

    it('should throw if the query is not valid');
    it('should throw if the count is not valid');
    it('should throw if the result is not valid');

    it('should ignore the results for a previous query');
    it('should set count, next and previous urls');
    it('should set the ids for the fetched page');
    it('should set the page as fetched');

  });

  describe('failure action handler', () => {

    it('should throw if the query is not valid');
    it('should throw if the error is not valid');

    it('should ignore the results for a previous query');
    it('should extends the previous page state');
    it('should set the error in state');
    it('should set the page as fetched');

  });

});
