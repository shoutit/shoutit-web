/**
 * Created by Philip on 22.04.2015.
 */

var React = require('react'),
	itemTypes = require('./types'),
	itemProps = require('./properties'),
	keys = require('lodash/object/keys');

var propArray = keys(itemProps);

module.exports = React.createClass({
	displayName: "itemScope",

	propTypes: {
		children: React.PropTypes.element.isRequired,
		property: React.PropTypes.oneOf(propArray).isRequired
	},

	render: function () {
		var prop = this.props.property;

		var microdataProps =  {
			itemProp: prop
		};

		if(itemProps[prop] && itemProps[prop].itemScope && itemTypes[itemProps[prop].itemScope]) {
			microdataProps.itemScope = true;
			microdataProps.itemType= itemTypes[itemProps[prop].itemScope];
		}

		var inputReactObject = React.Children.only(this.props.children);
		return React.addons.cloneWithProps(inputReactObject,microdataProps);
	}
});