var React = require('react'),
	Router = require('react-router'),
	Fluxxor = require('fluxxor'),
	FluxMixin = Fluxxor.FluxMixin(React),
	StoreWatchMixin = Fluxxor.StoreWatchMixin,
	uniq = require('lodash/array/uniq');

var SearchForm = require('./searchForm.jsx'),
	SearchResults = require('./searchResults.jsx');

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
		var query = this.getQuery(),
			params = this.getParams();

		return {
			term: params.term,
			sort: query.sort || 'recent',
			tags: query.tags ? uniq(query.tags.split(',')) : [],
			users: query.users ? uniq(query.users.split(',')) : [],
			type: query.type || 'all'
		}
	},

	render: function () {
		return (
			<div>
				<SearchForm {...this.state}
					onAddTag={this.onAddTag}
					onAddUser={this.onAddUser}
					onTypeChange={this.onTypeChange}/>
				<SearchResults {...this.state}
					onTermChange={this.onTermChange}
					onSortChange={this.onSortChange}/>
			</div>
		)
	},

	onTermChange: function (newTerm) {
		this.setState({
			term: newTerm
		});
	},

	onSortChange: function (newSort) {
		this.setState({
			sort: newSort
		});
	},

	onAddTag: function (newTag) {
		this.setState({
			tags: _.uniq(this.state.tags.append([newTag]))
		});
	},

	onAddUser: function (newUser) {
		this.setState({
			tags: _.uniq(this.state.users.append([newUser]))
		});
	},

	onTypeChange: function (newType) {
		this.setState({
			type: newType
		});
	}
});