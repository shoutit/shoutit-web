import React from 'react';
import {Link} from 'react-router';
import {Icon} from '../helper';

export default React.createClass({
	displayName: "Logo",

	render() {
		return (
			<Link to="app">
				<Icon name="logo_small_white"/>
			</Link>
		);
	}
});
