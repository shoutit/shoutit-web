import React from 'react';
import {Link} from 'react-router';

export default React.createClass({
	displayName: "MainMenu",

	render() {
		let currentCity = encodeURIComponent(this.props.current.city),
			currentCountry = encodeURIComponent(this.props.current.country),
			currentState = encodeURIComponent(this.props.current.state);

		return (
			<div className="topbar-links">
				<Link to={`/all/${currentCountry}/${currentState}/${currentCity}`}>Browse</Link>
				<Link to={`/discover/${currentCountry}/${currentState}/${currentCity}`}>Discover</Link>
			</div>
		);
	}
});
