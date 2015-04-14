var React = require('react'),
	Col = require('react-bootstrap/Col');

var Clear = require('../helper/clear.jsx'),
	Image = require('../helper/image.jsx'),
	Shout = require('../home/feed/shout.jsx');

var map = {
	request: "Requests",
	offer: "Offers"
};

module.exports = React.createClass({
	displayName: "TagProfileShoutList",

	componentDidMount: function () {
		var tagName = this.props.tagName;

		if (!this.props.tags[tagName] || !this.props.tags[tagName][this.props.type + 's']) {
			this.props.flux.actions.loadTagShouts(this.props.tagName, this.props.type);
		}
	},

	renderTagProfileShouts: function (shouts) {
		return shouts.length ? shouts.map(function (shout, i) {
			return <Shout listType="small" key={"shout-" + i} shout={shout} index={i}/>;
		}) : <h4>No shouts.</h4>;
	},

	render: function () {
		var tagName = this.props.tagName,
			tag = this.props.tags[tagName].tag,
			tags = this.props.tags[tagName][this.props.type + 's'],
			content, stat;

		if (tags) {
			content = this.renderTagProfileShouts(tags);
			stat = <span>{' (' + tags.length + ')'}</span>;
		} else {
			var Loader = require('halogen').PulseLoader;
			content = <Loader color="#bfdd6d"/>;
		}

		return (
			<Col xs={12} md={12} className="content-listener">
				<div className="listener">
					<div className="listener-title">
						<p>
							{tag.name + " - " + map[this.props.type] + ":"}
							{stat}
						</p>
					</div>
					<Clear />

					<div className="listener-scroll ctn-offerpro" tabIndex="5000"
						 style={{outline: "none"}}>
						{content}
					</div>
				</div>
			</Col>
		);
	}
});