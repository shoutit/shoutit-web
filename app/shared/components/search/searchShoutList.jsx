var React = require('react'),
	Col = require('react-bootstrap/Col');

var Shout = require('../home/feed/shout.jsx');

module.exports = React.createClass({
	displayName: "SearchShoutList",

	componentDidMount: function () {
		var term = this.props.term,
			shouts = this.props.search.shouts[term];

		if (!shouts) {
			this.props.flux.actions.searchShouts(term);
		}
	},

	renderShouts: function (shouts) {
		return shouts.length ? shouts.map(function (shout, i) {
			return <Shout listType="small" key={"shout-" + i} shout={shout} index={i}/>;
		}) : <h4>No shouts.</h4>;
	},

	render: function () {
		var term = this.props.term,
			shouts = this.props.search.shouts[term],
			content;

		if (shouts) {
			content = this.renderShouts(shouts);
		} else {
			var Loader = require('halogen').PulseLoader;
			content = <Loader color="#bfdd6d"/>;
		}

		return (
			<div className="listener-scroll ctn-offerpro" tabIndex="5000"
				 style={{outline: "none"}}>
				{content}
			</div>
		);
	}
});