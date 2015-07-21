import React from 'react';
import {Link} from 'react-router';
import classnames from 'classnames';
import {Col} from 'react-bootstrap';
import UserImage from '../../../user/userImage.jsx';

export default React.createClass({
	displayName: "ShoutHeader",

	getDefaultProps() {
		return {
			logoRight: false
		};
	},

	render() {
		//console.log(this.props);

		let isSmall = (this.props.listType === "small");

		let classes = {
			"section-left": isSmall
		};

		let subimage = !isSmall ?
			(<p className="show-day">{this.props.agoText}</p>) : null;

		return (
			<Col xs={12} md={2} mdPush={this.props.logoRight ? 10 : 0} className={classnames(classes)}>
				<Link to="user" params={{username: encodeURIComponent(this.props.creator.username)}}>
					<UserImage name={this.props.creator.name} height={64} width={64} image={this.props.logoSrc}/>
				</Link>
				{subimage}
			</Col>
		);
	}
});
