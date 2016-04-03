import Fluxxor from 'fluxxor';
import url from 'url';
import consts from './consts';
import usersConsts from '../users/consts';
import { GET_SUGGESTIONS_SUCCESS } from '../suggestions/actionTypes';
import client from './client';
import statuses from '../../consts/statuses.js';
import assign from 'lodash/object/assign';
import debug from 'debug';

var { LISTEN_BTN_LOADING } = statuses;
const log = debug('shoutit:flux:tags');

var TagStore = Fluxxor.createStore({
  initialize(props) {
    this.state = {
      tags: {},
      featuredTags: null,
      loading: false,
      sprite: null,
      status: null,
    };

    if (props.tag) {
      this.addTagEntry(props.tag.name);

      this.state.tags[props.tag.name].tag = props.tag;

      if (props.tagshouts) {
        this.state.tags[props.tag.name].shouts = props.tagshouts.results;

        const countryCode = props.tagshouts.results[0] && props.tagshouts.results[0].location.country;
        this.state.tags[props.tag.name].shoutsCountryCode = countryCode;

        this.state.tags[props.tag.name].shoutsNext = this.parseNextPage(props.tagshouts.next);
      }

      if (props.taglisteners) {
        this.state.tags[props.tag.name].listeners = props.taglisteners.results;
      }
    }

    let tagsData = props.tags || props.feed;
    if (tagsData) {
      this.state.featuredTags = tagsData.results;
    }

    if (props.listeningTags) {
      let tags = props.listeningTags.tags;

      tags.forEach(tag => {
        this.addTagEntry(tag.name);
        this.state.tags[tag.name].tag = tag;
      });
    }

    this.bindActions(
      consts.LOAD_TAG, this.onLoadTag,
      consts.LOAD_TAG_SUCCESS, this.onLoadTagSuccess,
      consts.LISTEN_TAG, this.onListenTag,
      consts.LISTEN_TAG_SUCCESS, this.onListenTagSuccess,
      consts.LISTEN_TAG_FAIL, this.onListenTagFail,
      consts.STOP_LISTEN_TAG, this.onStopListenTag,
      consts.STOP_LISTEN_TAG_SUCCESS, this.onStopListenTagSuccess,
      consts.STOP_LISTEN_TAG_FAIL, this.onStopListenTagFail,
      consts.LOAD_TAG_SHOUTS, this.onLoadTagShouts,
      consts.LOAD_TAG_SHOUTS_SUCCESS, this.onLoadTagShoutsSuccess,
      consts.LOAD_MORE_TAG_SHOUTS, this.onLoadMoreTagShouts,
      consts.LOAD_TAG_LISTENERS, this.onLoadTagListeners,
      consts.LOAD_TAG_LISTENERS_SUCCESS, this.onLoadTagListenersSuccess,
      consts.LOAD_TAG_RELATED, this.onLoadTagRelated,
      usersConsts.LOAD_USER_TAGS_SUCCESS, this.onLoadUserTagsSuccess,
      consts.LOAD_TAGS_SPRITE, this.onLoadTagsSprite,
      consts.LOAD_TAGS_SPRITE_SUCCESS, this.onLoadTagsSpriteSuccess,
      consts.LOAD_TAGS_SPRITE_FAILED, this.onLoadTagsSpriteFailed,
      consts.REQUEST_SPRITING, this.onRequestSpriting,
      consts.REQUEST_SPRITING_SUCCESS, this.onLoadTagsSpriteSuccess,
      consts.REQUEST_SPRITING_FAILED, this.onRequestSpritingFailed,
      GET_SUGGESTIONS_SUCCESS, this.onGetSuggestionsSuccess
    );
  },

  parseNextPage(nextUrl) {
    if (nextUrl) {
      var parsed = url.parse(nextUrl, true);
      return Number(parsed.query.page);
    }
    return null;
  },

  onLoadTag(payload) {
    var tagName = payload.tagName;

    if (!this.state.tags[tagName]) {
      this.addTagEntry(payload.tagName);
    }

    client.get(tagName)
      .end((err, res) => {
        if (err || res.status !== 200) {
          this.onLoadTagFailed({
            res: res.body,
            tagName: tagName,
          });
        } else {
          this.onLoadTagSuccess({
            res: res.body,
            tagName: tagName,
          });
        }
      });
    this.state.loading = true;
    this.emit('change');
  },

  addTagEntry(tagName) {
    if (!this.state.tags[tagName]) {
      this.state.tags[tagName] = {
        tag: {},
        shouts: null,
        shoutsNext: null,
        shoutsCountryCode: null,
        listeners: null,
        related: {
          loading: false,
          list: [],
        },
      };
    }
  },

  // adding chunks of tag objects to the store
  addTags(tags = []) {
    tags.forEach(tag => {
      this.addTagEntry(tag.name);
      this.state.tags[tag.name].tag = tag;
    });
  },

  onGetSuggestionsSuccess({ res }) {
    this.addTags(res.tags);
  },

  onLoadUserTagsSuccess(payload) {

    let tags = payload.res.tags;
    tags.forEach(tag => {
      this.addTagEntry(tag.name);
      this.state.tags[tag.name].tag = tag;
    });

    this.emit('change');
  },

  onLoadTagSuccess(payload) {
    this.state.tags[payload.tagName].tag = payload.res;
    this.state.loading = false;
    this.emit('change');
  },

  onLoadTagFailed(payload) {
    this.state.tags[payload.tagName] = null;
    this.state.loading = false;
    this.emit('change');
  },

  onListenTag(payload) {
    var tagName = payload.tagName;
    // add to tags list if not available
    !this.state.tags[tagName] ? this.addTagEntry(tagName) : undefined;
    this.state.tags[tagName].tag.fluxStatus = LISTEN_BTN_LOADING;
    this.emit('change');
  },

  onListenTagFail({ tagName }) {
    this.state.tags[tagName].tag.fluxStatus = null;
    this.emit('change');
  },

  onListenTagSuccess({ tagName }) {
    this.state.tags[tagName].tag.is_listening = true;
    this.state.tags[tagName].tag.listeners_count += 1;
    this.state.tags[tagName].tag.fluxStatus = null;
    this.emit('change');
  },

  onStopListenTag(payload) {
    var tagName = payload.tagName;
    // add to tags list if not available
    !this.state.tags[tagName] ? this.addTagEntry(tagName) : undefined;
    this.state.tags[tagName].tag.fluxStatus = LISTEN_BTN_LOADING;
    this.emit('change');
  },

  onStopListenTagFail({ tagName }) {
    this.state.tags[tagName].tag.fluxStatus = null;
    this.emit('change');
  },

  onStopListenTagSuccess({ tagName }) {
    this.state.tags[tagName].tag.is_listening = false;
    this.state.tags[tagName].tag.listeners_count -= 1;
    this.state.tags[tagName].tag.fluxStatus = null;
    this.emit('change');
  },

  onLoadTagShouts({ tagName, countryCode = '' }) {

    const query = {
      tags: tagName,
      country: countryCode,
      page_size: 10,
    };

    client.getShouts(query).end((err, res) => {
      if (err) {
        log(err);
      } else {
        this.onLoadTagShoutsSuccess({
          tagName,
          countryCode,
          res: res.body,
        });
      }
    });
    this.state.loading = true;
    this.emit('change');
  },

  onLoadTagShoutsSuccess({ tagName, countryCode, res }) {
    const next = this.parseNextPage(res.next);
    const tagShouts = this.state.tags[tagName];

    this.addTagEntry(tagName);

    tagShouts.shoutsCountryCode = countryCode;
    tagShouts.shouts = res.results;
    tagShouts.shoutsNext = next;

    this.state.loading = false;
    this.emit('change');
  },

  onLoadMoreTagShouts({ tagName }) {
    const tagShouts = this.state.tags[tagName];
    const next = tagShouts.shoutsNext;
    const countryCode = tagShouts.shoutsCountryCode;

    if (next === null) {
      return;
    }

    client.getShouts({
      tags: tagName,
      country: countryCode,
      page: next,
    }).end((err, res) => {
      if (err) {
        log(err);
      } else {
        this.onLoadMoreTagShoutsSuccess({
          tagName,
          res: res.body,
        });
      }
    });

    this.state.loading = true;
    this.emit('change');
  },

  onLoadMoreTagShoutsSuccess({ tagName, res }) {
    const tagShouts = this.state.tags[tagName];
    const next = this.parseNextPage(res.next);

    if (!res.results) {
      return;
    }

    tagShouts.shouts = [...tagShouts.shouts, ...res.results];
    tagShouts.shoutsNext = next;

    this.state.loading = false;
    this.emit('change');
  },

  onLoadTagListeners(payload) {
    var tagName = payload.tagName;

    client.getListeners(tagName).end((err, res) => {
      if (err) {
        console.log(err);
      } else {
        this.onLoadTagListenersSuccess({
          tagName: tagName,
          res: res.body,
        });
      }
    });
    this.state.loading = true;
    this.emit('change');
  },

  onLoadTagListenersSuccess(payload) {
    this.addTagEntry(payload.tagName);
    this.state.tags[payload.tagName].listeners = payload.res.results;
    this.state.loading = false;
    this.emit('change');
  },

  onLoadTagRelated(payload) {
    var tagName = payload.tagName;

    if (!this.state.tags[payload.tagName]) {
      this.addTagEntry(payload.tagName);
    }

    client.getRelated(tagName).end((err, res) => {
      if (err) {
        log(err);
      } else {
        this.onLoadTagRelatedSuccess({
          tagName: tagName,
          res: res.body,
        });
      }
    });

    this.state.tags[tagName].related.loading = true;
    this.emit('change');
  },

  onLoadTagRelatedSuccess({ res, tagName }) {
    if (res.results.length === 0) {
      this.state.tags[tagName].related.err = true;
    } else {
      this.state.tags[tagName].related.list = res.results.map(item => item.name);
      this.addTags(res.results);
    }

    this.state.tags[tagName].related.loading = false;
    this.emit('change');
  },

  onLoadTagsSuccess({ res }) {
    this.state.featuredTags = res.results;
    this.emit('change');
  },

  onLoadTagsSprite({ hash }) {
  },

  onLoadTagsSpriteSuccess({ res }) {
    this.state.sprite = res;
    this.emit('change');
  },

  onLoadTagsSpriteFailed({ hash }) {
    this.state.sprite = undefined;
    this.emit('change');
  },

  setFluxStatus(status) {
    this.state.status = status;
    this.emit('change');
    // clearing status to avoid displaying old messages
    setTimeout(() => {
      this.state.status = null;
      this.emit('change');
    }, 0);
  },

  onRequestSpriting() {
  },

  onRequestSpritingFailed() {
  },

  serialize() {
    return JSON.stringify(this.state);
  },

  hydrate(json) {
    this.state = JSON.parse(json);
  },

  getState() {
    return this.state;
  },
});

export default TagStore;
