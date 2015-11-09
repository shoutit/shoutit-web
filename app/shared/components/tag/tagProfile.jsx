import React from 'react';
import {StoreWatchMixin} from 'fluxxor';
import Loader from '../helper/loader.jsx';
import {Col, NavItem} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';
import {Clear, Icon} from '../helper';
import DocumentTitle from 'react-document-title';
import TagProfileImage from './tagProfileImage.jsx';
import TagListenButton from '../helper/tagListenButton.jsx';
import NotificationSystem from 'react-notification-system';
var objectAssign = require('object-assign');

let STORE_NAME = "tags";

export default React.createClass({
	mixins: [new StoreWatchMixin(STORE_NAME)],
	_notificationSystem: null,
	displayName: "TagProfile",

	statics: {
		fetchId: 'tag',
		fetchData(client, session, params) {
			return client.tags().get(session, params.tagName);
		}
	},

	getStateFromFlux() {
		return this.props.flux.store(STORE_NAME).getState();
	},

	displayNotif(msg, type = 'success') {
        this._notificationSystem.addNotification({
            message: msg,
            level: type,
            position: 'tr', // top right
            autoDismiss: 4
        });
    },

	render() {
		let tagName = this.props.params.tagName,
			tagEntry = this.state.tags[tagName];

		if (tagEntry) {
			let linkParams = {tagName: encodeURIComponent(tagName)},
				tag = JSON.parse(JSON.stringify(tagEntry.tag)),
				listenerCount = tag.listeners_count,
				childProps = objectAssign({tagName: tagName, flux: this.props.flux},this.state);

			return (
				<DocumentTitle title={tag.name + " - Shoutit"}>
					<div className="profile">
						<Col xs={12} md={3} className="profile-left">
							<TagProfileImage image={tag.image} name={tag.name}/>
							<TagListenButton tag={tag} onChange={this.handleListen} flux={this.props.flux }/>
							<Clear/>
							<ul>
								<LinkContainer to={`/tag/${linkParams}`}>
									<NavItem>
										Offers
									</NavItem>
								</LinkContainer>
								<LinkContainer to={`/tag/${linkParams}/tagrequests`}>
									<NavItem>
										Requests
									</NavItem>
								</LinkContainer>
								<LinkContainer to={`/tag/${linkParams}/taglisteners`}>
									<NavItem>
										Listeners
										<span>{listenerCount}</span>
									</NavItem>
								</LinkContainer>
							</ul>
						</Col>
						<Col xs={12} md={9} className="pro-right-padding">
							{React.cloneElement(this.props.children, childProps)}
						</Col>
						<NotificationSystem ref="notificationSystem" />
					</div>
				</DocumentTitle>
			);
		} else if (!this.state.loading && tagEntry === null) {
			return (
				<DocumentTitle title="Not Found - Shoutit">
					<div className="profile">
						<Col xs={12} md={3} className="profile-left">
						</Col>
						<Col xs={12} md={9} className="pro-right-padding">
							<h3>Tag not found.</h3>
						</Col>
					</div>
				</DocumentTitle>
			);
		} else {
			return (
				<DocumentTitle title="Loading - Shoutit">
					<div className="profile">
						<Col xs={12} md={3} className="profile-left">
							<Loader/>
						</Col>
						<Col xs={12} md={9} className="pro-right-padding">
							<Loader/>
						</Col>
					</div>
				</DocumentTitle>
			);
		}
	},

	componentDidUpdate() {
		this.loadTag();
		this._notificationSystem = this.refs.notificationSystem;
	},

	componentDidMount() {
		this.loadTag();
		this._notificationSystem = this.refs.notificationSystem;
	},

	handleListen(ev) {
		if(ev.isListening) {
			this.displayNotif(`You are listening to ${ev.tag}`);
		} else {
			this.displayNotif(`You are no longer listening to ${ev.tag}`, 'warning');
		}
	},

	loadTag() {
		let tagName = this.props.params.tagName,
			tagEntry = this.state.tags[tagName];

		if (!this.state.loading && !tagEntry && tagEntry !== null) {
			this.props.flux.actions.loadTag(tagName);
		}
	}
});
