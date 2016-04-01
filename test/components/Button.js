import React from "react";
import TestUtils from "react-addons-test-utils";
import { Link } from "react-router";
import { expect } from "chai";

import Button from "../../app/shared/components/helper/Button.js";

describe("Button", () => {

  it("should render a button", () => {
    const shallowRenderer = TestUtils.createRenderer();
    shallowRenderer.render(<Button />);

    const output = shallowRenderer.getRenderOutput();
    expect(output.props.className).to.include("Button");
    expect(output.props.className).to.not.include("primary");
    expect(output.props.className).to.not.include("secondary");
    expect(output.props.className).to.not.include("outline");
    expect(output.props.className).to.not.include("destructive");
    expect(output.props.className).to.not.include("disabled");
    expect(output.type).to.equal("button");
  });

  it("should render a primary button", () => {
    const shallowRenderer = TestUtils.createRenderer();
    shallowRenderer.render(<Button primary />);

    const output = shallowRenderer.getRenderOutput();
    expect(output.props.className).to.include("Button");
    expect(output.props.className).to.include("primary");
  });

  it("should render a secondary button", () => {
    const shallowRenderer = TestUtils.createRenderer();
    shallowRenderer.render(<Button secondary />);

    const output = shallowRenderer.getRenderOutput();
    expect(output.props.className).to.include("Button");
    expect(output.props.className).to.include("secondary");
  });

  it("should render a outline button", () => {
    const shallowRenderer = TestUtils.createRenderer();
    shallowRenderer.render(<Button outline />);

    const output = shallowRenderer.getRenderOutput();
    expect(output.props.className).to.include("Button");
    expect(output.props.className).to.include("outline");
  });

  it("should render a destructive button", () => {
    const shallowRenderer = TestUtils.createRenderer();
    shallowRenderer.render(<Button destructive />);

    const output = shallowRenderer.getRenderOutput();
    expect(output.props.className).to.include("Button");
    expect(output.props.className).to.include("destructive");
  });

  it("should use label prop as child", () => {
    const shallowRenderer = TestUtils.createRenderer();
    shallowRenderer.render(<Button label="foo">bar</Button>);

    const output = shallowRenderer.getRenderOutput();
    expect(output.props.children[1].props.children).to.equal("foo");
  });

  it("should accept a leftIcon element", () => {
    const shallowRenderer = TestUtils.createRenderer();
    shallowRenderer.render(<Button leftIcon={ <p>foo</p> }>bar</Button>);

    const output = shallowRenderer.getRenderOutput();
    expect(output.props.children[0].type).to.equal("span");
    expect(output.props.children[0].props.className).to.equal("Button-icon");
    expect(output.props.children[1]).to.equal("bar");
  });

  it("should accept classNames", () => {
    const shallowRenderer = TestUtils.createRenderer();
    shallowRenderer.render(<Button className="foo" />);

    const output = shallowRenderer.getRenderOutput();
    expect(output.props.className).to.equal("Button foo");
  });

  it("should render react-router links", () => {
    const shallowRenderer = TestUtils.createRenderer();
    shallowRenderer.render(<Button to="/" />);

    const output = shallowRenderer.getRenderOutput();
    const { type } = output;
    expect(type).to.equal(Link);
  });

  it("should render anchor elements when href is specified", () => {
    const shallowRenderer = TestUtils.createRenderer();
    shallowRenderer.render(<Button href="/" tabIndex={10} />);

    const output = shallowRenderer.getRenderOutput();
    expect(output.type).to.equal("a");
    expect(output.props.tabIndex).to.equal(10);
  });

});
