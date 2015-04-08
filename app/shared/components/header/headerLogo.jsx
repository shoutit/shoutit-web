var React = require('react'),
	Fluxxor = require('fluxxor'),
	FluxMixin = Fluxxor.FluxMixin(React),
	StoreWatchMixin = Fluxxor.StoreWatchMixin,
	Router = require('react-router'),
	Link = Router.Link,
	Col = require('react-bootstrap/Col'),
	Logo = require('./logo.jsx'),
	Search = require('./search.jsx');

module.exports = React.createClass({
	mixins: [FluxMixin, StoreWatchMixin("shouts")],

	displayName: "HeaderLogo",

	getInitialState: function () {
		return {
			showSearch: false,
			term: ""
		}
	},

	getStateFromFlux: function () {
		return this.getFlux().store("shouts").getSearchState();
	},

	render: function () {
		var searchResults = this.state.searchResults[this.state.term];

		var onBlurSearch = this.onBlurSearch;

		var resultList = searchResults && searchResults.length ?
			searchResults.map(function (shout) {
				return (
					<li>
						<Link to="shout" params={{shoutId: shout.id}} onClick={onBlurSearch}>
						{shout.title}
						</Link>
					</li>);
			}) : [];

		var searchList = this.state.showSearch ?
			<div className="list-search">
				<ul>
					<li>
						Shouts
						<ul className="list-search-sub">
						{resultList}
						</ul>
					</li>
				</ul>
			</div> : "";

		return (
			<Col className="header-logo" xs={12} md={7}>
				<Col className="logo center" xs={3} md={3}>
					<Logo />
				</Col>
				<Col className="header-search center" xs={9} md={9}>
					<Search
						onFocus={this.onFocusSearch}
						onChange={this.onChangeSearch}
					/>
				{searchList}
				</Col>
			</Col>
		);
	},

	onFocusSearch: function () {
		this.setState({showSearch: true});
	},

	onBlurSearch: function () {
		this.setState({showSearch: false});
	},

	onChangeSearch: function (ev) {
		var newTerm = ev.target.value;
		this.setState({term: newTerm});
		this.getFlux().actions.searchShouts(newTerm);
	}
});