import React from 'react';
import {State, History} from 'react-router';
import {StoreWatchMixin} from 'fluxxor';
import DocumentTitle from 'react-document-title';
import FeedList from './feedList.jsx';
import defaults from '../../consts/defaults';

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

		statics: {
			fetchData(client, session, params) {
				return client.shouts().list(session, {
					shout_type: type,
					page_size: defaults.PAGE_SIZE,
					city: params.city === "all" ? null : params.city,
					country: params.country === "all" ? null : params.country,
					state: params.state === "all" ? null : params.state,
					page: params.page
				});
			}
		},

		getStateFromFlux() {
			let flux = this.props.flux;
			return {
				shouts: flux.store("shouts").getState(),
				locations: JSON.parse(JSON.stringify(flux.store("locations").getState()))
			};
		},

		render() {
			return (
				<DocumentTitle title={titles[type] + " - Shoutit"}>
					<FeedList {...this.state} type={type} loadMore={this.loadMore}/>
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
