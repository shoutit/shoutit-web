import React from "react";
import TestUtils from "react-addons-test-utils";
import shallowHelpers from "react-shallow-renderer-helpers";
import { expect } from "chai";

import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import NotificationHost from "../../app/shared/components/notifications/NotificationHost.jsx";
import Notification from "../../app/shared/components/notifications/Notification.jsx";

describe("NotificationHost", () => {
  let output;

  before(() => {
    const shallowRenderer = TestUtils.createRenderer();
    const notifications = [
      {id: "1", content: "Hello"},
      {id: "2", content: "Goodbye!"}
    ];

    shallowRenderer.render(<NotificationHost notifications={ notifications } />);
    output = shallowRenderer.getRenderOutput();
  });

  it("should render correctly", () => {
    const root = shallowHelpers.findClass(output, "NotificationHost");
    const wrapper = shallowHelpers.findClass(output, "NotificationHost-wrapper");
    expect(root).to.exist;
    expect(wrapper).to.exist;
  });

  it("should render all the notifications", () => {
    const target = shallowHelpers.filter(output, el => el.type === Notification);
    expect(target).to.have.length(2);
  });

  it("should use ReactCSSTransitionGroup", () => {
    const transitionGroup = shallowHelpers.findType(output, ReactCSSTransitionGroup);

    expect(transitionGroup).to.exist;
    expect(transitionGroup.props.transitionName).to.equal("notification");
  });

});
