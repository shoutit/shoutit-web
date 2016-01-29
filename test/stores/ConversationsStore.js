import chai, { expect } from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";

import { Flux } from "fluxxor";

import { ConversationsStore } from "../../app/shared/stores/conversations/ConversationsStore";
import * as actionTypes from "../../app/shared/stores/conversations/actionTypes";
import {
  REPLY_CONVERSATION,
  REPLY_CONVERSATION_SUCCESS,
  REPLY_CONVERSATION_FAILURE,
  NEW_PUSHED_MESSAGE
} from "../../app/shared/stores/messages/actionTypes";

import {
  LOAD_CONVERSATIONS_SUCCESS
} from "../../app/shared/stores/chat/actionTypes";


import { LOGOUT } from "../../app/shared/stores/users/consts";

chai.use(sinonChai);

function initFlux(conversations) {
  const flux = new Flux({
    ConversationsStore: new ConversationsStore({ conversations })
  });
  return flux;
}

describe("ConversationsStore", () => {

  it("should initialize with an empty state", () => {
    const flux = initFlux();
    const store = flux.store("ConversationsStore");
    expect(store.getState()).to.have.property("conversations");
    expect(store.getState().conversations).to.eql({});
  });

  it("should initialize with conversations", () => {
    const flux = initFlux({ 1: "foo" });
    const store = flux.store("ConversationsStore");
    expect(store.getState().conversations).to.have.property("1");
  });

  it("should get a conversation by id", () => {
    const flux = initFlux({ "abc": "foo"});
    const store = flux.store("ConversationsStore");
    expect(store.get("abc")).to.equal("foo");
  });

  it("should get a conversation by multiple ids", () => {
    const flux = initFlux({ "abc": "foo", "def": "bar" });
    const store = flux.store("ConversationsStore");
    expect(store.getConversations(["abc", "def"])).to.eql(
      [ "foo", "bar" ]
    );
  });

  it("should get a draft", () => {
    const flux = initFlux({ "abc": { draft: "foo"} });
    const store = flux.store("ConversationsStore");
    expect(store.getDraft("abc")).to.equal("foo");
  });

  it("should get the previous url", () => {
    const flux = initFlux({ "abc": { previous: "foo"} });
    const store = flux.store("ConversationsStore");
    expect(store.getPreviousUrl("abc")).to.equal("foo");
  });

  it("should serialize its state", () => {
    const flux = initFlux({ "abc": { foo: "bar"} });
    const store = flux.store("ConversationsStore");
    expect(store.serialize()).to.equal(`{"conversations":{"abc":{"foo":"bar"}}}`);
  });

  it("should hydrate from JSON", () => {
    const flux = initFlux();
    const store = flux.store("ConversationsStore");
    store.hydrate(`{"conversations":{"abc":{"foo":"bar"}}}`);
    expect(store.getState()).to.eql({ conversations: { abc: { foo: "bar" } } });
  });

  describe("when receving actions", () => {

    it("should handle a draft change", () => {
      const flux = initFlux({ "abc": { } });
      const store = flux.store("ConversationsStore");
      const spy = sinon.spy(store, "emit");

      flux.dispatcher.dispatch({
        type: actionTypes.CONVERSATION_DRAFT_CHANGE,
        payload: { id: "abc", draft: "foo"}
      });

      expect(store.getState().conversations["abc"].draft).to.equal("foo");
      expect(spy).to.have.been.calledWith("change");
    });

    it("should handle the load of conversations", () => {
      const flux = initFlux({ A: {id: "A"}, B: {id: "B", bar: true} });
      const store = flux.store("ConversationsStore");
      const spy = sinon.spy(store, "emit");

      flux.dispatcher.dispatch({
        type: LOAD_CONVERSATIONS_SUCCESS,
        payload: {
          results: [{ id: "B", bar: false }, { id: "C" }]
        }
      });
      const state = store.getState();
      expect(state.conversations).to.eql({
        A: {id: "A"},
        B: {id: "B", didLoad: true, bar: false},
        C: {id: "C", didLoad: true }
      });
      expect(spy).to.have.been.calledWith("change");
    });


    it("should handle loading messages start", () => {
      const flux = initFlux({ "abc": { foo: "bar" } });
      const store = flux.store("ConversationsStore");
      const spy = sinon.spy(store, "emit");

      flux.dispatcher.dispatch({
        type: actionTypes.LOAD_MESSAGES,
        payload: { id: "abc" }
      });

      expect(store.get("abc").loading).to.be.true;
      expect(store.get("abc").foo).to.equal("bar");
      expect(spy).to.have.been.calledWith("change");
    });

    it("should handle loading previous messages start", () => {
      const flux = initFlux({ "abc": { foo: "bar" } });
      const store = flux.store("ConversationsStore");
      const spy = sinon.spy(store, "emit");

      flux.dispatcher.dispatch({
        type: actionTypes.LOAD_PREVIOUS_MESSAGES,
        payload: { id: "abc" }
      });

      expect(store.get("abc").loadingPrevious).to.be.true;
      expect(store.get("abc").foo).to.equal("bar");
      expect(spy).to.have.been.calledWith("change");
    });

    it("should handle loading next messages start", () => {
      const flux = initFlux({ "abc": { foo: "bar" } });
      const store = flux.store("ConversationsStore");
      const spy = sinon.spy(store, "emit");

      flux.dispatcher.dispatch({
        type: actionTypes.LOAD_NEXT_MESSAGES,
        payload: { id: "abc" }
      });

      expect(store.get("abc").loadingNext).to.be.true;
      expect(store.get("abc").foo).to.equal("bar");
      expect(spy).to.have.been.calledWith("change");
    });

    it("should handle loading messages failures", () => {
      const flux = initFlux({ "abc": { loading: true } });
      const store = flux.store("ConversationsStore");
      const spy = sinon.spy(store, "emit");

      flux.dispatcher.dispatch({
        type: actionTypes.LOAD_MESSAGES_FAILURE,
        payload: { error: "foo", id: "abc" }
      });

      expect(store.get("abc").loading).to.be.false;
      expect(store.get("abc").error).to.equal("foo");
      expect(spy).to.have.been.calledWith("change");
    });

    it("should handle the default batch of loaded messages", () => {
      const flux = initFlux({ "abc": { loading: true, error: true } });
      const store = flux.store("ConversationsStore");
      sinon.stub(store, "waitFor", (store, done) => done());
      const spy = sinon.spy(store, "emit");

      flux.dispatcher.dispatch({
        type: actionTypes.LOAD_MESSAGES_SUCCESS,
        payload: {
          id: "abc",
          results: [{ id: "foo" }, { id: "bar" }],
          previous: "previous_url",
          next: "next_url"
        }
      });
      const conversation = store.get("abc");
      expect(conversation.error).to.be.null;
      expect(conversation.unread_messages_count).to.equal(0);
      expect(conversation.loading).to.be.false;
      expect(conversation.didLoadMessages).to.be.true;
      expect(conversation.previous).to.equal("previous_url");
      expect(conversation.next).to.equal("next_url");
      expect(conversation.messageIds).to.eql(["foo", "bar"]);
      expect(spy).to.have.been.calledWith("change");
    });


    it("should handle the previous batch of loaded messages", () => {
      const flux = initFlux({ "abc": { loading: true, messageIds: ["foo"] } });
      const store = flux.store("ConversationsStore");
      sinon.stub(store, "waitFor", (store, done) => done());
      const spy = sinon.spy(store, "emit");

      flux.dispatcher.dispatch({
        type: actionTypes.LOAD_MESSAGES_SUCCESS,
        payload: {
          id: "abc",
          results: [{ id: "bar" }],
          previous: null
        }
      });
      const conversation = store.get("abc");
      expect(conversation.loading).to.be.false;
      expect(conversation.previous).to.equal(null);
      expect(conversation.messageIds).to.eql(["bar", "foo"]);
      expect(spy).to.have.been.calledWith("change");
    });

    it("should handle the next batch of loaded messages", () => {
      const flux = initFlux({ "abc": { messageIds: ["foo"] } });
      const store = flux.store("ConversationsStore");
      sinon.stub(store, "waitFor", (store, done) => done());
      const spy = sinon.spy(store, "emit");

      flux.dispatcher.dispatch({
        type: actionTypes.LOAD_MESSAGES_SUCCESS,
        payload: {
          id: "abc",
          results: [{ id: "bar" }],
          next: "next_url"
        }
      });
      const conversation = store.get("abc");
      expect(conversation.loading).to.be.false;
      expect(conversation.next).to.equal("next_url");
      expect(conversation.messageIds).to.eql(["foo", "bar"]);
      expect(spy).to.have.been.calledWith("change");
    });

    it("should handle the a reply start", () => {
      const flux = initFlux({ "abc": { messageIds: ["foo"], draft: "a text", messages_count: 1 } });
      const store = flux.store("ConversationsStore");
      sinon.stub(store, "waitFor", (store, done) => done());
      const spy = sinon.spy(store, "emit");

      flux.dispatcher.dispatch({
        type: REPLY_CONVERSATION,
        payload: {
          conversationId: "abc",
          message: { id: "bar", created_at: 100 }
        }
      });
      const conversation = store.get("abc");
      expect(conversation.draft).to.be.null;
      expect(conversation.messageIds).to.eql(["foo", "bar"]);
      expect(conversation.modified_at).to.equal(100);
      expect(conversation.messages_count).to.equal(2);
      expect(spy).to.have.been.calledWith("change");
    });

    it("should handle a reply success", () => {
      const flux = initFlux({ "abc": { messageIds: ["foo", "temp"], messages_count: 2 } });
      const store = flux.store("ConversationsStore");
      sinon.stub(store, "waitFor", (store, done) => done());
      const spy = sinon.spy(store, "emit");

      flux.dispatcher.dispatch({
        type: REPLY_CONVERSATION_SUCCESS,
        payload: {
          conversationId: "abc",
          tempMessageId: "temp",
          message: { id: "newId", created_at: 100 }
        }
      });
      const conversation = store.get("abc");
      expect(conversation.messageIds).to.eql(["foo", "newId"]);
      expect(conversation.messages_count).to.equal(2);
      expect(conversation.last_message).to.eql({ id: "newId", created_at: 100});
      expect(spy).to.have.been.calledWith("change");
    });

    it("should emit a change after reply failures", () => {
      const flux = initFlux({ "abc": { messageIds: ["foo", "temp"], messages_count: 2 } });
      const store = flux.store("ConversationsStore");
      sinon.stub(store, "waitFor", (store, done) => done({status: 500}));
      const spy = sinon.spy(store, "emit");
      flux.dispatcher.dispatch({
        type: REPLY_CONVERSATION_FAILURE
      });
      expect(spy).to.have.been.calledWith("change");
    });

    it("should handle a pushed message", () => {
      const flux = initFlux({ "abc": { messageIds: ["foo"], messages_count: 1 } });
      const store = flux.store("ConversationsStore");
      sinon.stub(store, "waitFor", (store, done) => done());
      const spy = sinon.spy(store, "emit");
      const message = { id: "bar", conversation_id: "abc" };
      flux.dispatcher.dispatch({
        type: NEW_PUSHED_MESSAGE,
        payload: message
      });
      const conversation = store.get("abc");
      expect(conversation.messageIds).to.eql(["foo", "bar"]);
      expect(conversation.last_message).to.eql(message);
      expect(conversation.messages_count).to.eql(2);
      expect(spy).to.have.been.calledWith("change");
    });

    it("should skip a pushed message that already exists", () => {
      const flux = initFlux({
        "abc": {
          messageIds: ["foo", "bar"],
          messages_count: 2,
          last_message: "bar"
        }
      });
      const store = flux.store("ConversationsStore");
      sinon.stub(store, "waitFor", (store, done) => done());
      const spy = sinon.spy(store, "emit");
      const message = { id: "foo", conversation_id: "abc" };
      flux.dispatcher.dispatch({
        type: NEW_PUSHED_MESSAGE,
        payload: message
      });
      const conversation = store.get("abc");
      expect(conversation.messageIds).to.eql(["foo", "bar"]);
      expect(conversation.last_message).to.eql("bar");
      expect(conversation.messages_count).to.eql(2);
      expect(spy).to.not.have.been.called;
    });

    it("should handle the delete conversation start", () => {
      const flux = initFlux({ "abc": { messageIds: ["foo"] } });
      const store = flux.store("ConversationsStore");
      const spy = sinon.spy(store, "emit");

      flux.dispatcher.dispatch({
        type: actionTypes.DELETE_CONVERSATION,
        payload: { id: "abc", deletingError: "a previous error" }
      });
      const conversation = store.get("abc");
      expect(conversation.isDeleting).to.be.true;
      expect(conversation.deletingError).to.not.be.defined;
      expect(spy).to.have.been.calledWith("change");
    });

    it("should handle a delete conversation success", () => {
      const flux = initFlux({ "abc": { messageIds: ["foo"] } });
      const store = flux.store("ConversationsStore");
      const spy = sinon.spy(store, "emit");

      flux.dispatcher.dispatch({
        type: actionTypes.DELETE_CONVERSATION_SUCCESS,
        payload: { id: "abc" }
      });
      const conversation = store.get("abc");
      expect(conversation).to.not.be.defined;
      expect(spy).to.have.been.calledWith("change");
    });

    it("should handle a delete conversation failure", () => {
      const flux = initFlux({ "abc": { messageIds: ["foo"], isDeleting: true } });
      const store = flux.store("ConversationsStore");
      const spy = sinon.spy(store, "emit");

      flux.dispatcher.dispatch({
        type: actionTypes.DELETE_CONVERSATION_FAILURE,
        payload: { id: "abc", error: "an error" }
      });
      const conversation = store.get("abc");
      expect(conversation.isDeleting).to.be.false;
      expect(conversation.deletingError).to.equal("an error");
      expect(spy).to.have.been.calledWith("change");
    });

    it("should handle logout", () => {
      const flux = initFlux({
        A: { id: "A", conversation_id: "foo" },
        B: { id: "B", conversation_id: "bar" },
        C: { id: "C", conversation_id: "foo" }
      });
      const store = flux.store("ConversationsStore");
      flux.dispatcher.dispatch({
        type: LOGOUT
      });
      expect(store.getState().conversations).to.eql({});
    });


  });


});
