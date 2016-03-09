/* eslint-env mocha */

import { expect } from "chai";
import { createLinkToGoogleMaps } from "./GoogleMapsUtils";

describe("GoogleMapsUtils", () => {
  describe("createLinkToGoogleMaps", () => {

    it("should include latitude and longitude", () => {
      const url = createLinkToGoogleMaps({latitude: 1, longitude: 2});
      expect(url).to.equal("https://www.google.com/maps?&ll=1,2");
    });

    it("should include address", () => {
      const url = createLinkToGoogleMaps({address: "foo bar"});
      expect(url).to.equal("https://www.google.com/maps?&q=foo%20bar");
    });

    it("should include address, city", () => {
      const url = createLinkToGoogleMaps({address: "foo", city: "baz bar"});
      expect(url).to.equal("https://www.google.com/maps?&q=foo,%20baz%20bar");
    });

    it("should include address, city, state", () => {
      const url = createLinkToGoogleMaps({address: "foo", city: "foo", state: "bar"});
      expect(url).to.equal("https://www.google.com/maps?&q=foo,%20foo,%20bar");
    });

    it("should include address, city, state, postal code", () => {
      const url = createLinkToGoogleMaps({address: "foo", city: "foo", state: "foo", postal_code: 2000});
      expect(url).to.equal("https://www.google.com/maps?&q=foo,%20foo,%20foo,%202000");
    });

    it("should include address, city, state, postal code, country", () => {
      const url = createLinkToGoogleMaps({address: "foo", city: "foo", state: "foo", postal_code: 2000, country: "IT"});
      expect(url).to.equal("https://www.google.com/maps?&q=foo,%20foo,%20foo,%202000,%20IT");
    });

  });
});
