var React = require('react'),
	Col = require('react-bootstrap/Col');

var Tag = require('../home/feed/shout/tag.jsx');

module.exports = React.createClass({
	displayName: "SearchTagList",

	componentDidMount: function () {
		var term = this.props.term,
			tags = this.props.search.tags[term];

		if (!tags) {
			this.props.flux.actions.searchTags(term);
		}
	},

	renderTags: function (tags) {
		return tags.length ? tags.map(function (tag, i) {
			return <Tag key={"tag-" + i} tag={tag} index={i}/>;
		}) : <h4>No tags.</h4>;
	},

	render: function () {
		var term = this.props.term,
			tags = this.props.search.tags[term],
			content;

		if (tags) {
			content = this.renderTags(tags);
		} else {
			var Loader = require('halogen').PulseLoader;
			content = <Loader color="#bfdd6d"/>;
		}

		return (
			<div className="listener-scroll ctn-offerpro" tabIndex="5000"
				 style={{outline: "none"}}>
				<ul className="tags col-md-12">
					{content}
				</ul>
			</div>
		);
	}
});