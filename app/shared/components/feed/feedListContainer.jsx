import React from 'react';
import {State, History} from 'react-router';
import {StoreWatchMixin} from 'fluxxor';
import DocumentTitle from "../../../ui/DocumentTitle";
import FeedList from './feedList.jsx';
import defaults from '../../consts/defaults';
import EmbeddedShout from '../shouting/embeddedShout.jsx';

const titles = {
  "all": "Home",
  "offer": "Offers",
  "request": "Requests"
};

const typeToRoute = {
  "all": "all",
  "offer": "offers",
  "request": "requests"
};

export default function (type = "all") {
  return React.createClass({
    displayName: type,
    mixins: [new StoreWatchMixin("shouts", "locations"), History],

    getStateFromFlux() {
      let flux = this.props.flux;
      return {
        shouts: flux.store("shouts").getState(),
        locations: JSON.parse(JSON.stringify(flux.store("locations").getState()))
      };
    },

    render() {
      const { currentLocation, flux } = this.props;
      return (
        <DocumentTitle title={titles[type] + ""}>
          <div>
            <EmbeddedShout flux={ flux } collapsed/>
            <FeedList
              { ...this.state }
              type={ type }
              loadMore={ this.loadMore }
              currentLocation={ currentLocation }
            />
          </div>
        </DocumentTitle>
      );
    },

    componentDidMount() {
      let storeState = this.state.shouts,
        collection = storeState[type],
        shouts = collection.shouts;

      if (shouts.length === 0) {
        this.loadMore();
      }

      if (this.state.locations.current.city && !this.state.locations.current.location) {
        this.props.flux.actions.updateLocationToFeed();
      }

      let locStoreState = this.state.locations,
        currentCity = locStoreState.current.city,
        currentCountry = locStoreState.current.country,
        currentState = locStoreState.current.state,
        currentPage = this.props.params.page || '';
      if (currentCity) {
        this.history.pushState(null,
            `/${typeToRoute[type]}/${currentCountry}/${currentState}/${currentCity}/${currentPage}`);
      }
    },

    componentDidUpdate(prevProps, prevState) {

    },

    loadMore() {
      this.props.flux.actions.loadMore(type);
    }
  });
}
