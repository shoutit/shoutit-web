var React = require('react'),
	Fluxxor = require('fluxxor'),
	FluxMixin = Fluxxor.FluxMixin,
	StoreWatchMixin = Fluxxor.StoreWatchMixin,
	Router = require('react-router'),
	Link = Router.Link,
	Col = require('react-bootstrap').Col,
	Logo = require('./logo.jsx'),
	Search = require('./search.jsx');

module.exports = React.createClass({
	mixins: [FluxMixin(React), StoreWatchMixin("search")],

	displayName: "HeaderLogo",

	contextTypes: {
		router: React.PropTypes.func
	},


	getStateFromFlux: function () {
		return {
			search: this.getFlux().store("search").getState()
		};
	},

	getInitialState: function () {
		return {
			showSearch: false,
			term: ""
		};
	},

	render: function () {
		var onBlurSearch = this.onBlurSearch;

		var shoutResults = this.state.search.shouts[this.state.term],
			shoutSearchResults = shoutResults ? shoutResults.slice(0, 3) : [];

		var shoutResultList = shoutSearchResults && shoutSearchResults.length ?
			shoutSearchResults.map(function (shout, i) {
				return (
					<li key={"search-header-shout-" + i}>
						<Link to="shout" params={{shoutId: shout.id}} onClick={onBlurSearch}>
							{shout.title}
						</Link>
					</li>);
			}) : [];

		var tagResults = this.state.search.tags[this.state.term],
			tagSearchResults = tagResults ? tagResults.slice(0, 3) : [];

		var tagResultList = tagSearchResults && tagSearchResults.length ?
			tagSearchResults.map(function (tag, i) {
				return (
					<li key={"search-header-tag-" + i}>
						<Link to="tag" params={{tagName: tag.name}} onClick={onBlurSearch}>
							{tag.name}
						</Link>
					</li>);
			}) : [];

		var userResults = this.state.search.users[this.state.term],
			userSearchResults = userResults ? userResults.slice(0, 3) : [];

		var userResultList = userSearchResults && userSearchResults.length ?
			userSearchResults.map(function (user, i) {
				return (
					<li key={"search-header-user-" + i}>
						<Link to="user" params={{username: user.username}} onClick={onBlurSearch}>
							{user.name}
						</Link>
					</li>);
			}) : [];

		var searchParams = {term: this.state.term};

		var searchList = this.state.showSearch ?
			<div className="list-search">
				<ul>
					<li>
						<Link to="search" params={searchParams} onClick={onBlurSearch}>Shouts</Link>
						<ul className="list-search-sub">
							{shoutResultList}
						</ul>
					</li>
					<li>
						<Link to="searchTags" params={searchParams} onClick={onBlurSearch}>Tags</Link>
						<ul className="list-search-sub">
							{tagResultList}
						</ul>
					</li>
					<li>
						<Link to="searchUsers" params={searchParams} onClick={onBlurSearch}>Users</Link>
						<ul className="list-search-sub">
							{userResultList}
						</ul>
					</li>
				</ul>
			</div> : "";

		var backdrop = this.state.showSearch ?
			<div onClick={this.onBlurSearch} className="backdrop"/> : "";

		return (
			<Col className="header-logo" xs={12} md={7}>
				<Col className="logo center" xs={3} md={3}>
					<Logo />
				</Col>
				<Col className="header-search center" xs={9} md={9}>
					<Search
						onFocus={this.onFocusSearch}
						onChange={this.onChangeSearch}
						onSubmit={this.onSubmit}
						onBlur={this.onBlurSearch}
						/>
					{searchList}
				</Col>
				{backdrop}
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
		this.getFlux().actions.searchAll(newTerm);
	},

	onSubmit: function () {
		this.setState({showSearch: false});
		if(this.state.term.length > 0) {
			this.context.router.transitionTo("search", {term: this.state.term});
		}
	}
});