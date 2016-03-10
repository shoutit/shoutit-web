/* eslint-env mocha */

import { expect } from "chai";
import { getVariation } from "./APIUtils";

describe("APIUtils", () => {

  describe("getVariation", function() {

    it("should return the 'medium' variation as default", () => {
      const url = "http://example.com/test.image.jpg";
      expect(getVariation(url)).to.equal("http://example.com/test.image_medium.jpg");
    });

    it("should work with any extension or variation", () => {
      const url = "https://user-image.static.shoutit.com/1457599968825_30885ef7-d96a48e0-a75d-513678ffbbc3.png";
      expect(getVariation(url, "foo")).to.equal("https://user-image.static.shoutit.com/1457599968825_30885ef7-d96a48e0-a75d-513678ffbbc3_foo.png");
    });

  });

});
