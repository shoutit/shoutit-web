import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';

import UINotificationsStore from './UINotificationsStore';

import { Flux } from 'fluxxor';

chai.use(sinonChai);

function initFlux() {
  const flux = new Flux({
    UINotificationsStore: new UINotificationsStore(),
  });
  return flux;
}

describe('UINotificationStore', function () {

  it('should initialize correctly', () => {
    const flux = initFlux();
    const store = flux.store('UINotificationsStore');
    expect(store.state).to.have.property('notifications');
    expect(store.state.notifications).to.deep.equal([]);
  });
});
