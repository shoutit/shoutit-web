var React = require('react'),
	Router = require('react-router'),
	Fluxxor = require('fluxxor'),
	FluxMixin = Fluxxor.FluxMixin(React),
	StoreWatchMixin = Fluxxor.StoreWatchMixin,
	uniq = require('lodash/array/uniq');

var SearchForm = require('./searchForm.jsx'),
	SearchResults = require('./searchResults.jsx'),
	DocumentTitle = require('react-document-title');

module.exports = React.createClass({
	mixins: [Router.State, FluxMixin, StoreWatchMixin("shouts")],
	displayName: "Search",

	statics: {
		fetchData: function (client, session, params, name, query) {
			return client.shouts().list(session, {
				search: params.term,
				tags: query.tags || "",
				type: query.type || 'all'
			});
		}
	},

	getStateFromFlux: function () {
		return this.getFlux().store("shouts").getState();
	},

	getInitialState: function () {
		var params = this.getParams();

		return {
			term: params.term
		}
	},

	render: function () {
		return (
			<DocumentTitle title={"Shoutit Search - " + this.state.term}>
				<div className="profile">
					<SearchForm {...this.state}
						onAddUser={this.onAddUser}/>
					<SearchResults {...this.state}
						onTermChange={this.onTermChange}/>
				</div>
			</DocumentTitle>
		)
	},

	onTermChange: function (newTerm) {
		this.setState({
			term: newTerm
		});
	}
});