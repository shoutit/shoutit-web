import * as actionTypes from "./actionTypes";
import * as client from "./client";

export const actions = {

  loadConversations(done) {
    this.dispatch(actionTypes.LOAD_CONVERSATIONS)
    client.loadConversations().end((error, res) => {
      if (error || !res.ok) {
        this.dispatch(actionTypes.LOAD_CONVERSATIONS_FAILED, { error })
        return
      }
      this.dispatch(actionTypes.LOAD_CONVERSATIONS_SUCCESS, res.body.results)
      done && done()
    })
  },

  loadMoreConversations(before) {
    this.dispatch(actionTypes.LOAD_MORE_CONVERSATIONS, { before })
    client.loadMoreConversations({ before }).end((error, res) => {
      if (error || !res.ok) {
        this.dispatch(actionTypes.LOAD_MORE_CONVERSATIONS_FAILED, { error })
        return
      }
      const conversations = res.body.results
      this.dispatch(actionTypes.LOAD_MORE_CONVERSATIONS_SUCCESS, { before, conversations })
    })
  },

  loadConversation(id) {
    this.dispatch(actionTypes.LOAD_CONVERSATION, { id } )
    client.loadMessages(id).end((error, res) => {
      if (error || !res.ok) {
        this.dispatch(actionTypes.LOAD_CONVERSATION_FAILURE, { error })
        return
      }
      const messages =  res.body.results
      this.dispatch(actionTypes.LOAD_CONVERSATION_SUCCESS, { id, messages })
    })
  },

  loadMoreConversation(id, before) {
    this.dispatch(actionTypes.LOAD_MORE_CONVERSATION, { id, before })
    client.loadMoreMessages(id, { before }).end((error, res) => {
      if (error || !res.ok) {
        this.dispatch(actionTypes.LOAD_MORE_CONVERSATION_FAILED, { id, before, error })
        return
      }
      const messages = res.body.results
      this.dispatch(actionTypes.LOAD_MORE_CONVERSATION_SUCCESS, { id, before, messages })
    })
  },

  deleteConversation(id) {
    this.dispatch(actionTypes.DELETE_CONVERSATION, { id })
    client.deleteConversation(id).end((error, res) => {
      if (error || !res.ok) {
        this.dispatch(actionTypes.DELETE_CONVERSATION_FAILURE, { id, error })
        return
      }
      this.dispatch(actionTypes.DELETE_CONVERSATION_SUCCESS, { id })
    })
  },

  readConversation(id) {
    this.dispatch(actionTypes.READ_CONVERSATION, { id })
    client.readConversation(id).end((error, res) => {
      if (error || !res.ok) {
        this.dispatch(actionTypes.READ_CONVERSATION_FAILURE, { id, error })
        return
      }
      this.dispatch(actionTypes.READ_CONVERSATION_SUCCESS, { id })
    })
  },

  unreadConversation(id) {
    this.dispatch(actionTypes.UNREAD_CONVERSATION, { id })
    client.unreadConversation(id).end((error, res) => {
      if (error || !res.ok) {
        this.dispatch(actionTypes.UNREAD_CONVERSATION_FAILURE, { id, error })
        return
      }
      this.dispatch(actionTypes.UNREAD_CONVERSATION_SUCCESS, { id })
    })
  },

  replyConversation(id, message) {
    this.dispatch(actionTypes.REPLY_CONVERSATION, { id, message })
    client.replyConversation(id, message).end((error, res) => {
      if (error || !res.ok) {
        this.dispatch(actionTypes.REPLY_CONVERSATION_FAILED, { id, message, error })
        return
      }
      this.dispatch(actionTypes.REPLY_CONVERSATION_SUCCESS, { id, message: res.body })
    })
  },

  deleteMessage(messageId, conversationId) {
    this.dispatch(actionTypes.DELETE_MESSAGE, { messageId, conversationId })
    client.deleteMessage(messageId).end((error, res) => {
      if (error || !res.ok) {
        this.dispatch(actionTypes.DELETE_MESSAGE_FAILED, { messageId, conversationId, error })
        return
      }
      this.dispatch(actionTypes.DELETE_MESSAGE_SUCCESS, { messageId, conversationId })
    })
  },

  newMessage(message) {
    this.dispatch(actionTypes.NEW_MESSAGE, {message})
  },

  messageDraftChange(field, value) {
    this.dispatch(actionTypes.MESSAGE_DRAFT_CHANGE, { field, value })
  }

}
