/**
 * Created by Philip on 22.04.2015.
 */

var React = require('react'),
	itemTypes = require('./types'),
	keys = require('lodash/object/keys');

var typeArray = keys(itemTypes);

module.exports = React.createClass({
	displayName: "itemScope",

	propTypes: {
		children: React.PropTypes.element.isRequired,
		type: React.PropTypes.oneOf(typeArray)
	},

	render: function () {
		var inputReactObject = React.Children.only(this.props.children);
		return React.addons.cloneWithProps(inputReactObject, {
			itemScope: true,
			itemType: itemTypes[this.props.type]
		});
	}
});