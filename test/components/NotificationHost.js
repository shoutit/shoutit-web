import React from "react";
import TestUtils from "react-addons-test-utils";
import shallowHelpers from "react-shallow-renderer-helpers";
import { expect } from "chai";

import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import NotificationHost from "../../app/shared/components/notifications/NotificationHost.jsx";

describe("NotificationHost", () => {
  let output;

  before(() => {
    const shallowRenderer = TestUtils.createRenderer();
    const notifications = [{id: "1", message: "Hello"}, {id: "2", message: "Goodbye!"}];

    shallowRenderer.render(<NotificationHost notifications={ notifications } />);
    output = shallowRenderer.getRenderOutput();
  });

  it("should render a div with NotificationHost class", () => {
    const target = shallowHelpers.findClass(output, "NotificationHost");
    expect(output.type).to.equal("div");
    expect(target).to.exist;
  });

  it("should render all the notifications", () => {
    const target = shallowHelpers.filter(output, c =>
      c.props && c.props.className === "NotificationHost-notification"
    );
    expect(target).to.have.length(2);
  });

  it("should render all the messages", () => {
    const firstMsg = shallowHelpers.filter(output, c =>
      c.props && c.props.children === "Hello"
    );
    const secondMsg = shallowHelpers.filter(output, c =>
      c.props && c.props.children === "Goodbye!"
    );

    expect(firstMsg).to.be.ok;
    expect(secondMsg).to.be.ok;
  });

  it("should use ReactCSSTransitionGroup", () => {
    const target = shallowHelpers.findType(output, ReactCSSTransitionGroup);

    expect(target).to.exist;
    expect(target.props.transitionName).to.equal("notification");
  });

  it("should have close button for every notification", () => {
    const target = shallowHelpers.filter(output, c =>
      c.props && c.props.className === "NotificationHost-closeButton"
    );

    expect(target).to.have.length(2);
    expect(target[0].props.children).to.equal("X");
    expect(target[1].props.children).to.equal("X");
  });

});
