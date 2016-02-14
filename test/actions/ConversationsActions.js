import chai, { expect } from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";
import { Request } from "superagent";

import { actions } from "../../app/shared/stores/conversations/actions";
import * as actionTypes from "../../app/shared/stores/conversations/actionTypes";

chai.use(sinonChai);

describe("ConversationActions", () => {
  let dispatch;

  beforeEach(() => {
    dispatch = sinon.spy();
    actions.dispatch = dispatch;
  });
  afterEach(() => {
    delete actions.dispatch;
  });

  describe("loadMessages", () => {

    afterEach(() => Request.prototype.end.restore());

    it("should dispatch on success", () => {
      sinon.stub(Request.prototype, "end", done => done(null, {
        ok: true,
        body: { foo: "bar" }
      }));
      actions.loadMessages("abc");
      expect(dispatch).to.have.been.calledWith(
        actionTypes.LOAD_MESSAGES,
        { id: "abc" }
      );
      expect(dispatch).to.have.been.calledWith(
        actionTypes.LOAD_MESSAGES_SUCCESS,
        { id: "abc", foo: "bar" }
      );
    });

    it("should dispatch response on failure", () => {
      sinon.stub(Request.prototype, "end", done => done(null, { ok: false }));
      actions.loadMessages("abc");
      expect(dispatch).to.have.been.calledWith(
        actionTypes.LOAD_MESSAGES_FAILURE,
        { error: { ok: false }, id: "abc" }
      );
    });

    it("should dispatch error on failure", () => {
      sinon.stub(Request.prototype, "end", done => done({ status: 404} ));
      actions.loadMessages("abc");
      expect(dispatch).to.have.been.calledWith(
        actionTypes.LOAD_MESSAGES_FAILURE,
        { error: { status: 404 }, id: "abc" }
      );
    });

  });

  describe("loadPreviousMessages", () => {

    afterEach(() => Request.prototype.end.restore());

    it("should dispatch on success", () => {
      sinon.stub(Request.prototype, "end", done => done(null, {
        ok: true,
        body: { results: "foo", "previous": "bar" }
      }));
      actions.loadPreviousMessages("abc", 1);
      expect(dispatch).to.have.been.calledWith(
        actionTypes.LOAD_PREVIOUS_MESSAGES,
        { id: "abc" }
      );
      expect(dispatch).to.have.been.calledWith(
        actionTypes.LOAD_MESSAGES_SUCCESS,
        { id: "abc", results: "foo", previous: "bar" }
      );
    });

    it("should dispatch response on failure", () => {
      sinon.stub(Request.prototype, "end", done => done(null, { ok: false }));
      actions.loadPreviousMessages("abc", "bar");
      expect(dispatch).to.have.been.calledWith(
        actionTypes.LOAD_MESSAGES_FAILURE,
        { error: { ok: false }, id: "abc" }
      );
    });

    it("should dispatch error on failure", () => {
      sinon.stub(Request.prototype, "end", done => done({ status: 404} ));
      actions.loadPreviousMessages("abc", "bar");
      expect(dispatch).to.have.been.calledWith(
        actionTypes.LOAD_MESSAGES_FAILURE,
        { error: { status: 404 }, id: "abc" }
      );
    });

  });

  describe("loadNextMessages", () => {

    afterEach(() => Request.prototype.end.restore());

    it("should dispatch on success", () => {
      sinon.stub(Request.prototype, "end", done => done(null, {
        ok: true,
        body: { results: "foo", "previous": "bar" }
      }));
      actions.loadNextMessages("abc", 1);
      expect(dispatch).to.have.been.calledWith(
        actionTypes.LOAD_NEXT_MESSAGES,
        { id: "abc" }
      );
      expect(dispatch).to.have.been.calledWith(
        actionTypes.LOAD_MESSAGES_SUCCESS,
        { id: "abc", results: "foo", next: undefined }
      );
    });

    it("should dispatch response on failure", () => {
      sinon.stub(Request.prototype, "end", done => done(null, { ok: false }));
      actions.loadNextMessages("abc", "bar");
      expect(dispatch).to.have.been.calledWith(
        actionTypes.LOAD_MESSAGES_FAILURE,
        { error: { ok: false }, id: "abc" }
      );
    });

    it("should dispatch error on failure", () => {
      sinon.stub(Request.prototype, "end", done => done({ status: 404}, {x: "y"}));
      actions.loadNextMessages("abc", "bar");
      expect(dispatch).to.have.been.calledWith(
        actionTypes.LOAD_MESSAGES_FAILURE,
        { error: { status: 404 }, id: "abc" }
      );
    });

  });

  describe("conversationDraftChange", () => {
    it("should dispatch", () => {
      actions.conversationDraftChange(1, "foo");
      expect(dispatch).to.have.been.calledWith(
        actionTypes.CONVERSATION_DRAFT_CHANGE,
        { draft: "foo", id: 1 }
      );
    });

  });

  describe("markConversationAsRead", () => {
    afterEach(() => Request.prototype.end.restore());

    it("should dispatch on success", () => {
      const done = sinon.spy();
      sinon.stub(Request.prototype, "end", done => done(null, {
        ok: true
      }));
      actions.markConversationAsRead("abc", done);
      expect(dispatch).to.have.been.calledWith(
        actionTypes.MARK_AS_READ,
        { id: "abc" }
      );
      expect(dispatch).to.have.been.calledWith(
        actionTypes.MARK_AS_READ_SUCCESS,
        { id: "abc" }
      );
      expect(done).to.have.been.called.twice;
    });

    it("should dispatch response on failure", () => {
      const done = sinon.spy();
      sinon.stub(Request.prototype, "end", done => done(null, { ok: false }));
      actions.markConversationAsRead("abc", done);
      expect(dispatch).to.have.been.calledWith(
        actionTypes.MARK_AS_READ_FAILURE,
        { error: { ok: false }, id: "abc" }
      );
      expect(done).to.have.been.calledWith({ ok: false });
      expect(done).to.have.been.called.twice;
    });

    it("should dispatch error on failure", () => {
      const done = sinon.spy();
      sinon.stub(Request.prototype, "end", done => done({ status: 404}));
      actions.markConversationAsRead("abc", done);
      expect(dispatch).to.have.been.calledWith(
        actionTypes.MARK_AS_READ_FAILURE,
        { error: { status: 404 }, id: "abc" }
      );
      expect(done).to.have.been.called.twice;
      expect(done).to.have.been.calledWith({ status: 404});
    });
  });

  describe("markConversationsAsRead", () => {
    afterEach(() => Request.prototype.end.restore());

    it("should return a promise", () => {
      sinon.stub(Request.prototype, "end", done => done(null, {
        ok: true
      }));
      const result = actions.markConversationsAsRead(["abc", "bar"]);
      expect(result).to.be.a("Promise");
    });

    it("should resolve if all resolves", (done) => {
      const success = sinon.spy();
      sinon.stub(Request.prototype, "end", done => done(null, {
        ok: true
      }));
      const result = actions.markConversationsAsRead(["abc", "bar"]);
      result.then(() => {
        success();
        expect(success).to.have.been.called;
        done();
      });
    });

    it("should fail if all fails", (done) => {
      const success = sinon.spy();
      sinon.stub(Request.prototype, "end", done => done(null, {
        ok: true
      }));
      const result = actions.markConversationsAsRead(["abc", "bar"]);
      result.then(() => {
        success();
        expect(success).to.have.been.called;
        done();
      });
    });
  });

  describe("deleteConversation", () => {
    afterEach(() => Request.prototype.end.restore());

    it("should dispatch on success", () => {
      const done = sinon.spy();
      sinon.stub(Request.prototype, "end", done => done(null, {
        ok: true
      }));
      actions.deleteConversation("abc", done);
      expect(dispatch).to.have.been.calledWith(
        actionTypes.DELETE_CONVERSATION,
        { id: "abc" }
      );
      expect(dispatch).to.have.been.calledWith(
        actionTypes.DELETE_CONVERSATION_SUCCESS,
        { id: "abc" }
      );
      expect(done).to.have.been.called.twice;
    });

    it("should dispatch response on failure", () => {
      const done = sinon.spy();
      sinon.stub(Request.prototype, "end", done => done(null, { ok: false }));
      actions.deleteConversation("abc", done);
      expect(dispatch).to.have.been.calledWith(
        actionTypes.DELETE_CONVERSATION_FAILURE,
        { error: { ok: false }, id: "abc" }
      );
      expect(done).to.have.been.calledWith({ ok: false });
      expect(done).to.have.been.called.twice;
    });

    it("should dispatch error on failure", () => {
      const done = sinon.spy();
      sinon.stub(Request.prototype, "end", done => done({ status: 404}, {x: "y"}));
      actions.deleteConversation("abc", done);
      expect(dispatch).to.have.been.calledWith(
        actionTypes.DELETE_CONVERSATION_FAILURE,
        { error: { status: 404 }, id: "abc" }
      );
      expect(done).to.have.been.called.twice;
      expect(done).to.have.been.calledWith({ status: 404});
    });

  });

  describe("resetLastLoadedConversation", () => {

    it("should dispatch", () => {
      actions.resetLastLoadedConversation();
      expect(dispatch).to.have.been.calledWith(
        actionTypes.RESET_LAST_LOADED_CONVERSATION
      );
    });

  });


});
