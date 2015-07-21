/**
 * Created by Philip on 22.04.2015.
 */

import React from 'react';
import itemTypes from './types';
import keys from 'lodash/object/keys';

let typeArray = keys(itemTypes);

export default React.createClass({
	displayName: "itemScope",

	propTypes: {
		children: React.PropTypes.element.isRequired,
		type: React.PropTypes.oneOf(typeArray)
	},

	render() {
		let inputReactObject = React.Children.only(this.props.children);
		return React.cloneElement(inputReactObject, {
			itemScope: true,
			itemType: itemTypes[this.props.type]
		});
	}
});
