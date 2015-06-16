import React from 'react';
import {Col} from 'react-bootstrap';
import ShoutHeader from './shout/header.jsx';
import ShoutBody from './shout/body.jsx';
import moment from 'moment';

import {ItemScope} from '../../helper/microdata';

export default React.createClass({
	displayName: "Shout",

	alignRight(){
		return this.props.index % 2 !== 0;
	},

	agoText(){
		return moment.unix(this.props.shout.date_published).fromNow();
	},

	render(){
		let shout = this.props.shout,
			ago = this.agoText();

		return (
			<section>
				<ItemScope type="Product">
					<Col xs={12} md={12}>
						<ShoutHeader creator={shout.user}
									 listType={this.props.listType} agoText={ago} logoRight={this.alignRight()}
									 logoSrc={shout.user.image}/>
						<ShoutBody listType={this.props.listType} logoRight={this.alignRight()} shout={shout}/>
					</Col>
				</ItemScope>
			</section>
		);
	}
});
