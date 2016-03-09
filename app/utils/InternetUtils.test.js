/* eslint-env mocha */

import { expect } from "chai";
import { getValidIPv4Address } from "./InternetUtils";

describe("InternetUtils", () => {
  describe("getValidIPv4Address", () => {

    it("should return an IPv4 address", () => {
      const ip = getValidIPv4Address("192.168.0.1");
      expect(ip).to.equal("192.168.0.1");
    });

    it("should work for mixed notations ip addresses", () => {
      const ip = getValidIPv4Address("0:0:0:0:0:0:101.45.75.219");
      expect(ip).to.equal("101.45.75.219");
    });

    it("should work for mixed notations ip addresses (succint)", () => {
      const ip = getValidIPv4Address("::101.45.75.219");
      expect(ip).to.equal("101.45.75.219");
    });

    it("should return empty string when address is something wrong", () => {
      let ip = getValidIPv4Address("booo");
      expect(ip).to.equal("");

      ip = getValidIPv4Address(":101.45.75219");
      expect(ip).to.equal("");
    });

    it("should return empty string for IPv6 addresses", () => {
      const ip = getValidIPv4Address("2001:db8:85a3:0:0:8a2e:370:7334");
      expect(ip).to.equal("");
    });

  });
});
