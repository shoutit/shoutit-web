import chai, { expect } from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";

import { Flux } from "fluxxor";

import VideoCallsStore from "./VideoCallsStore";
import * as actions from "../actions/actionTypes";

chai.use(sinonChai);

function initFlux(storeParams) {
  const flux = new Flux({
    VideoCallsStore: new VideoCallsStore(storeParams)
  });
  return flux;
}

describe("VideoCallsStore", () => {

  it("should initialize with an empty state", () => {
    const flux = initFlux();
    const store = flux.store("VideoCallsStore");
    expect(store.getState()).to.have.property("token");
    expect(store.getState()).to.have.property("initError");
    expect(store.getState().token).to.be.null;
    expect(store.getState().initError).to.be.null;
  });

  describe("when receving actions", () => {

    it("should handle the a received token", () => {
      const flux = initFlux();
      const store = flux.store("VideoCallsStore");
      const spy = sinon.spy(store, "emit");

      flux.dispatcher.dispatch({
        type: actions.TWILIO_INIT_SUCCESS,
        payload: { token: "foo", identity: "bar"}
      });
      const state = store.getState();
      expect(state.token).to.eql("foo");
      expect(state.identity).to.eql("bar");
      expect(spy).to.have.been.calledWith("change");
    });

    it("should handle a sending failure", () => {
      const flux = initFlux();
      const store = flux.store("VideoCallsStore");
      const spy = sinon.spy(store, "emit");

      flux.dispatcher.dispatch({
        type: actions.TWILIO_INIT_FAILURE,
        payload: {
          error: "bar"
        }
      });
      const state = store.getState();
      expect(state.initError).to.eql("bar");
      expect(spy).to.have.been.calledWith("change");
    });

  });

});
