import React from 'react';
import moment from 'moment';

import {Icon} from '../helper';

export default React.createClass({
	displayName: "TagProfileActions",

	render() {
		return (
			<div className="profile-details">
				<div className="birth">
					<Icon name="cal"/>

					<p>
						<span>Date joined: </span>
						{moment.unix(this.props.joined).calendar()}
					</p>
				</div>
				<div className="birth">
					<Icon name="loc"/>

					<p>
						<span>Location: </span>
						{this.props.location.city + " - " + this.props.location.country}
					</p>
				</div>
			</div>
		);
	}
});
