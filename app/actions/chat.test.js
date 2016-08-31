import { expect } from 'chai';

import * as chat from '../actions/chat';
import { CONVERSATIONS } from '../schemas';

describe('actions/chat', () => {

  describe('loadConversations', () => {
    it('should call the conversations service', () => {
      const action = chat.loadConversations();
      expect(action).to.have.deep.property('service.name', 'conversations');
    });
    it('should return three types', () => {
      const action = chat.loadConversations();
      expect(action).to.have.property('types').of.length(3);
    });
    it('should pass the endpoint to the params', () => {
      const action = chat.loadConversations({ endpoint: 'foo' });
      expect(action).to.have.deep.property('service.params.endpoint', 'foo');
    });
    it('should use the CONVERSATIONS schema', () => {
      expect(chat.loadConversations()).to.have.deep.property('service.schema', CONVERSATIONS);
    });
  });

  describe('receiveTypingNotification', () => {
    it('should return the right payload', () => {
      const action = chat.receiveTypingNotification('foo', { id: 'bar' });
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
      const action = chat.startTyping({ name: 'Giampaolo', id: 'foo' });
      expect(action).to.have.deep.property('payload.name', 'Giampaolo');
      expect(action).to.have.deep.property('payload.id', 'foo');
    });
  });


});
