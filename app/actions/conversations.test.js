import { expect } from 'chai';

import * as conversations from '../actions/conversations';
import { CONVERSATION, MESSAGE } from '../schemas';

describe('actions/conversations', () => {

  describe('loadConversation', () => {
    it('should call the conversations service', () => {
      const action = conversations.loadConversation({ id: 'foo' });
      expect(action).to.have.deep.property('service.name', 'conversations');
    });
    it('should return three types', () => {
      const action = conversations.loadConversation({ id: 'foo' });
      expect(action).to.have.property('types').of.length(3);
    });
    it('should pass the conversation id to the params', () => {
      const action = conversations.loadConversation({ id: 'foo' });
      expect(action).to.have.deep.property('service.params.id', 'foo');
    });
    it('should use the CONVERSATION schema', () => {
      expect(conversations.loadConversation({})).to.have.deep.property('service.schema', CONVERSATION);
    });
  });

  describe('setActiveConversation', () => {
    it('should pass the conversation as payload', () => {
      const action = conversations.setActiveConversation({ id: 'foo' });
      expect(action).to.have.deep.property('payload.id', 'foo');
    });
  });

  describe('unsetActiveConversation', () => {
    it('should pass the conversation as payload', () => {
      const action = conversations.setActiveConversation({ id: 'foo' });
      expect(action).to.have.deep.property('payload.id', 'foo');
    });
  });

  describe('replyToConversation', () => {

    const action = conversations.replyToConversation(
      { id: 'a_conv_id' },
      { username: 'a_username', id: 'a_user_id' },
      { text: 'a_text' }
    );

    it('should call the conversationReply create service', () => {
      expect(action).to.have.deep.property('service.name', 'conversationReply');
      expect(action).to.have.deep.property('service.method', 'create');
    });
    it('should return three types', () => {
      expect(action).to.have.property('types').of.length(3);
    });
    it('should pass the correct payload', () => {
      expect(action).to.have.deep.property('payload.conversation.id', 'a_conv_id');
      expect(action).to.have.deep.property('payload.message.text', 'a_text');
    });
    it('should pass the message as body', () => {
      expect(action).to.have.deep.property('service.body.text', 'a_text');
      expect(action).to.have.deep.property('service.body.profile', 'a_user_id');
    });
    it('should use the right schema', () => {
      expect(action).to.have.deep.property('service.schema', MESSAGE);
    });

  });

  describe('openConversation', () => {
    it('should pass the conversation as payload', () => {
      const action = conversations.openConversation({ id: 'foo' });
      expect(action).to.have.deep.property('payload.conversation.id', 'foo');
    });
  });

  describe('closeConversation', () => {
    it('should pass the conversation id as payload', () => {
      const action = conversations.closeConversation({ id: 'foo' });
      expect(action).to.have.deep.property('payload.id', 'foo');
    });
  });

  describe('beginConversation', () => {
    const loggedProfile = {
      id: 'logged_profile_id',
    };
    const recipient = {
      id: 'recipient_id',
      name: 'recipient_name',
    };
    const action = conversations.beginConversation(loggedProfile, recipient);
    const newConversation = action.payload.conversation;

    it('should pass the new conversation as payload', () => {
      expect(newConversation).to.be.defined;
    });
    it('should pass a new conversation with the profiles in it', () => {
      expect(newConversation).to.have.property('profiles').to.eql(['logged_profile_id', 'recipient_id']);
    });
    it('should pass a new conversation marked as new', () => {
      expect(newConversation).to.have.property('isNew', true);
    });
    it('should pass a new conversation of type chat', () => {
      expect(newConversation).to.have.property('type', 'chat');
    });
    it('should pass a new conversation with an id', () => {
      expect(newConversation).to.have.property('id');
    });
    it('should pass a new conversation with the user name as display title', () => {
      expect(newConversation).to.have.deep.property('display.title', 'recipient_name');
    });
  });

  describe('leaveConversation', () => {

    const action = conversations.leaveConversation(
      { id: 'a_conv_id' },
    );
    it('should call the conversations delete service', () => {
      expect(action).to.have.deep.property('service.name', 'conversations');
      expect(action).to.have.deep.property('service.method', 'delete');
    });
    it('should return three types', () => {
      expect(action).to.have.property('types').of.length(3);
    });
    it('should pass the correct payload', () => {
      expect(action).to.have.deep.property('payload.id', 'a_conv_id');
    });

  });

  describe('markConversationAsRead', () => {
    it('should pass the conversation as payload', () => {
      const action = conversations.markConversationAsRead({ id: 'foo' });
      expect(action).to.have.deep.property('payload.conversation').to.eql({ id: 'foo' });
    });
  });

  describe('readConversation', () => {

    const action = conversations.readConversation(
      { id: 'a_conv_id' },
    );
    it('should call the conversationRead create service', () => {
      expect(action).to.have.deep.property('service.name', 'conversationRead');
      expect(action).to.have.deep.property('service.method', 'create');
    });
    it('should pass the correct params to the service', () => {
      expect(action).to.have.deep.property('service.params.id', 'a_conv_id');
    });
    it('should return three types', () => {
      expect(action).to.have.property('types').of.length(3);
    });
    it('should pass the correct payload', () => {
      expect(action).to.have.deep.property('payload.conversation.id', 'a_conv_id');
    });

  });

  describe('unreadConversation', () => {

    const action = conversations.unreadConversation(
      { id: 'a_conv_id' },
    );
    it('should call the conversationRead create service', () => {
      expect(action).to.have.deep.property('service.name', 'conversationRead');
      expect(action).to.have.deep.property('service.method', 'delete');
    });
    it('should pass the correct params to the service', () => {
      expect(action).to.have.deep.property('service.params.id', 'a_conv_id');
    });
    it('should return three types', () => {
      expect(action).to.have.property('types').of.length(3);
    });
    it('should pass the correct payload', () => {
      expect(action).to.have.deep.property('payload.conversation.id', 'a_conv_id');
    });
  });

  describe('replaceConversation', () => {
    it('should pass the correct payload', () => {
      const action = conversations.replaceConversation('foo');
      expect(action).to.have.deep.property('payload', 'foo');
    });
  });

});
