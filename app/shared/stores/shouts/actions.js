import consts from "./consts";
// import messageConsts from '../messages/actionTypes';
import client from "./client";

export default {
  getMobileNumber(shoutId) {
    this.dispatch(consts.GET_MOBILE_NUMBER, { shoutId });
  },

  update(city) {
    this.dispatch(consts.UPDATE, {
      city
    });
  },

  updateSuccess(res, type) {
    this.dispatch(consts.UPDATE_SUCCESS, {
      res, type
    });
  },

  requestFailed(err) {
    this.dispatch(consts.REQUEST_FAILED, {
      error: err
    });
  },

  loadMore(type) {
    this.dispatch(consts.LOAD_MORE, {
      type
    });
  },

  loadMoreSuccess(res, type) {
    this.dispatch(consts.LOAD_MORE_SUCCESS, {
      res, type
    });
  },

  loadRelatedShouts(shoutId) {
    this.dispatch(consts.LOAD_RELATED_SHOUTS, {
      shoutId: shoutId
    });
  },

  loadShout(shoutId) {
    this.dispatch(consts.LOAD_SHOUT, {
      shoutId: shoutId
    });
  },

  loadShoutSuccess(res) {
    this.dispatch(consts.LOAD_SHOUT_SUCCESS, {
      res: res
    });
  },

  loadShoutFailed(shoutId, res) {
    this.dispatch(consts.LOAD_SHOUT_FAILED, {
      shoutId: shoutId,
      res: res
    });
  },

  changeShoutDraft(key, value) {
    this.dispatch(consts.CHANGE_SHOUT_DRAFT, {
      key, value
    });
  },

  sendShout() {
    this.dispatch(consts.SEND_SHOUT);
  },

  removeShoutImage(fileName) {
    this.dispatch(consts.REMOVE_SHOUT_IMAGE, {fileName});
  },

  sendShoutReply(shoutId, message) {
    this.dispatch(consts.SEND_SHOUT_REPLY, {shoutId, message});

    client.reply(shoutId, message)
      .end(function (error, res) {
        if (error || !res.ok) {
          this.dispatch(consts.SEND_SHOUT_REPLY_FAILED, {
            error
          });
        } else {
          // this.dispatch(messageConsts.NEW_MESSAGE, {
          //  message: res.body
          // });
        }
      }.bind(this));
  },

  changeReplyDraft(shoutId, text) {
    this.dispatch(consts.CHANGE_SHOUT_REPLY_DRAFT, {shoutId, text});
  }
};
