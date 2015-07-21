import React from 'react';
import {Link} from 'react-router';

import {Image} from '../helper';

export default React.createClass({
	displayName: "TagProfileImage",

	render() {
		return (
			<div className="profile-img">
				<Image infix="user" size="medium" src={this.props.image}/>
				<h4>{this.props.name}</h4>
				<Link to="user" params={{username: encodeURIComponent(this.props.username)}} title="Username">
					{"(" + this.props.username + ")"}
				</Link>
			</div>
		);
	}
});