import React from 'react';
import {Link} from 'react-router';
import UserImage from '../../../user/userImage.jsx';

export default React.createClass({
	displayName: "ShoutHeader",

	render() {
		let isSmall = (this.props.listType === "small");
		let username = encodeURIComponent(this.props.creator.username);

		// let subimage = !isSmall ?
		// 	(<p className="show-day">{this.props.agoText}</p>) : null;

		return (
			<div className="shout-header">
				<Link to={`/user/${username}`}>
					<UserImage name={this.props.creator.name} type="square" height={32} width={32} image={this.props.logoSrc}/>
				</Link>
				<h3 className="user">{this.props.creator.name}</h3>
				<span className="time">{this.props.agoText}</span>
				
			</div>
		);
	}
});
