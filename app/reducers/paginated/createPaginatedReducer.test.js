import { expect } from 'chai';
import createPaginatedReducer from './createPaginatedReducer';

describe('reducer/createPaginatedReducer', () => {

  describe('update pagination when fetching', () => {
    describe('without mapping the action by key', () => {

      const reduce = createPaginatedReducer({
        fetchTypes: ['FETCH_START', 'FETCH_SUCCESS', 'FETCH_FAILURE'],
      });

      it('should set the state as isFetching when starting', () => {
        const state = reduce({ ids: [] }, {
          type: 'FETCH_START',
          payload: {
            foo: 'bar',
          },
        });
        expect(state).to.eql({ isFetching: true, ids: [] });
      });

      it('should set the state as isFetching when starting and state undefined', () => {
        const state = reduce(undefined, {
          type: 'FETCH_START',
          payload: {
            foo: 'bar',
          },
        });
        expect(state).to.eql({ isFetching: true, ids: [] });
      });

      it('should set the state when starting not changing the old state', () => {
        const state = reduce({
          ids: ['foo', 'bar'],
          isFetching: false,
        }, {
          type: 'FETCH_START',
          payload: {
            foo: 'bar',
          },
        });
        expect(state).to.eql({
          ids: ['foo', 'bar'],
          isFetching: true,
        });
      });

      it('should append the results when successfully fetched', () => {
        const state = reduce({
          ids: ['foo', 'bar'],
          isFetching: true,
        }, {
          type: 'FETCH_SUCCESS',
          payload: {
            result: ['gin'],
          },
        });
        expect(state).to.eql({
          ids: ['foo', 'bar', 'gin'],
          isFetching: false,
        });

      });

      it('should append the next/previous urls', () => {
        const state = reduce({
          ids: ['foo', 'bar'],
          isFetching: true,
        }, {
          type: 'FETCH_SUCCESS',
          payload: {
            result: ['gin'],
            nextUrl: 'next',
            previousUrl: 'prev',
          },
        });
        expect(state).to.eql({
          ids: ['foo', 'bar', 'gin'],
          isFetching: false,
          nextUrl: 'next',
          previousUrl: 'prev',
        });

      });

      it('should append the error when fetching fails', () => {
        const state = reduce({
          ids: ['foo', 'bar'],
          isFetching: true,
        }, {
          type: 'FETCH_FAILURE',
          payload: { error: 'A bad error' },
        });

        expect(state).to.eql({
          ids: ['foo', 'bar'],
          isFetching: false,
          error: 'A bad error',
        });

      });
    });
    describe('mapping an action by key', () => {

      const reduce = createPaginatedReducer({
        mapActionToKey: action => action.payload.fooId,
        fetchTypes: ['FETCH_START', 'FETCH_SUCCESS', 'FETCH_FAILURE'],
      });

      it('should set the state as isFetching when starting, returning empty ids', () => {
        const state = reduce({}, {
          type: 'FETCH_START',
          payload: {
            fooId: 'A',
          },
        });
        expect(state).to.eql({
          A: {
            isFetching: true,
            ids: [],
          },
        });
      });

      it('should append the results when successfully fetched', () => {
        const state = reduce({
          B: {
            isFetching: true,
            ids: [],
          },
        }, {
          type: 'FETCH_SUCCESS',
          payload: {
            fooId: 'B',
            result: ['gin', 'bar'],
          },
        });

        expect(state).to.eql({
          B: {
            isFetching: false,
            ids: ['gin', 'bar'],
          },
        });

      });

      it('should append the next/previous urls', () => {
        const state = reduce({
          C: {
            isFetching: true,
            ids: [],
          },
        }, {
          type: 'FETCH_SUCCESS',
          payload: {
            fooId: 'C',
            result: ['gin', 'bar'],
            nextUrl: 'next',
            previousUrl: 'prev',
          },
        });
        expect(state).to.eql({
          C: {
            ids: ['gin', 'bar'],
            isFetching: false,
            nextUrl: 'next',
            previousUrl: 'prev',
          },
        });

      });

      it('should append the error when fetching fails', () => {
        const state = reduce({
          C: {
            isFetching: true,
            ids: ['gin', 'bar'],
          },
        }, {
          type: 'FETCH_FAILURE',
          payload: {
            fooId: 'C',
            error: {
              message: 'Bad bad things',
            },
          },
        });
        expect(state).to.eql({
          C: {
            ids: ['gin', 'bar'],
            isFetching: false,
            error: {
              message: 'Bad bad things',
            },
          },
        });

      });

    });
  });

  describe('updates pagination when create action types are dispatched', () => {
    describe('without mapping the action by key', () => {
      const reduce = createPaginatedReducer({
        mapActionToTempId: action => action.tempId,

        fetchTypes: ['FETCH_START', 'FETCH_SUCCESS', 'FETCH_FAILURE'],
        createTypes: ['CREATE_START', 'CREATE_SUCCESS'],

      });

      it('should add the temporary item id when no state is defined', () => {
        const state = reduce(undefined, {
          type: 'CREATE_START',
          tempId: 'abc',
        });
        expect(state).to.eql({
          ids: ['abc'],
        });
      });

      it('should add the temporary item id when to the existing ones', () => {
        const state = reduce({ ids: ['foo'] }, {
          type: 'CREATE_START',
          tempId: 'abc',
        });
        expect(state).to.eql({
          ids: ['foo', 'abc'],
        });
      });

      it('should remove the temporary item id when success and adding the new result', () => {
        const state = reduce({ ids: ['foo', 'abc'] }, {
          type: 'CREATE_SUCCESS',
          payload: {
            result: 'real_id',
          },
          tempId: 'abc',
        });
        expect(state).to.eql({
          ids: ['foo', 'real_id'],
        });
      });
    });
    describe('mapping an action by key', () => {

      const reduce = createPaginatedReducer({
        mapActionToTempId: action => action.tempId,
        mapActionToKey: action => action.payload.id,
        fetchTypes: ['FETCH_START', 'FETCH_SUCCESS', 'FETCH_FAILURE'],
        createTypes: ['CREATE_START', 'CREATE_SUCCESS'],
      });

      it('should add the temporary item id when no state is defined', () => {
        const state = reduce({}, {
          type: 'CREATE_START',
          tempId: 'temp',
          payload: {
            id: 'foo',
          },
        });
        expect(state).to.eql({
          foo: {
            ids: ['temp'],
          },
        });
      });

      it('should remove the temporary item id when success', () => {
        const state = reduce({
          foo: {
            ids: ['temp'],
          },
        }, {
          type: 'CREATE_SUCCESS',
          tempId: 'temp',
          payload: {
            id: 'foo',
            result: 'real_id',
          },
        });
        expect(state).to.eql({
          foo: {
            ids: ['real_id'],
          },
        });
      });

    });
  });

  describe('updates pagination when add action type is dispatched', () => {

    describe('without mapping the action by key', () => {
      const reduce = createPaginatedReducer({
        addType: 'ADD',
      });

      it('should add the new item', () => {
        const state = reduce({ ids: ['foo', 'abc'] }, {
          type: 'ADD',
          payload: {
            result: 'bar',
          },
        });
        expect(state).to.eql({
          ids: ['foo', 'abc', 'bar'],
        });
      });

    });

  });

  describe('updates pagination when delete action type is dispatched', () => {

    describe('without mapping the action by key', () => {
      const reduce = createPaginatedReducer({
        deleteType: 'DELETE',
      });

      it('should delete an existing item', () => {
        const state = reduce({ ids: ['foo', 'abc'] }, {
          type: 'DELETE',
          payload: { id: 'abc' },
        });
        expect(state).to.eql({
          ids: ['foo'],
        });
      });

    });

  });

});
