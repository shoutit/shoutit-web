import chai, { expect } from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";

import { Flux } from "fluxxor";

import { MessagesStore } from "../../app/shared/stores/messages/MessagesStore";
import * as actionTypes from "../../app/shared/stores/messages/actionTypes";

import {
  LOAD_MESSAGES_SUCCESS
} from "../../app/shared/stores/conversations/actionTypes";

chai.use(sinonChai);

function initFlux(messages) {
  const flux = new Flux({
    MessagesStore: new MessagesStore({ messages })
  });
  return flux;
}

describe("MessagesStore", () => {

  it("should initialize with an empty state", () => {
    const flux = initFlux();
    const store = flux.store("MessagesStore");
    expect(store.getState()).to.have.property("messages");
    expect(store.getState().messages).to.eql({});
  });

  it("should initialize with messages", () => {
    const flux = initFlux({ "abc": "foo" });
    const store = flux.store("MessagesStore");
    expect(store.getState().messages).to.have.property("abc");
  });

  it("should get a message by id", () => {
    const flux = initFlux({ "abc": "foo"});
    const store = flux.store("MessagesStore");
    expect(store.get("abc")).to.equal("foo");
  });

  it("should get a message by multiple ids", () => {
    const flux = initFlux({ "abc": "foo", "def": "bar" });
    const store = flux.store("MessagesStore");
    expect(store.getMessages(["abc", "def"])).to.eql(
      [ "foo", "bar" ]
    );
  });

  it("should serialize its state", () => {
    const flux = initFlux({ "abc": { foo: "bar"} });
    const store = flux.store("MessagesStore");
    expect(store.serialize()).to.equal(`{"messages":{"abc":{"foo":"bar"}}}`);
  });

  it("should hydrate from JSON", () => {
    const flux = initFlux();
    const store = flux.store("MessagesStore");
    store.hydrate(`{"messages":{"abc":{"foo":"bar"}}}`);
    expect(store.getState()).to.eql({ messages: { abc: { foo: "bar" } } });
  });

  describe("when receving actions", () => {

    it("should handle the load of messages", () => {
      const flux = initFlux({ A: {id: "A"}, B: {id: "B", bar: true} });
      const store = flux.store("MessagesStore");
      const spy = sinon.spy(store, "emit");

      flux.dispatcher.dispatch({
        type: LOAD_MESSAGES_SUCCESS,
        payload: {
          results: [{ id: "B", bar: false }, { id: "C" }]
        }
      });
      const state = store.getState();
      expect(state.messages).to.eql({
        A: {id: "A"},
        B: {id: "B", bar: false},
        C: {id: "C"}
      });
      expect(spy).to.have.been.calledWith("change");
    });

    it("should handle starting to send a message", () => {
      const flux = initFlux();
      const store = flux.store("MessagesStore");
      const spy = sinon.spy(store, "emit");

      flux.dispatcher.dispatch({
        type: actionTypes.SEND_MESSAGE,
        payload: {
          message: { id: "temp", text: "bar" }
        }
      });
      const message = store.get("temp");
      expect(message).to.be.defined;
      expect(message.sending).to.be.true;
      expect(spy).to.have.been.calledWith("change");

    });

    it("should handle a sent message", () => {
      const flux = initFlux({ temp: { text: "a message", sending: true } });
      const store = flux.store("MessagesStore");
      const spy = sinon.spy(store, "emit");

      flux.dispatcher.dispatch({
        type: actionTypes.SEND_MESSAGE_SUCCESS,
        payload: {
          tempMessageId: "temp",
          message: { id: "A", text: "bar" }
        }
      });
      const tempMessage = store.get("temp");
      const message = store.get("A");
      expect(tempMessage).to.not.be.defined;
      expect(message).to.be.eql({ id: "A", text: "bar" });
      expect(spy).to.have.been.calledWith("change");
    });

    it("should handle a sending failure", () => {
      const flux = initFlux({ temp: { text: "bar", sending: true } });
      const store = flux.store("MessagesStore");
      const spy = sinon.spy(store, "emit");

      flux.dispatcher.dispatch({
        type: actionTypes.SEND_MESSAGE_FAILURE,
        payload: {
          error: "an error",
          message: { id: "temp", text: "bar" }
        }
      });
      const message = store.get("temp");
      expect(message).to.be.eql(
        { text: "bar", sending: false, sendError: "an error" }
      );
      expect(spy).to.have.been.calledWith("change");
    });

  });


});
