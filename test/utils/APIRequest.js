/* eslint no-console: 0 */

import { expect } from "chai";
import APIRequest from "../../app/utils/APIRequest";

describe("APIRequest", () => {

  it("should set a session object", () => {
    const request = APIRequest.get("/foo").setSession("foo");
    expect(request.session).to.equal("foo");
  });

});
