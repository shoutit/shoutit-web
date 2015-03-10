var React = require('react'),
	StateMixin = require('react-router').State,
	DocumentTitle = require('react-document-title');

var Feed = require('./feed.jsx');

var titles = {
	"/" : "Home",
	"/offers" : "Offers",
	"/requests" : "Requests"
};

module.exports = React.createClass({
	displayName: "Home",
	mixins: [StateMixin],

	titleAppend: " - Shout It",

	render: function () {
		var pathName= this.getPathname();
		var title = titles[pathName] + this.titleAppend;

		return (
			<DocumentTitle title={title}>
				<Feed flux={this.props.flux} type={pathName.substr(1)}/>
			</DocumentTitle>
		);
	}
});