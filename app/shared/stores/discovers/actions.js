import consts from "./consts";
import client from "./client";

export default {
  loadDiscoverWithCode(country) {
    client.getDiscover(country).end((err, res) => {
      if(err) {
        console.log(err);
        this.dispatch(consts.LOAD_DISCOVER_FAIL);
      } else {
        const id = res.body.results[0].id;
        this.dispatch(consts.LOAD_DISCOVER_WITH_CODE_SUCCESS, {
          id,
          country
        });
        this.flux.actions.loadDiscoverWithId(id);
      }
    });
        // dispatching event to trigger the loading
    this.dispatch(consts.LOAD_DISCOVER_WITH_CODE, {country});
  },

    // Main endpoint from loading discover objects
  loadDiscoverWithId(id) {
    client.getDiscoverList(id).end((err, res) => {
      if(err || res.status !== 200) {
        console.log(err);
        this.dispatch(consts.LOAD_DISCOVER_WITH_ID_FAIL, {id});
      } else {
                // Fire the shouts event in case API asks for it
        if(res.body.show_shouts) {
          this.flux.actions.loadDiscoverShouts(id);
        }
        this.dispatch(consts.LOAD_DISCOVER_WITH_ID_SUCCESS, {res: res.body});
      }
    });

    this.dispatch(consts.LOAD_DISCOVER_WITH_ID, {id});
  },

  loadDiscoverShouts(id) {
    client.getDiscoverShouts(id).end((err, res) => {
      if(err) {
        console.log(err);
        this.dispatch(consts.LOAD_DISCOVER_SHOUTS_FAIL, {id});
      } else {
        this.dispatch(consts.LOAD_DISCOVER_SHOUTS_SUCCESS, {
          res: res.body,
          id
        });
      }
    });

    this.dispatch(consts.LOAD_DISCOVER_SHOUTS, {id});
  }
};
