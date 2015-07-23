import React from 'react';
import {State,Navigation} from 'react-router';
import {FluxMixin, StoreWatchMixin} from 'fluxxor';

import SearchForm from './searchForm.jsx';
import SearchResults from './searchResults.jsx';
import DocumentTitle from 'react-document-title';

export default React.createClass({
	mixins: [new FluxMixin(React), new StoreWatchMixin("search"), State, Navigation],
	displayName: "Search",

	getInitialState(){
		let params = this.getParams();

		return {
			term: params.term || ""
		};
	},

	getStateFromFlux(){
		return {
			search: this.getFlux().store("search").getState()
		};
	},

	render(){
		return (
			<DocumentTitle title={"Shoutit Search - " + this.state.term}>
				<div className="profile">
					<SearchForm {...this.state} />
					<SearchResults {...this.state}
						flux={this.getFlux()}
						onTermChange={this.onTermChange}
						onSubmit={this.onSubmit}/>
				</div>
			</DocumentTitle>
		);
	},

	onSubmit(){
	},

	onTermChange(ev) {
		let newTerm = ev.target.value;
		this.setState({
			term: newTerm
		});
		this.getFlux().actions.searchAll(newTerm);
		if (newTerm.length > 0) {
			this.transitionTo("search", {term: newTerm});
		}
	}
});
