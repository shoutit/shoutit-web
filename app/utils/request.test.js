/* eslint no-console: 0 */
/* eslint-env mocha */

import { expect } from "chai";
import request from "./request";

describe("request", () => {

  it("should set authorization header from session object", () => {
    const req = request.get("/foo").setSession({ accessToken: "foo" });
    expect(req.header.authorization).to.equal("Bearer foo");
  });

  it("should prefix the url", () => {
    const req = request.get("/foo").prefix("http://example.com");
    expect(req.url).to.equal("http://example.com/foo");
  });

});
