import React from 'react';
import {Button, Input} from 'react-bootstrap';
import {Icon} from '../helper';

export default React.createClass({
	displayName: "SearchTitle",

	renderInput() {
		return (
			<Input
				type="text"
				addonAfter={
				<Button className="chat-search-button" bsStyle="link">
					<Icon name="search-chat"/>
				</Button>
				}
				onChange={this.props.onTermChange}
				onKeyUp={this.onKeyUp}
				value={this.props.term}
				/>
		);
	},

	onKeyUp(ev) {
		if (ev.which === 13) {
			this.props.onSubmit();
		}
	},

	render() {
		return (
			<div className="listener-title search-shoutit">
				<p>Results</p>

				<div className="search-listener">
					<div className="chat-search">
						{this.renderInput()}
					</div>
				</div>
			</div>
		);
	}
});
