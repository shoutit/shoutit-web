import chai, { expect } from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";

import { Flux } from "fluxxor";

import { VideoCallStore } from "../../app/shared/stores/video_call/VideoCallStore";
import * as actionTypes from "../../app/shared/stores/video_call/actionTypes";

chai.use(sinonChai);

function initFlux() {
  const flux = new Flux({
    VideoCallStore: new VideoCallStore()
  });
  return flux;
}

describe("VideoCallStore", () => {

  it("should initialize with an empty state", () => {
    const flux = initFlux();
    const store = flux.store("VideoCallStore");
    expect(store.getState()).to.have.property("token");
    expect(store.getState()).to.have.property("tokenError");
    expect(store.getState().token).to.be.null;
    expect(store.getState().tokenError).to.be.null;
  });

  describe("when receving actions", () => {

    it("should handle the a received token", () => {
      const flux = initFlux();
      const store = flux.store("VideoCallStore");
      const spy = sinon.spy(store, "emit");

      flux.dispatcher.dispatch({
        type: actionTypes.TWILIO_TOKEN_SUCCESS,
        payload: "foo"
      });
      const state = store.getState();
      expect(state.token).to.eql("foo");
      expect(spy).to.have.been.calledWith("change");
    });

    it("should handle a sending failure", () => {
      const flux = initFlux();
      const store = flux.store("VideoCallStore");
      const spy = sinon.spy(store, "emit");

      flux.dispatcher.dispatch({
        type: actionTypes.TWILIO_TOKEN_FAILURE,
        payload: {
          error: "bar"
        }
      });
      const state = store.getState();
      expect(state.tokenError).to.eql("bar");
      expect(spy).to.have.been.calledWith("change");
    });

  });

});
