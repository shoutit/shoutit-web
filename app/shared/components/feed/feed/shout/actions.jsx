import React from 'react';
import {Icon} from '../../../helper';

export default React.createClass({
	displayName: "ShoutActions",


	render() {
		return (
			<ul className="book col-md-3">
				<li>
					<Icon name="b1"/>
				</li>
				<li>
					<Icon name="b2"/>
				</li>
				<li>
					<Icon name="b3"/>
				</li>
			</ul>
		);
	}
});
