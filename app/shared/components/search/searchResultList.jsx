var React = require('react'),
	Col = require('react-bootstrap/Col');

var SearchResult = require('./searchResult.jsx');

module.exports = React.createClass({
	displayName: "SearchResultList",

	render: function () {
		var results = this.props.search.length ? this.props.search.map(function (shout) {
			return (<SearchResult {...shout} key={shout.id}/>);
		}) : <h5>No Shouts found</h5>;

		return (
			<div className="listener-scroll">
				{results}
			</div>
		);
	}
});