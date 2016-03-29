import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { Request } from 'superagent';

import MessagesActions from './MessagesActions';
import * as actions from './actionTypes';

chai.use(sinonChai);

describe('MessagesActions', () => {
  let dispatch;
  const loggedUser = { username: 'a username' };

  beforeEach(() => {
    dispatch = sinon.spy();
    MessagesActions.dispatch = dispatch;
    sinon.stub(Request.prototype, 'send', () => Request.prototype);
  });
  afterEach(() => {
    Request.prototype.send.restore();
    delete MessagesActions.dispatch;
  });

  describe('replyToConversation', () => {

    afterEach(() => Request.prototype.end.restore());

    it('should dispatch on success', () => {
      sinon.stub(Request.prototype, 'end', done => done(null, {
        ok: true,
        body: { text: 'a message' }
      }));
      const tempMessage = MessagesActions.replyToConversation(loggedUser, 'abc', 'a message');
      expect(dispatch).to.have.been.calledWith(
        actions.REPLY_CONVERSATION,
        { conversationId: 'abc', message: tempMessage }
      );
      expect(dispatch).to.have.been.calledWith(
        actions.REPLY_CONVERSATION_SUCCESS, {
          conversationId: 'abc',
          message: { text: 'a message' },
          tempMessageId: tempMessage.id
        }
      );
    });

    it('should dispatch response on failure', () => {
      sinon.stub(Request.prototype, 'end', done => done(null, {
        ok: false
      }));
      const tempMessage = MessagesActions.replyToConversation(loggedUser, 'abc', 'a message');
      expect(dispatch).to.have.been.calledWith(
        actions.REPLY_CONVERSATION_FAILURE, {
          conversationId: 'abc',
          message: tempMessage,
          error: { ok: false }
        }
      );
    });

    it('should dispatch error on failure', () => {
      sinon.stub(Request.prototype, 'end', done => done({ status: 404 }, null));
      const tempMessage = MessagesActions.replyToConversation(loggedUser, 'abc', 'a message');
      expect(dispatch).to.have.been.calledWith(
        actions.REPLY_CONVERSATION_FAILURE, {
          conversationId: 'abc',
          message: tempMessage,
          error: { status: 404 }
        }
      );
    });

  });

  describe('newPushedMessage', () => {

    it('should dispatch a pushed message', () => {
      const message = { id: 'abc', text: 'a message' };
      MessagesActions.newPushedMessage(message);
      expect(dispatch).to.have.been.calledWith(
        actions.NEW_PUSHED_MESSAGE,
        message
      );
    });

  });

  describe('sendMessage', () => {

    afterEach(() => Request.prototype.end.restore());

    it('should dispatch on success and call the callback', () => {
      const done = sinon.spy();
      sinon.stub(Request.prototype, 'end', done => done(null, {
        ok: true,
        body: { text: 'a message' }
      }));
      const tempMessage = MessagesActions.sendMessage(loggedUser, 'recipient', 'a message', done);
      expect(dispatch).to.have.been.calledWith(
        actions.SEND_MESSAGE,
        { to: 'recipient', message: tempMessage }
      );
      expect(dispatch).to.have.been.calledWith(
        actions.SEND_MESSAGE_SUCCESS, {
          to: 'recipient',
          tempMessageId: tempMessage.id,
          message: { text: 'a message' }
        }
      );
      expect(done).to.have.been.calledWith(
        null,
        { text: 'a message' }
      );
    });

    it('should dispatch response on failure and call the callback', () => {
      const done = sinon.spy();
      sinon.stub(Request.prototype, 'end', done => done(null, {
        ok: false
      }));
      const tempMessage = MessagesActions.sendMessage(loggedUser, 'recipient', 'a message', done);
      expect(dispatch).to.have.been.calledWith(
        actions.SEND_MESSAGE_FAILURE, {
          to: 'recipient',
          message: tempMessage,
          error: { ok: false }
        }
      );
      expect(done).to.have.been.calledWith({ ok: false });
    });

    it('should dispatch error on failure and call the callback', () => {
      const done = sinon.spy();
      sinon.stub(Request.prototype, 'end', done => done({ status: 404 }, null));
      const tempMessage = MessagesActions.sendMessage(loggedUser, 'recipient', 'a message', done);
      expect(dispatch).to.have.been.calledWith(
        actions.SEND_MESSAGE_FAILURE, {
          to: 'recipient',
          message: tempMessage,
          error: { status: 404 }
        }
      );
      expect(done).to.have.been.calledWith({ status: 404 });
    });

  });


});
