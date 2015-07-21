import React from 'react';
import {Link} from 'react-router';

export default React.createClass({
	displayName: "Logo",

	render() {
		return (
			<Link to="app">
				<img src="/img/logo_small_white.png"/>
			</Link>
		);
	}
});
