import React from "react";
import TestUtils from "react-addons-test-utils";
import shallowHelpers from "react-shallow-renderer-helpers";
import { expect } from "chai";

// For type checking
import TagList from "../../app/shared/components/general/TagList.jsx";
import CountryFlag from "../../app/shared/components/helper/CountryFlag.jsx";
import CategoryIcon from "../../app/shared/components/helper/CategoryIcon.jsx";

// component to be tested
import ShoutPreview from "../../app/shared/components/shout/ShoutPreview.jsx";

// sample API shout object
const shoutMockData = {
  "id": "ac2d9694-e1c3-41a0-b4b5-65f179d6a37b",
  "location": {
    "country": "AE",
    "state": "DUBAI",
    "city": "DUBAI"
  },
  "title": "Test Title",
  "text": "Test Description",
  "price": 2000,
  "currency": "Dhm",
  "thumbnail": "https://shout-image.static.shoutit.com/61b56666-91ca-4dc7-b692-5334c89d486f-1455996177994.jpg",
  "user": {
    "name": "user 15805165990",
  },
  "date_published": 1455996200,
  "category": {
    "name": "Jobs",
    "slug": "jobs",
    "icon": "https://tag-image.static.shoutit.com/categories/jobs-i.png",
    "image": "https://tag-image.static.shoutit.com/8e93edd1-2301-4382-a929-3614fd3cc72e-jobs.jpg",
  },
  "filters": [
    {
      "id": "43fc3e63-7924-4fa3-9830-1839f73d1e1b",
      "name": "engineering",
      "api_url": "https://api.shoutit.com/v2/tags/engineering",
      "image": "https://tag-image.static.shoutit.com/default.jpg"
    },
    {
      "id": "7af16a17-ee42-460a-aa1a-0cd99b7301f8",
      "name": "jobs",
      "api_url": "https://api.shoutit.com/v2/tags/jobs",
      "image": "https://tag-image.static.shoutit.com/8e93edd1-2301-4382-a929-3614fd3cc72e-jobs.jpg"
    }
  ]
};

describe("ShoutPreview ", function() {

  it("should render a div", function() {
    const shallowRenderer = TestUtils.createRenderer();
    shallowRenderer.render(<ShoutPreview shout={ shoutMockData } index="0"  />);

    const result = shallowRenderer.getRenderOutput();
    expect(result.type).to.equal("div");
  });

  describe("In gridView", function() {
    let result;

    before(function(done) {
      const shallowRenderer = TestUtils.createRenderer();
      shallowRenderer.render(<ShoutPreview shout={ shoutMockData } index="0" gridView />);
      result = shallowRenderer.getRenderOutput();
      done();
    });

    it("should render a gridView", function() {
      const shoutHolder = result.props.children.props.children;
      expect(shoutHolder.props.className).to.equal("ShoutGridview");
    });

    it("should have a title", function() {
      const target = shallowHelpers.findClass(result, "ShoutGridview-title");
      expect(target).to.exist;
      expect(target.type).to.equal("h3");
      expect(target.props.children).to.not.be.null;
    });

    it("should have a subtitle", function() {
      const target = shallowHelpers.findClass(result, "ShoutGridview-subtitle");
      expect(target).to.exist;
      expect(target.type).to.equal("span");
    });

    it("should have a price", function() {
      const target = shallowHelpers.findClass(result, "ShoutGridview-price");
      expect(target).to.exist;
      expect(target.type).to.equal("span");
    });
  });

  describe("In non-gridView", function() {
    let result;
    before(function(done) {
      const shallowRenderer = TestUtils.createRenderer();
      shallowRenderer.render(<ShoutPreview shout={ shoutMockData } index="0" />);
      result = shallowRenderer.getRenderOutput();
      done();
    });

    it("should render a Grid with ShoutPreview class", function() {
      const target = shallowHelpers.findClass(result, "ShoutPreview");
      expect(target).to.be.ok;
      expect(target.type.displayName).to.equal("Grid");
    });

    it("should have 4 children", function() {
      const target = shallowHelpers.findClass(result, "ShoutPreview");
      expect(target.props.children).to.have.length(4);
    });

    it("should render a heading", function() {
      const target = shallowHelpers.findClass(result, "ShoutPreview-heading");
      expect(target).to.be.ok;
      expect(target.type).to.equal("div");
    });

    it("should render a caption inside a Grid", function() {
      const target = shallowHelpers.findClass(result, "ShoutPreview-caption");

      expect(target).to.exist;
      expect(target.type.displayName).to.equal("Grid");
    });

    it("should render an image from shout", function() {
      const target = shallowHelpers.findClass(result, "ShoutPreview-image");

      expect(target.type).to.equal("div");
      expect(target.props.className).to.equal("ShoutPreview-image");
      expect(target.props.style.backgroundImage).to.exist;
    });

    it("should render shout description", function() {
      const target = shallowHelpers.findClass(result, "ShoutPreview-text");

      expect(target).to.be.ok;
      expect(target.type).to.equal("p");
    });

    it("should render tags", function() {
      const target = shallowHelpers.findType(result, TagList);

      expect(target).to.be.ok;
      expect(target.props.tags).to.exist;
    });

    it("should render country flag", function() {
      const target = shallowHelpers.findType(result, CountryFlag);

      expect(target).to.be.ok;
      expect(target.props.code).to.exist;
      expect(target.props.size).to.exist;
    });

    it("should render category icon", function() {
      const target = shallowHelpers.findType(result, CategoryIcon);

      expect(target).to.be.ok;
      expect(target.props.slug).to.exist;
      expect(target.props.tooltip).to.exist;
      expect(target.props.icon).to.exist;
    });

  });
});
