import React from 'react';
import {Link} from 'react-router';

export default React.createClass({
	displayName: "MainMenu",

	render() {
		const country = encodeURIComponent(this.props.current.country);

		return (
			<div className="topbar-links">
				<Link to={`/home`}>Browse</Link>
				<Link to={`/discover/${country}`}>Discover</Link>
			</div>
		);
	}
});
