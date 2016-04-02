/* eslint-env mocha */

import { expect } from 'chai';
import { groupByDay, groupByProfile, getReadyBy } from './MessagesUtils';

const messages = [
  {
    'id': 'bfdd47f7-3eea-41a2-b91b-4ece8a7c6c87',
    'created_at': 1457696729,
    'user': { id: 'foo' },
  },
  {
    'id': '9728d00d-0830-4cc4-87ef-6c0e9af028e0',
    'created_at': 1456689463,
    'user': { id: 'foo' },
  },
  {
    'id': 'c766d01b-4bca-4c5b-8e7f-f9c7cc6b9738',
    'created_at': 1457117055,
    'user': { id: 'bar' },
  },
  {
    'id': '8402ae5f-9b9c-49d6-a9f8-dc689808722a',
    'created_at': 1457524145,
    'user': { id: 'foo' },
  },
  {
    'id': '8abd6edb-5936-4fe3-a950-40c9f6cf91d0',
    'created_at': 1457538154,
    'user': { id: 'foo' },
  },
  {
    'id': '854edad4-9b46-433d-9288-124e0021ca1a',
    'created_at': 1457694665,
    'user': { id: 'foo' },
  },
  {
    'id': '5a1b33a2-f234-4121-8a47-6a00fa072eee',
    'created_at': 1457694832,
    'user': { id: 'bar' },
  },
  {
    'id': '9b1e226c-9289-4b4a-8a3e-12afdfd6053d',
    'created_at': 1457695711,
    'user': { id: 'bar' },
  },
  {
    'id': 'ebda6e58-4e04-44d3-9e92-6226da0898f4',
    'created_at': 1457695924,
    user: null,
  },
  {
    'id': '26b07acb-69fc-48d9-9ccb-d0d6b1636978',
    'created_at': 1457696685,
    'user': { id: 'bar' },
  },
];

describe('MessagesUtils', () => {

  describe('groupByDay', () => {

    it('should group messages by day', () => {
      const groupedMessages = groupByDay(messages);

      expect(groupedMessages[0].day).to.equal('2016-02-28');
      expect(groupedMessages[0].messages).to.have.length(1);
      expect(groupedMessages[1].day).to.equal('2016-03-04');
      expect(groupedMessages[1].messages).to.have.length(1);
      expect(groupedMessages[2].day).to.equal('2016-03-09');
      expect(groupedMessages[2].messages).to.have.length(2);
      expect(groupedMessages[3].day).to.equal('2016-03-11');
      expect(groupedMessages[3].messages).to.have.length(6);
    });
  });

  describe('groupByProfile', () => {

    it('should group messages by user', () => {
      const groupedMessages = groupByProfile(messages);

      expect(groupedMessages[0].user).to.eql({ id: 'foo' });
      expect(groupedMessages[0].messages).to.have.length(2);
      expect(groupedMessages[1].user).to.eql({ id: 'bar' });
      expect(groupedMessages[1].messages).to.have.length(1);
      expect(groupedMessages[2].user).to.eql({ id: 'foo' });
      expect(groupedMessages[2].messages).to.have.length(3);
      expect(groupedMessages[3].user).to.eql({ id: 'bar' });
      expect(groupedMessages[3].messages).to.have.length(2);
      expect(groupedMessages[4].user).to.be.null;
      expect(groupedMessages[4].messages).to.have.length(1);
      expect(groupedMessages[5].user).to.eql({ id: 'bar' });
      expect(groupedMessages[5].messages).to.have.length(1);
    });
  });

  describe('getReadyBy', () => {

    it('should return an empty array if read_by is null', () => {
      const message = { read_by: null };
      const readBy = getReadyBy(message);
      expect(readBy).to.have.length(0);
    });

    it('should exclude the message author', () => {
      const message = {
        user: { id: 'sender' },
        read_by: [
          { profile_id: 'foo' },
          { profile_id: 'bar' },
          { profile_id: 'sender' },
        ],
      };
      const users = [{ id: 'foo' }, { id: 'bar' }, { id: 'sender' }];
      const readBy = getReadyBy(message, users);
      expect(readBy).to.have.length(2);
      expect(readBy.some(user => user.id === 'foo')).to.be.true;
      expect(readBy.some(user => user.id === 'bar')).to.be.true;
      expect(readBy.some(user => user.id === 'sender')).to.be.false;
    });

    it('should exclude a given user', () => {
      const message = {
        user: { id: 'sender' },
        read_by: [
          { profile_id: 'foo' },
          { profile_id: 'bar' },
          { profile_id: 'sender' },
        ],
      };
      const users = [{ id: 'foo' }, { id: 'bar', username: 'bar' }, { id: 'sender' }];
      const readBy = getReadyBy(message, users, 'bar');
      expect(readBy.some(user => user.id === 'foo')).to.be.true;
      expect(readBy.some(user => user.id === 'bar')).to.be.false;
      expect(readBy.some(user => user.id === 'sender')).to.be.false;
    });
  });
});
