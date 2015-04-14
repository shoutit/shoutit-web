var React = require('react'),
	moment = require('moment');

module.exports = React.createClass({
	displayName: "SearchResult",

	renderPostBy: function () {
		return (
			<li className="postby">
				{"Posted by : " + this.props.user.name + ", "  + moment.unix(this.props.date_published).format('L')}
			</li>
		);
	},

	render: function () {
		return (
			<div key={this.props.key} className="search-result">
				<h4>{this.props.title}</h4>

				<p>{this.props.text}</p>

				<div className="ctn-offerpro-bottom">
					<ul>
						{this.renderPostBy()}
					</ul>
				</div>
			</div>
		);
	}
});