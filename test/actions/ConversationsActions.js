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
      actions.loadMessages("abc", "bar");
      expect(actions.dispatch).to.have.been.calledWith(
        actionTypes.LOAD_MESSAGES_FAILURE,
        { error: { ok: false }, id: "abc" }
      );
    });

    it("should dispatch error on failure", () => {
      sinon.stub(Request.prototype, "end", done => done({ status: 404} ));
      actions.loadMessages("abc", "bar");
      expect(actions.dispatch).to.have.been.calledWith(
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
      expect(actions.dispatch).to.have.been.calledWith(
        actionTypes.LOAD_MESSAGES_FAILURE,
        { error: { ok: false }, id: "abc" }
      );
    });

    it("should dispatch error on failure", () => {
      sinon.stub(Request.prototype, "end", done => done({ status: 404} ));
      actions.loadPreviousMessages("abc", "bar");
      expect(actions.dispatch).to.have.been.calledWith(
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
      expect(actions.dispatch).to.have.been.calledWith(
        actionTypes.LOAD_MESSAGES_FAILURE,
        { error: { ok: false }, id: "abc" }
      );
    });

    it("should dispatch error on failure", () => {
      sinon.stub(Request.prototype, "end", done => done({ status: 404}, {x: "y"}));
      actions.loadNextMessages("abc", "bar");
      expect(actions.dispatch).to.have.been.calledWith(
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

});
