import React from "react";
import TestUtils from "react-addons-test-utils";
import { expect } from "chai";

import Progress from "../../app/shared/components/helper/Progress.jsx";

describe("Progress", () => {

  it("should render correctly", () => {
    const shallowRenderer = TestUtils.createRenderer();
    shallowRenderer.render(<Progress />);

    const output = shallowRenderer.getRenderOutput();
    const classNames = output.props.className.split(" ");
    expect(classNames).to.include("Progress");
    expect(classNames).to.include("isCenteredHorizontally");
    expect(classNames).to.not.include("isCenteredVertically");

  });

  it("should disable vertical or horizontal alignments", () => {
    const shallowRenderer = TestUtils.createRenderer();
    shallowRenderer.render(<Progress centerVertical={true} centerHorizontal={false} />);

    const output = shallowRenderer.getRenderOutput();
    const classNames = output.props.className.split(" ");
    expect(classNames).to.include("isCenteredVertically");
    expect(classNames).to.not.include("isCenteredHorizontally");
  });

});
