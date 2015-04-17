var React = require('react'),
	Router = require('react-router'),
	Fluxxor = require('fluxxor'),
	FluxMixin = Fluxxor.FluxMixin(React),
	StoreWatchMixin = Fluxxor.StoreWatchMixin;

var SearchForm = require('./searchForm.jsx'),
	SearchResults = require('./searchResults.jsx'),
	DocumentTitle = require('react-document-title');

module.exports = React.createClass({
	mixins: [Router.State, FluxMixin, StoreWatchMixin("search")],
	displayName: "Search",

	getStateFromFlux: function () {
		var params = this.getParams();

		return {
			term: params.term || "",
			search: this.getFlux().store("search").getState()
		};
	},

	render: function () {
		return (
			<DocumentTitle title={"Shoutit Search - " + this.state.term}>
				<div className="profile">
					<SearchForm {...this.state} />
					<SearchResults {...this.state}
						flux={this.getFlux()}
						onTermChange={this.onTermChange}/>
				</div>
			</DocumentTitle>
		)
	},

	onTermChange: function (ev) {
		this.setState({
			term: ev.target.value
		});
	}
});