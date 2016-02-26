import chai, { expect } from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";
import { Request } from "superagent";

import { actions } from "../../app/shared/stores/video_call/actions";
import * as actionTypes from "../../app/shared/stores/video_call/actionTypes";

chai.use(sinonChai);

describe("VideoCallActions", () => {
  let dispatch;

  beforeEach(() => {
    dispatch = sinon.spy();
    actions.dispatch = dispatch;
  });

  afterEach(() => {
    delete actions.dispatch;
  });

  describe("getTwilioToken", () => {

    afterEach(() => Request.prototype.end.restore());

    it("should dispatch on success", () => {
      sinon.stub(Request.prototype, "end", done => done(null, {
        ok: true,
        body: "a_token"
      }));
      actions.getTwilioToken();
      expect(dispatch).to.have.been.calledWith(
        actionTypes.TWILIO_TOKEN_SUCCESS, "a_token"
      );
    });
    //
    // it("should dispatch response on failure", () => {
    //   sinon.stub(Request.prototype, "end", done => done(null, {
    //     ok: false
    //   }));
    //   const tempMessage = actions.replyToConversation(loggedUser, "abc", "a message");
    //   expect(dispatch).to.have.been.calledWith(
    //     actionTypes.REPLY_CONVERSATION_FAILURE, {
    //       conversationId: "abc",
    //       message: tempMessage,
    //       error: { ok: false }
    //     }
    //   );
    // });
    //
    // it("should dispatch error on failure", () => {
    //   sinon.stub(Request.prototype, "end", done => done({status: 404}, null));
    //   const tempMessage = actions.replyToConversation(loggedUser, "abc", "a message");
    //   expect(dispatch).to.have.been.calledWith(
    //     actionTypes.REPLY_CONVERSATION_FAILURE, {
    //       conversationId: "abc",
    //       message: tempMessage,
    //       error: { status: 404 }
    //     }
    //   );
    // });

  });

});
