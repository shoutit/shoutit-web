
import { expect } from 'chai';
import { getConversation } from './conversations';

// import * as actionTypes from '../../actions/actionTypes';
describe('reducers/currencies', () => {

  describe('reducer', () => {
  });

  describe('getConversation', () => {
    it('should return a denormalized conversation', () => {
      const state = {
        entities: {
          conversations: {
            foo: {
              id: 'foo',
              profiles: ['bar'],
              about: 'shout',
              lastMessage: 'msg',
            },
          },
          users: {
            bar: { id: 'bar' },
          },
          shouts: {
            shout: { id: 'shout' },
          },
          messages: {
            msg: { id: 'msg' },
          },
        },
      };
      const expectedValue = {
        id: 'foo',
        profiles: [{ id: 'bar' }],
        about: { id: 'shout' },
        lastMessage: { id: 'msg' },
      };
      expect(getConversation(state, 'foo')).to.eql(expectedValue);
    });
  });

});
