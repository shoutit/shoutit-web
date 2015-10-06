import React from 'react';
import {State} from 'react-router';
import {RouteHandler} from 'react-router';
import {FluxMixin, StoreWatchMixin} from 'fluxxor';
import Loader from '../helper/loader.jsx';

import {Col} from 'react-bootstrap';
import {NavItemLink} from 'react-router-bootstrap';

import {Clear, Icon} from '../helper';
import DocumentTitle from 'react-document-title';

import TagProfileImage from './tagProfileImage.jsx';
import TagProfileActions from './tagProfileActions.jsx';

let STORE_NAME = "tags";

export default React.createClass({
	mixins: [new FluxMixin(React), new StoreWatchMixin(STORE_NAME), State],

	displayName: "TagProfile",

	statics: {
		fetchData(client, session, params) {
			return client.tags().get(session, params.tagName);
		}
	},

	getStateFromFlux() {
		return this.getFlux().store(STORE_NAME).getState();
	},

	render() {
		let tagName = this.getParams().tagName,
			tagEntry = this.state.tags[tagName];

		if (tagEntry) {
			let linkParams = {tagName: encodeURIComponent(tagName)},
				tag = tagEntry.tag,
				listenerCount = tag.listeners_count;

			return (
				<DocumentTitle title={tag.name + " - Shoutit"}>
					<div className="profile">
						<Col xs={12} md={3} className="profile-left">
							<TagProfileImage image={tag.image} name={tag.name}/>
							<TagProfileActions tag={tag} status={this.state.status} flux={this.getFlux() }/>
							<Clear/>
							<ul>
								<NavItemLink to="tagoffers" params={linkParams}>
									<Icon name="lis2"/>
									Offers
									<span/>
								</NavItemLink>
								<NavItemLink to="tagrequests" params={linkParams}>
									<Icon name="lis3"/>
									Requests
									<span/>
								</NavItemLink>
								<NavItemLink to="taglisteners" params={linkParams}>
									<Icon name="lis"/>
									Listeners
									<span>{listenerCount}</span>
								</NavItemLink>
							</ul>
						</Col>
						<Col xs={12} md={9} className="pro-right-padding">
							<RouteHandler {...this.state}
								tagName={tagName}
								flux={this.getFlux()}
								/>
						</Col>
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
	},

	componentDidMount() {
		this.loadTag();
	},

	loadTag() {
		let tagName = this.getParams().tagName,
			tagEntry = this.state.tags[tagName];

		if (!this.state.loading && !tagEntry && tagEntry !== null) {
			this.getFlux().actions.loadTag(tagName);
		}
	}
});
