/* eslint no-console: 0 */

import { expect } from "chai";
import { get } from "../../app/utils/request";

describe("request", () => {

  it("should set authorization header from session object", () => {
    const request = get("/foo").setSession({ accessToken: "foo" });
    expect(request.header.authorization).to.equal("Bearer foo");
  });

  it("should prefix the url", () => {
    const request = get("/foo").prefix("http://example.com");
    expect(request.url).to.equal("http://example.com/foo");
  });

});
