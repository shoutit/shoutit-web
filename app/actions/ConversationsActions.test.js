import chai, { expect } from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";
import { Request } from "superagent";

import ConversationsActions from "./ConversationsActions";
import * as actions from "../actions/actionTypes";

chai.use(sinonChai);

describe("ConversationActions", () => {
  let dispatch;

  beforeEach(() => {
    dispatch = sinon.spy();
    ConversationsActions.dispatch = dispatch;
  });
  afterEach(() => {
    delete ConversationsActions.dispatch;
  });

  describe("loadMessages", () => {

    afterEach(() => Request.prototype.end.restore());

    it("should dispatch on success", () => {
      sinon.stub(Request.prototype, "end", done => done(null, {
        ok: true,
        body: { foo: "bar" }
      }));
      ConversationsActions.loadMessages("abc");
      expect(dispatch).to.have.been.calledWith(
        actions.LOAD_MESSAGES,
        { id: "abc" }
      );
      expect(dispatch).to.have.been.calledWith(
        actions.LOAD_MESSAGES_SUCCESS,
        { id: "abc", foo: "bar" }
      );
    });

    it("should dispatch response on failure", () => {
      sinon.stub(Request.prototype, "end", done => done(null, { ok: false }));
      ConversationsActions.loadMessages("abc");
      expect(dispatch).to.have.been.calledWith(
        actions.LOAD_MESSAGES_FAILURE,
        { error: { ok: false }, id: "abc" }
      );
    });

    it("should dispatch error on failure", () => {
      sinon.stub(Request.prototype, "end", done => done({ status: 404} ));
      ConversationsActions.loadMessages("abc");
      expect(dispatch).to.have.been.calledWith(
        actions.LOAD_MESSAGES_FAILURE,
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
      ConversationsActions.loadPreviousMessages("abc", 1);
      expect(dispatch).to.have.been.calledWith(
        actions.LOAD_PREVIOUS_MESSAGES,
        { id: "abc" }
      );
      expect(dispatch).to.have.been.calledWith(
        actions.LOAD_MESSAGES_SUCCESS,
        { id: "abc", results: "foo", previous: "bar" }
      );
    });

    it("should dispatch response on failure", () => {
      sinon.stub(Request.prototype, "end", done => done(null, { ok: false }));
      ConversationsActions.loadPreviousMessages("abc", "bar");
      expect(dispatch).to.have.been.calledWith(
        actions.LOAD_MESSAGES_FAILURE,
        { error: { ok: false }, id: "abc" }
      );
    });

    it("should dispatch error on failure", () => {
      sinon.stub(Request.prototype, "end", done => done({ status: 404} ));
      ConversationsActions.loadPreviousMessages("abc", "bar");
      expect(dispatch).to.have.been.calledWith(
        actions.LOAD_MESSAGES_FAILURE,
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
      ConversationsActions.loadNextMessages("abc", 1);
      expect(dispatch).to.have.been.calledWith(
        actions.LOAD_NEXT_MESSAGES,
        { id: "abc" }
      );
      expect(dispatch).to.have.been.calledWith(
        actions.LOAD_MESSAGES_SUCCESS,
        { id: "abc", results: "foo", next: undefined }
      );
    });

    it("should dispatch response on failure", () => {
      sinon.stub(Request.prototype, "end", done => done(null, { ok: false }));
      ConversationsActions.loadNextMessages("abc", "bar");
      expect(dispatch).to.have.been.calledWith(
        actions.LOAD_MESSAGES_FAILURE,
        { error: { ok: false }, id: "abc" }
      );
    });

    it("should dispatch error on failure", () => {
      sinon.stub(Request.prototype, "end", done => done({ status: 404}, {x: "y"}));
      ConversationsActions.loadNextMessages("abc", "bar");
      expect(dispatch).to.have.been.calledWith(
        actions.LOAD_MESSAGES_FAILURE,
        { error: { status: 404 }, id: "abc" }
      );
    });

  });

  describe("conversationDraftChange", () => {
    it("should dispatch", () => {
      ConversationsActions.conversationDraftChange(1, "foo");
      expect(dispatch).to.have.been.calledWith(
        actions.CONVERSATION_DRAFT_CHANGE,
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
      ConversationsActions.markConversationAsRead("abc", done);
      expect(dispatch).to.have.been.calledWith(
        actions.MARK_AS_READ,
        { id: "abc" }
      );
      expect(dispatch).to.have.been.calledWith(
        actions.MARK_AS_READ_SUCCESS,
        { id: "abc" }
      );
      expect(done).to.have.been.called.twice;
    });

    it("should dispatch response on failure", () => {
      const done = sinon.spy();
      sinon.stub(Request.prototype, "end", done => done(null, { ok: false }));
      ConversationsActions.markConversationAsRead("abc", done);
      expect(dispatch).to.have.been.calledWith(
        actions.MARK_AS_READ_FAILURE,
        { error: { ok: false }, id: "abc" }
      );
      expect(done).to.have.been.calledWith({ ok: false });
      expect(done).to.have.been.called.twice;
    });

    it("should dispatch error on failure", () => {
      const done = sinon.spy();
      sinon.stub(Request.prototype, "end", done => done({ status: 404}));
      ConversationsActions.markConversationAsRead("abc", done);
      expect(dispatch).to.have.been.calledWith(
        actions.MARK_AS_READ_FAILURE,
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
      const result = ConversationsActions.markConversationsAsRead(["abc", "bar"]);
      expect(result).to.be.a("Promise");
    });

    it("should resolve if all resolves", (done) => {
      const success = sinon.spy();
      sinon.stub(Request.prototype, "end", done => done(null, {
        ok: true
      }));
      const result = ConversationsActions.markConversationsAsRead(["abc", "bar"]);
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
      const result = ConversationsActions.markConversationsAsRead(["abc", "bar"]);
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
      ConversationsActions.deleteConversation("abc", done);
      expect(dispatch).to.have.been.calledWith(
        actions.DELETE_CONVERSATION,
        { id: "abc" }
      );
      expect(dispatch).to.have.been.calledWith(
        actions.DELETE_CONVERSATION_SUCCESS,
        { id: "abc" }
      );
      expect(done).to.have.been.called.twice;
    });

    it("should dispatch response on failure", () => {
      const done = sinon.spy();
      sinon.stub(Request.prototype, "end", done => done(null, { ok: false }));
      ConversationsActions.deleteConversation("abc", done);
      expect(dispatch).to.have.been.calledWith(
        actions.DELETE_CONVERSATION_FAILURE,
        { error: { ok: false }, id: "abc" }
      );
      expect(done).to.have.been.calledWith({ ok: false });
      expect(done).to.have.been.called.twice;
    });

    it("should dispatch error on failure", () => {
      const done = sinon.spy();
      sinon.stub(Request.prototype, "end", done => done({ status: 404}, {x: "y"}));
      ConversationsActions.deleteConversation("abc", done);
      expect(dispatch).to.have.been.calledWith(
        actions.DELETE_CONVERSATION_FAILURE,
        { error: { status: 404 }, id: "abc" }
      );
      expect(done).to.have.been.called.twice;
      expect(done).to.have.been.calledWith({ status: 404});
    });

  });

  describe("resetLastLoadedConversation", () => {

    it("should dispatch", () => {
      ConversationsActions.resetLastLoadedConversation();
      expect(dispatch).to.have.been.calledWith(
        actions.RESET_LAST_LOADED_CONVERSATION
      );
    });

  });


});
