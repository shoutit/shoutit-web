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
    const notifications = [
      {id: "1", content: "Hello"},
      {id: "2", content: "Goodbye!"}
    ];

    shallowRenderer.render(<NotificationHost notifications={ notifications } />);
    output = shallowRenderer.getRenderOutput();
  });

  it("should render correctly", () => {
    const root = shallowHelpers.findClass(output, "NotificationHost");
    expect(root).to.exist;
  });

  it("should use ReactCSSTransitionGroup", () => {
    const transitionGroup = shallowHelpers.findType(output, ReactCSSTransitionGroup);

    expect(transitionGroup).to.exist;
    expect(transitionGroup.props.transitionName).to.equal("notification");
  });

});
