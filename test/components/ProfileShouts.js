import React from "react";
import TestUtils from "react-addons-test-utils";
import shallowHelpers from "react-shallow-renderer-helpers";
import { expect } from "chai";

// component to be tested
import ProfileShouts from "../../app/shared/components/profile/ProfileShouts.jsx";

// For type checking
import ShoutPreview from "../../app/shared/components/shout/ShoutPreview.jsx";
import ViewportSensor from "../../app/shared/components/misc/ViewportSensor.jsx";

// Mock data for shouts list
const shoutObjectMock = require("../../assets/fixtures/shoutMockData.json");
const shoutListMock = {
  [shoutObjectMock.user.username]: {
    list: [],
    loading: false
  }
};

for (let i = 0; i < 15; i++) {
  shoutListMock[shoutObjectMock.user.username].list.push(shoutObjectMock);
}

const shoutEmptyListMock = {
  [shoutObjectMock.user.username]: {
    list: [],
    loading: false,
  },
};

// Mock flux
const fluxMock = {
  actions: {
    loadUserShouts() {},
    loadMoreUserShouts() {},
  },
};

describe("ProfileShouts", function () {
  const shallowRenderer = TestUtils.createRenderer();
  shallowRenderer.render(
    <ProfileShouts
      users={{}}
      flux={ fluxMock }
      shouts={ shoutListMock }
      username={ shoutObjectMock.user.username }
    />
  );
  const result = shallowRenderer.getRenderOutput();

  it("should render a fluid Grid", function () {
    expect(result.type.displayName).to.equal("Grid");
    expect(result.props.fluid).to.be.ok;
  });

  it("should show proper message when there is no shout", function () {
    const shallowRenderer = TestUtils.createRenderer();
    shallowRenderer.render(
      <ProfileShouts
        users={{}}
        flux={ fluxMock }
        shouts={ shoutEmptyListMock }
        username={ shoutObjectMock.user.username }
      />
    );
    const result = shallowRenderer.getRenderOutput();
    const target = shallowHelpers.filter(result, function (c) {
      // TODO: Should be replaced with proper message variable after internationalization
      return c.children === "No shouts posted by this user yet :(";
    });
    expect(target).to.exist;
  });

  it("should render 15 ShoutPreview", function () {
    const target = shallowHelpers.filterType(result, ShoutPreview);
    expect(target).to.have.length(15);
  });

  it("should render ViewportSensor in the end", function () {
    const target = shallowHelpers.findType(result, ViewportSensor);
    expect(target).to.exist;
  });

  describe("should send correct props to ShoutPreview", function () {
    const target = shallowHelpers.findType(result, ShoutPreview);

    it("should send prop key", function () {
      expect(target.key).to.be.a("string");
    });

    it("should send prop shout", function () {
      expect(target.props.shout).to.be.an("object");
      expect(target.props.shout).to.have.property("id");
      expect(target.props.shout.id).to.equal(shoutObjectMock.id);
      expect(target.props.shout).to.have.property("user");
      expect(target.props.shout).to.have.property("category");
      expect(target.props.shout).to.have.property("currency");
    });

    it("should send prop index", function () {
      expect(target.props.index).to.be.a("number");
    });

  });
});
