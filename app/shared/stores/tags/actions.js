import consts from './consts';
import client from './client';

export default {
  loadTag(tagName) {
    this.dispatch(consts.LOAD_TAG, {
      tagName: tagName
    });
  },

  loadTagSuccess(tagName, res) {
    this.dispatch(consts.LOAD_TAG_SUCCESS, {
      tagName: tagName,
      res: res
    });
  },

  addTag(tag) {
    this.dispatch(consts.LOAD_TAG, tag);
  },

  listenTag(tagName) {
    client.listen(tagName).end((err, res) => {
      if (err) {
        this.dispatch(consts.LISTEN_TAG_FAIL, { tagName });
      } else if (res.body.success) {
        this.dispatch(consts.LISTEN_TAG_SUCCESS, { tagName });
      } else {
        this.dispatch(consts.LISTEN_TAG_FAIL, { tagName });
      }
    });

    this.dispatch(consts.LISTEN_TAG, { tagName });
  },

  stopListenTag(tagName) {
    client.unlisten(tagName).end((err, res) => {
      if (err) {
        this.dispatch(consts.STOP_LISTEN_TAG_FAIL, { tagName });
      } else if (res.body.success) {
        this.dispatch(consts.STOP_LISTEN_TAG_SUCCESS, { tagName });
      } else {
        this.dispatch(consts.STOP_LISTEN_TAG_FAIL, { tagName });
      }
    });

    this.dispatch(consts.STOP_LISTEN_TAG, { tagName });
  },

  stopListenTagSuccess(tagName) {
    this.dispatch(consts.STOP_LISTEN_TAG_SUCCESS, {
      tagName: tagName
    });
  },

  loadTagListeners(tagName) {
    this.dispatch(consts.LOAD_TAG_LISTENERS, {
      tagName: tagName
    });
  },

  loadTagRelated(tagName) {
    this.dispatch(consts.LOAD_TAG_RELATED, {
      tagName: tagName
    });
  },

  loadTagListenersSuccess(tagName, res) {
    this.dispatch(consts.LOAD_TAG_LISTENERS, {
      tagName: tagName,
      res: res
    });
  },

  loadTagShouts(tagName, countryCode) {
    this.dispatch(consts.LOAD_TAG_SHOUTS, {
      tagName,
      countryCode
    });
  },

  loadMoreTagShouts(tagName, type) {
    this.dispatch(consts.LOAD_MORE_TAG_SHOUTS, {
      tagName: tagName,
      type: type
    });
  },

  loadTags(query) {
    this.dispatch(consts.LOAD_TAGS, { query });

    client.list(query)
      .end((error, res) => {
        if (error || !res.ok) {
          this.dispatch(consts.LOAD_TAGS_FAILED, {
            error
          });
        } else {
          this.dispatch(consts.LOAD_TAGS_SUCCESS, {
            res: res.body
          });
        }
      });
  },

  loadSpriteInfo(hash) {
    this.dispatch(consts.LOAD_TAGS_SPRITE, { hash });

    client.loadSpriteInfo(hash)
      .end((error, res) => {
        if (error || !res.ok || !res.body) {
          this.dispatch(consts.LOAD_TAGS_SPRITE_FAILED, {
            hash,
            error
          });
        } else {
          this.dispatch(consts.LOAD_TAGS_SPRITE_SUCCESS, {
            hash,
            res: res.body
          });
        }
      });

  },

  requestSpriting(images) {
    this.dispatch(consts.REQUEST_SPRITING, { images });

    client.requestSpriting(images)
      .end((error, res) => {
        if (error || !res.ok) {
          this.dispatch(consts.REQUEST_SPRITING_FAILED, {
            error
          });
        } else {
          this.dispatch(consts.REQUEST_SPRITING_SUCCESS, {
            res: res.body
          });
        }
      });
  }

};
