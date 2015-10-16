import React from 'react';
import {Link} from 'react-router';
import {Image} from '../helper';
import ListenButton from '../helper/listenButton.jsx';

export default React.createClass({
	displayName: "ListenerRow",

	onButtonChange(ev) {
		if(this.props.onChange) {
			this.props.onChange(ev);
		}
	},

	render() {
		let listener = this.props.user;
		let flux = this.props.flux;

		return (
			<div className="listener-dt">
				<div className="listener-dt-img">
					<Image infix="user" size="small" src={listener.image}/>
				</div>
				<div className="listener-dt-info">
					<h4>{listener.name}&nbsp;
						(
						<Link to="user" params={{username: encodeURIComponent(listener.username)}}>
							{listener.username}
						</Link>
						)
					</h4>
					<ListenButton key={listener.id} username={listener.username} onChange={this.onButtonChange} flux={flux}/>
				</div>
			</div>
		);
	}
});
