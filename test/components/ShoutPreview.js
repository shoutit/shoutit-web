import React from "react";
import TestUtils from "react-addons-test-utils";
import shallowHelpers from "react-shallow-renderer-helpers";
import { expect } from "chai";

import ShoutPreview from "../../app/shared/components/shout/ShoutPreview.jsx";

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
  "tags": [
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

  it("should render a gridview", function() {
    const shallowRenderer = TestUtils.createRenderer();
    shallowRenderer.render(<ShoutPreview shout={ shoutMockData } index="0" gridview={ true } />);

    const result = shallowRenderer.getRenderOutput();
    const shoutHolder = result.props.children.props.children;
    expect(shoutHolder.props.className).to.equal("ShoutGridview");
  });

  describe("In non-gridview", function() {

    it("should render a div with ShoutPreview class", function() {
      const shallowRenderer = TestUtils.createRenderer();
      shallowRenderer.render(<ShoutPreview shout={ shoutMockData } index="0" gridview={ false } />);

      const result = shallowRenderer.getRenderOutput();
      const shoutHolder = result.props.children.props.children;
      expect(shoutHolder.props.className).to.equal("ShoutPreview");
    });

    it("should have 4 children", function() {
      const shallowRenderer = TestUtils.createRenderer();
      shallowRenderer.render(<ShoutPreview shout={ shoutMockData } index="0" gridview={ false } />);

      const result = shallowRenderer.getRenderOutput();
      const shoutHolder = result.props.children.props.children;
      expect(shoutHolder.props.children).to.have.length(4);
    });

    it("should render a heading", function() {
      const shallowRenderer = TestUtils.createRenderer();
      shallowRenderer.render(<ShoutPreview shout={ shoutMockData } index="0" gridview={ false } />);

      const result = shallowRenderer.getRenderOutput();
      const shoutHolder = result.props.children.props.children;

      expect(shoutHolder.props.children[0].type).to.equal("div");
      expect(shoutHolder.props.children[0].props.className).to.equal("ShoutPreview-heading");
    });

    it("should render a caption", function() {
      const shallowRenderer = TestUtils.createRenderer();
      shallowRenderer.render(<ShoutPreview shout={ shoutMockData } index="0" gridview={ false } />);

      const result = shallowRenderer.getRenderOutput();
      const target = shallowHelpers.findClass(result, "ShoutPreview-caption");

      expect(target).to.exist;
      expect(target.type.displayName).to.equal("Grid");
    });

    it("should render an image from shout", function() {
      const shallowRenderer = TestUtils.createRenderer();
      shallowRenderer.render(<ShoutPreview shout={ shoutMockData } index="0" gridview={ false } />);

      const result = shallowRenderer.getRenderOutput();
      const target = shallowHelpers.findClass(result, "ShoutPreview-image");

      expect(target.type).to.equal("div");
      expect(target.props.className).to.equal("ShoutPreview-image");
      expect(target.props.style.backgroundImage).to.exist;
    });

    it("should render shout description", function() {
      const shallowRenderer = TestUtils.createRenderer();
      shallowRenderer.render(<ShoutPreview shout={ shoutMockData } index="0" gridview={ false } />);

      const result = shallowRenderer.getRenderOutput();
      const target = shallowHelpers.findClass(result, "ShoutPreview-text");

      expect(target).to.be.ok;
      expect(target.type).to.equal("p");
    });

  });
});
