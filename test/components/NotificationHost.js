import React from "react";
import TestUtils from "react-addons-test-utils";
import shallowHelpers from "react-shallow-renderer-helpers";
import { expect } from "chai";

// for type checking
import ReactCSSTransitionGroup from "react-addons-css-transition-group";

// component to be tested
import NotificationHost from "../../app/shared/components/helper/NotificationHost.jsx";

describe("NotificationHost", function() {
  let component;

  before(function() {
    const shallowRenderer = TestUtils.createRenderer();
    const dataMock = [{id: "1", message: "Hello"}, {id: "2", message: "Goodbye!"}];

    shallowRenderer.render(<NotificationHost notifications={dataMock} />);
    component = shallowRenderer.getRenderOutput();
  });

  it("should render a div with NotificationHost class", function() {
    const target = shallowHelpers.findClass(component, "NotificationHost");
    expect(component.type).to.equal("div");
    expect(target).to.exist;
  });

  it("should render all the notifications", function() {
    const target = shallowHelpers.filter(component, function(c) {
      return c.props && c.props.className === "NotificationHost-notification";
    });
    expect(target).to.have.length(2);
  });

  it("should render all the messages", function() {
    const firstMsg = shallowHelpers.filter(component, function(c) {
      return c.props && c.props.children === "Hello";
    });
    const secondMsg = shallowHelpers.filter(component, function(c) {
      return c.props && c.props.children === "Goodbye!";
    });

    expect(firstMsg).to.be.ok;
    expect(secondMsg).to.be.ok;
  });

  it("should use ReactCSSTransitionGroup", function() {
    const target = shallowHelpers.findType(component, ReactCSSTransitionGroup);

    expect(target).to.exist;
    expect(target.props.transitionName).to.equal("notification");
  });

  it("should have close button for every notification", function() {
    const target = shallowHelpers.filter(component, function(c) {
      return c.props && c.props.className === "NotificationHost-closeButton";
    });

    expect(target).to.have.length(2);
    expect(target[0].props.children).to.equal("X");
    expect(target[1].props.children).to.equal("X");
  });

});
