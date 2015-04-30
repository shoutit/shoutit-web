var React = require('react'),
	Fluxxor = require('fluxxor'),
	FluxMixin = Fluxxor.FluxMixin(React),
	StoreWatchMixin = Fluxxor.StoreWatchMixin;

var SearchForm = require('./searchForm.jsx'),
	SearchResults = require('./searchResults.jsx'),
	DocumentTitle = require('react-document-title');

module.exports = React.createClass({
	mixins: [FluxMixin, StoreWatchMixin("search")],
	displayName: "Search",

	contextTypes: {
		router: React.PropTypes.func
	},

	getInitialState: function () {
		var params = this.context.router.getCurrentParams();

		return {
			term: params.term || ""
		};
	},

	getStateFromFlux: function () {
		return {
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
						onTermChange={this.onTermChange}
						onSubmit={this.onSubmit}/>
				</div>
			</DocumentTitle>
		)
	},

	onSubmit: function () {
	},

	onTermChange: function (ev) {
		var newTerm = ev.target.value;
		this.setState({
			term: newTerm
		});
		this.getFlux().actions.searchAll(newTerm);
		if (newTerm.length > 0) {
			this.context.router.transitionTo("search", {term: newTerm});
		}
	}
});