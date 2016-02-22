import chai, { expect } from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";

import { UINotificationsStore } from "../../app/shared/stores/ui_notifications/UINotificationsStore";
import { LISTEN_SUCCESS, STOP_LISTEN_SUCCESS } from "../../app/shared/stores/users/consts";

import { Flux } from "fluxxor";

chai.use(sinonChai);

function initFlux() {
  const flux = new Flux({
    UINotificationsStore: new UINotificationsStore()
  });
  return flux;
}

describe("UINotifications Store", function() {
  it("should initialize with empty notifications", () => {
    const flux = initFlux();
    const store = flux.store("UINotificationsStore");
    expect(store.state).to.have.property("notifications");
    expect(store.state.notifications).to.deep.equal({});
  });

  it("should serialize the state", function() {
    const flux = initFlux();
    const store = flux.store("UINotificationsStore");
    store.state.notifications = {check: { toSee: "It Works"}};
    expect(store).to.include.keys("serialize");
    expect(store.serialize()).to.equal(`{"notifications":{"check":{"toSee":"It Works"}}}`);
  });

  it("should hydrate the state", function() {
    const flux = initFlux();
    const store = flux.store("UINotificationsStore");
    const sampleJSON = `{"notifications":{"check":{"toSee":"It Works"}}}`;
    expect(store.hydrate(sampleJSON)).to.deep.equal({
      notifications: {
        check: {
          toSee: "It Works"
        }
      }
    });
  });

});
