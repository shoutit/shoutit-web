import React from "react";
import TestUtils from "react-addons-test-utils";
import shallowHelpers from "react-shallow-renderer-helpers";
import { expect } from "chai";

const locationMock = require("../../assets/fixtures/locationMockData.json");

// for type checking
import GoogleStaticMap from "../../app/shared/components/misc/GoogleStaticMap.jsx";

// component to be tested
import LocationCard from "../../app/shared/components/cards/LocationCard.jsx";

describe("LocationCard", function() {
  const shallowRenderer = TestUtils.createRenderer();
  shallowRenderer.render(
    <LocationCard
      location={ locationMock }
    />
  );
  const result = shallowRenderer.getRenderOutput();

  it("should render a Column component", function() {
    expect(result.type.displayName).to.equal("Column");
  });

  it("should render a .CardBlock class", function() {
    expect(result.props.className).to.contain("CardBlock");
  });

  it("should render a GoogleStaticMap component", function() {
    const target = shallowHelpers.findType(result, GoogleStaticMap);
    expect(target).to.exist;
  });

  it("should pass a valid location prop to GoogleStaticMap component", function() {
    const target = shallowHelpers.findType(result, GoogleStaticMap);
    expect(target.props.location).to.be.an("object");
    expect(target.props.location).to.include.keys("latitude", "longitude", "country", "city", "state", "address");
  });

  it("should show the address from passed location prop", function() {
    const target = shallowHelpers.findClass(result, "LocationCard-addr");
    expect(target).to.exist;
    expect(target.props.children).to.equal(locationMock.address);
  });
});
