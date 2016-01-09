/**
 * Created by Philip on 22.06.2015.
 */

import Fluxxor from "fluxxor"
import findIndex from "lodash/array/findIndex"
import remove from "lodash/array/remove"

import * as actionTypes from "./actionTypes"

const LOG_TAG = "[Messages-Store]"

const initialState = {
  me: null,
  loading: false,
  conversations: [],
  draft: {
    text: ""
  }
}

export default Fluxxor.createStore({
  initialize(props) {
    this.state = initialState

    if (props.chat) {
      this.state.conversations = props.chat.results

      if (props.messages) {
        this.state.conversations[this.getIndex(props.params.chatId)].messages = props.messages.results
      }
    }

    if (props.loggedUser) {
      this.setMe(props.loggedUser)
    }

    this.bindActions(
      actionTypes.LOAD_CONVERSATIONS, this.onRequestStart,
      actionTypes.LOAD_CONVERSATIONS_SUCCESS, this.onLoadConversationsSuccess,
      actionTypes.LOAD_CONVERSATIONS_FAILED, this.onRequestFailure("load conversations failed"),

      actionTypes.LOAD_MORE_CONVERSATIONS, this.onRequestStart,
      actionTypes.LOAD_MORE_CONVERSATIONS_SUCCESS, this.onLoadMoreConversationsSuccess,
      actionTypes.LOAD_MORE_CONVERSATIONS_FAILED, this.onRequestFailure("load more conversations failed"),

      actionTypes.LOAD_CONVERSATION, this.onRequestStart,
      actionTypes.LOAD_CONVERSATION_SUCCESS, this.onLoadConversationSuccess,
      actionTypes.LOAD_CONVERSATION_FAILURE, this.onRequestFailure("load conversation failed"),

      actionTypes.LOAD_MORE_CONVERSATION, this.onRequestStart,
      actionTypes.LOAD_MORE_CONVERSATION_SUCCESS, this.onLoadMoreConversationSuccess,
      actionTypes.LOAD_MORE_CONVERSATION_FAILED, this.onRequestFailure("load conversation failed"),

      actionTypes.DELETE_CONVERSATION, this.onRequestStart,
      actionTypes.DELETE_CONVERSATION_SUCCESS, this.onDeleteConversationSuccess,
      actionTypes.DELETE_CONVERSATION_FAILURE, this.onRequestFailure("delete conversation failed"),

      actionTypes.READ_CONVERSATION, this.onRequestStart,
      actionTypes.READ_CONVERSATION_SUCCESS, this.onReadConversationSuccess,
      actionTypes.READ_CONVERSATION_FAILURE, this.onRequestFailure("read conversation failed"),

      actionTypes.UNREAD_CONVERSATION, this.onRequestStart,
      actionTypes.UNREAD_CONVERSATION_SUCCESS, this.onUnreadConversationSuccess,
      actionTypes.UNREAD_CONVERSATION_FAILURE, this.onRequestFailure("unread conversation failed"),

      actionTypes.REPLY_CONVERSATION, this.onRequestStart,
      actionTypes.REPLY_CONVERSATION_SUCCESS, this.onReplyConversationSuccess,
      actionTypes.REPLY_CONVERSATION_FAILED, this.onRequestFailure("reply conversation failed"),

      actionTypes.DELETE_MESSAGE, this.onRequestStart,
      actionTypes.DELETE_MESSAGE_SUCCESS, this.onDeleteMessageSuccess,
      actionTypes.DELETE_MESSAGE_FAILED, this.onRequestFailure("delete message failed"),

      actionTypes.NEW_MESSAGE, this.onNewMessage,
      actionTypes.MESSAGE_DRAFT_CHANGE, this.onDraftChange
    )
  },

  getIndex(id) {
    return findIndex(this.state.conversations, "id", id)
  },

  getConversation(id) {
    return this.state.conversations[this.getIndex(id)]
  },

  getState() {
    return this.state
  },

  setMe(user) {
    this.state.me = user.username
    this.emit("change")
  },

  onRequestStart() {
    this.state.loading = true
    this.emit("change")
  },

  onRequestFailure(tag) {
    return ({error}) => {
      console.error(LOG_TAG, tag, error)
      this.state.loading = false
      this.emit("change")
    }
  },

  onNewMessage({message}) {
    const index = this.getIndex(message.conversation_id)

    if (index > -1) {
      const conversation = this.state.conversations[index]
      if (!conversation.messages) {
        conversation.messages = []
      }
      conversation.messages.push(message)
      conversation.last_message = message
      conversation.messages_count += 1
      this.emit("change")
    }
  },

  onLoadConversationsSuccess(conversations) {
    this.state.conversations = conversations
    this.state.loading = false
    this.emit("change")
  },

  onLoadMoreConversationsSuccess({ before, conversations }) {
    conversations.forEach(conversation => {
      const index = this.getIndex(conversation.id)
      if (index >= 0) {
        this.state.conversations[index] = conversation
      } else {
        this.state.conversations.push(conversation)
      }
    })

    this.state.loading = false
    this.emit("change")
  },

  onLoadConversationSuccess({ id, messages }) {
    const conversation = this.getConversation(id)
    conversation.messages = messages
    this.state.loading = false
    this.emit("change")
  },

  onLoadMoreConversationSuccess({ id, messages }) {
    const conversation = this.getConversation(id)
    Array.prototype.splice.apply(conversation.messages, [0, 0].concat(messages))
    this.state.loading = false
    this.emit("change")
  },

  onDeleteConversationSuccess({ id }) {
    remove(this.state.conversations, "id", id)
    this.state.loading = false
    this.emit("change")
  },

  onReadConversationSuccess({id}) {
    const conversation = this.getConversation(id)
    conversation.unread_messages_count = 0
    conversation.messages.forEach(message => message.is_read = true)

    this.state.loading = false
    this.emit("change")
  },

  onUnreadConversationSuccess({id}) {
    const conversation = this.getConversation(id)
    conversation.unread_messages_count = conversation.messages.length
    conversation.messages.forEach(message => message.is_read = false)

    this.state.loading = false
    this.emit("change")
  },

  onReplyConversationSuccess({ id, message }) {
    const conversation = this.getConversation(id)
    conversation.messages.push(message)
    conversation.last_message = message
    conversation.messages_count += 1

    this.state.draft = { text: "" }
    this.state.loading = false
    this.emit("change")
  },

  onDeleteMessageSuccess({ messageId, conversationId }) {
    const conversation = this.getConversation(conversationId)
    remove(conversation.messages, "id", messageId)
    this.state.loading = false
    this.emit("change")
  },

  onDraftChange({field, value}) {
    this.state.draft[field] = value
    this.emit("change")
  },

  serialize() {
    return JSON.stringify(this.state)
  },

  hydrate(json) {
    this.state = JSON.parse(json)
  }
})
