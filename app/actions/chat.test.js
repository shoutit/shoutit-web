import { expect } from 'chai';

import * as chat from '../actions/chat';
import { CONVERSATIONS } from '../schemas';

describe('actions/chat', () => {

  describe('loadChat', () => {
    it('should call the conversations service', () => {
      const action = chat.loadChat();
      expect(action).to.have.deep.property('service.name', 'conversations');
    });
    it('should return three types', () => {
      const action = chat.loadChat();
      expect(action).to.have.property('types').of.length(3);
    });
    it('should pass the endpoint to the params', () => {
      const action = chat.loadChat({ endpoint: 'foo' });
      expect(action).to.have.deep.property('service.params.endpoint', 'foo');
    });
    it('should use the CONVERSATIONS schema', () => {
      expect(chat.loadChat()).to.have.deep.property('service.schema', CONVERSATIONS);
    });
  });

  describe('receiveTypingNotification', () => {
    it('should return the right payload', () => {
      const action = chat.receiveTypingNotification('foo', { id: 'bar' });
      expect(action).to.have.deep.property('payload.entities.users.bar.id', 'bar');
      expect(action).to.have.deep.property('payload.userId', 'bar');
      expect(action).to.have.deep.property('payload.conversationId', 'foo');
    });
  });

  describe('stopTyping', () => {
    it('should return the right payload', () => {
      const action = chat.stopTyping('conv_id', 'user_id');
      expect(action).to.have.deep.property('payload.userId', 'user_id');
      expect(action).to.have.deep.property('payload.conversationId', 'conv_id');
    });
  });

  describe('startTyping', () => {
    it('should return the right payload', () => {
      const action = chat.startTyping({ firstName: 'Giampaolo' });
      expect(action).to.have.deep.property('payload.firstName', 'Giampaolo');
    });
  });


});
