/* eslint-env mocha */

import { expect } from 'chai';
import { groupByDay, groupByProfile, getReadyBy } from './MessagesUtils';

const messages = [{
  id: 'bfdd47f7-3eea-41a2-b91b-4ece8a7c6c87',
  createdAt: 1457696729,
  profile: { id: 'foo' },
}, {
  id: '9728d00d-0830-4cc4-87ef-6c0e9af028e0',
  createdAt: 1456689463,
  profile: { id: 'foo' },
}, {
  id: 'c766d01b-4bca-4c5b-8e7f-f9c7cc6b9738',
  createdAt: 1457117055,
  profile: { id: 'bar' },
}, {
  id: '8402ae5f-9b9c-49d6-a9f8-dc689808722a',
  createdAt: 1457524145,
  profile: { id: 'foo' },
}, {
  id: '8abd6edb-5936-4fe3-a950-40c9f6cf91d0',
  createdAt: 1457538154,
  profile: { id: 'foo' },
}, {
  id: '854edad4-9b46-433d-9288-124e0021ca1a',
  createdAt: 1457694665,
  profile: { id: 'foo' },
}, {
  id: '5a1b33a2-f234-4121-8a47-6a00fa072eee',
  createdAt: 1457694832,
  profile: { id: 'bar' },
}, {
  id: '9b1e226c-9289-4b4a-8a3e-12afdfd6053d',
  createdAt: 1457695711,
  profile: { id: 'bar' },
}, {
  id: 'ebda6e58-4e04-44d3-9e92-6226da0898f4',
  createdAt: 1457695924,
  profile: null,
}, {
  id: '26b07acb-69fc-48d9-9ccb-d0d6b1636978',
  createdAt: 1457696685,
  profile: { id: 'bar' },
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

    it('should group messages by profile', () => {
      const groupedMessages = groupByProfile(messages);

      expect(groupedMessages[0].profile).to.eql({ id: 'foo' });
      expect(groupedMessages[0].messages).to.have.length(2);
      expect(groupedMessages[1].profile).to.eql({ id: 'bar' });
      expect(groupedMessages[1].messages).to.have.length(1);
      expect(groupedMessages[2].profile).to.eql({ id: 'foo' });
      expect(groupedMessages[2].messages).to.have.length(3);
      expect(groupedMessages[3].profile).to.eql({ id: 'bar' });
      expect(groupedMessages[3].messages).to.have.length(2);
      expect(groupedMessages[4].profile).to.be.null;
      expect(groupedMessages[4].messages).to.have.length(1);
      expect(groupedMessages[5].profile).to.eql({ id: 'bar' });
      expect(groupedMessages[5].messages).to.have.length(1);
    });
  });

  describe('getReadyBy', () => {

    it('should return an empty array if readBy is null', () => {
      const message = { readBy: null };
      const readBy = getReadyBy(message);
      expect(readBy).to.have.length(0);
    });

    it('should exclude the message author', () => {
      const message = {
        profile: { id: 'sender' },
        readBy: [
          { profileId: 'foo' },
          { profileId: 'bar' },
          { profileId: 'sender' },
        ],
      };
      const profiles = [{ id: 'foo' }, { id: 'bar' }, { id: 'sender' }];
      const readBy = getReadyBy(message, profiles);
      expect(readBy).to.have.length(2);
      expect(readBy.some(profile => profile.id === 'foo')).to.be.true;
      expect(readBy.some(profile => profile.id === 'bar')).to.be.true;
      expect(readBy.some(profile => profile.id === 'sender')).to.be.false;
    });

    it('should exclude the profile\'s owner', () => {
      const message = {
        profile: { id: 'sender' },
        readBy: [
          { profileId: 'foo' },
          { profileId: 'bar' },
          { profileId: 'sender' },
        ],
      };
      const profiles = [{ id: 'foo' }, { id: 'bar', username: 'bar', isOwner: true }, { id: 'sender' }];
      const readBy = getReadyBy(message, profiles);
      expect(readBy.some(profile => profile.id === 'foo')).to.be.true;
      expect(readBy.some(profile => profile.id === 'bar')).to.be.false;
      expect(readBy.some(profile => profile.id === 'sender')).to.be.false;
    });
  });
});
