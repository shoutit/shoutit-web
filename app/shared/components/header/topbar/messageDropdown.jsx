import React from 'react';
import {DropdownButton, Col, MenuItem} from 'react-bootstrap';

import {Icon} from '../../helper';
import DropdownHeader from './messages/dropdownHeader.jsx';

export default React.createClass({
	displayName: "MessagePopup",

	render() {
		let title = (<div>
			<Icon name="message-icon"/>
			<span className="small-circle">3</span>
		</div>);

		return (
			<DropdownButton title={title} className="messages" navItem={true} noCaret={true}>
				<DropdownHeader unread={0}/>

				<MenuItem className="see-all">
					<span>See all messages</span>
				</MenuItem>
			</DropdownButton>
		);
	}
});

