import React from 'react';
import {Image} from '../helper';

export default React.createClass({
	displayName: "TagProfileImage",

	render() {
		let image = this.props.image ? <Image infix="tag" size="medium" src={this.props.image}/> : null;

		return (
			<div className="profile-img">
				{image}
				<h4>{this.props.name}</h4>
			</div>
		);
	}
});
