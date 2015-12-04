import React from 'react';
import {StoreWatchMixin} from 'fluxxor';
import DocumentTitle from 'react-document-title';
import ShoutDetailBody from './shoutDetailBody.jsx';
import Loader from '../helper/loader.jsx';
import ShoutReplySection from './shoutReplySection.jsx';
import ShoutExtra from './shoutExtra.jsx';
import {Column, Grid} from '../helper';

var USER_EXTRA_SHOUTS_LIMIT = 3;

export default React.createClass({
	displayName: "ShoutDetail",
	mixins: [new StoreWatchMixin('shouts', 'locations', 'users')],

	statics: {
		fetchId: 'shout',
		fetchData(client, session, params) {
			return client.shouts().get(session, params.shoutId);
		}
	},

	getStateFromFlux() {
		let shoutStore = this.props.flux.store("shouts"),
			userStoreState = this.props.flux.store("users").getState(),
			shoutStoreState = JSON.parse(JSON.stringify(shoutStore.getState())),
			current = this.props.flux.store("locations").getState().current,
			findRes = shoutStore.findShout(this.props.params.shoutId);

		return {
			shoutId: this.props.params.shoutId,
			shout: findRes.shout || {},
			full: findRes.full,
			loading: shoutStoreState.loading,
			user: userStoreState.user,
			userShouts: userStoreState.shouts,
			relatedShouts: shoutStoreState.relatedShouts,
			replyDrafts: shoutStoreState.replyDrafts,
			current: current
		};
	},

	componentDidUpdate(prevProps, prevState) {
		// conditiones are critical to make the transition between shouts and loading extra shouts smoothly happen
		// DO NOT change if you are not sure what exactly is happening
		// setTimeouts are here to prevent action dispatching collide
		// TODO: Refactor later by doing all the tasks in store
		if(prevProps.params.shoutId !== this.props.params.shoutId) {
			setTimeout(() => {
				this.props.flux.actions.loadShout(this.props.params.shoutId);
			},0);
		}

		let shout = this.state.shout;
		if(shout.id) {
			if (shout.id !== this.props.params.shoutId) {
				setTimeout(() => {
					this.props.flux.actions.loadUserShouts(shout.user.username, 'offer', USER_EXTRA_SHOUTS_LIMIT);
					this.props.flux.actions.loadRelatedShouts(shout.id);
				},0);
			}
		}

		if(prevState.shout.id !== this.state.shout.id){
			setTimeout(() => {
				this.props.flux.actions.loadUserShouts(shout.user.username, 'offer', USER_EXTRA_SHOUTS_LIMIT);
				this.props.flux.actions.loadRelatedShouts(shout.id);
			},0);
		}
	
	},

	componentDidMount() {
		let shout = this.state.shout;
		setTimeout(() => {
			this.props.flux.actions.loadShout(this.props.params.shoutId);
			if(shout.id) { //happens when loading shout page directly
				this.props.flux.actions.loadUserShouts(shout.user.username, 'offer', USER_EXTRA_SHOUTS_LIMIT);
				this.props.flux.actions.loadRelatedShouts(shout.id);
			}
		},0);
	},

	render() {
		let shout = this.state.shout,
			loading = this.state.loading,
			username = shout.id? shout.user.username: null,
			content,
			extraShouts = {};

		extraShouts.more = username? this.state.userShouts[username]: null;
		extraShouts.related = shout? this.state.relatedShouts[shout.id]: null;

		if (shout.id) {
			content =
				<DocumentTitle title={shout.title + " - Shoutit"}>
					<div>
						<ShoutDetailBody shout={shout} 
										 current={this.state.current}
										 flux={this.props.flux} 
										 />
						<ShoutExtra extra={extraShouts}
									creator={shout.user}
									flux={this.props.flux}
								/>
					</div>
				</DocumentTitle>;
		} else if (!loading && shout === null) {
			content = (
				<DocumentTitle title={"Not found - Shoutit"}>
					<Grid fluid={true}>
						<h1>Shout not found!</h1>
					</Grid>
				</DocumentTitle>
			);
		} else {
			content = (
				<Grid fluid={true}>
					<Loader/>
				</Grid>
			);
		}

		return (
			<div>
				{content}
			</div>
		);
	}

	// onReplyTextChange(e) {
	// 	this.props.flux.actions.changeReplyDraft(this.state.shoutId, e.target.value);
	// },

	// onReplySendClicked() {
	// 	this.props.flux.actions.sendShoutReply(this.state.shoutId, this.state.replyDrafts[this.state.shoutId]);
	// }
});
/*
<ShoutReplySection
	shout={shout}
	user={this.state.user}
	onReplyTextChange={this.onReplyTextChange}
	onReplySendClicked={this.onReplySendClicked}
	replyDrafts={this.state.replyDrafts}/>
	*/