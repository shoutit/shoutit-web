import React from 'react';
import {State} from 'react-router';
import {FluxMixin, StoreWatchMixin} from 'fluxxor';
import {Col} from 'react-bootstrap';
import DocumentTitle from 'react-document-title';
import ShoutDetailBody from './shoutDetailBody.jsx';
import Loader from '../helper/loader.jsx';
import ShoutReplySection from './shoutReplySection.jsx';

export default React.createClass({
	displayName: "ShoutDetail",
	mixins: [new FluxMixin(React), new StoreWatchMixin("shouts"), State],

	statics: {
		fetchData(client, session, params) {
			return client.shouts().get(session, params.shoutId);
		}
	},

	getStateFromFlux() {
		let shoutStore = this.getFlux().store("shouts"),
			userStoreState = this.getFlux().store("users").getState(),
			shoutStoreState = shoutStore.getState(),
			findRes = shoutStore.findShout(this.getParams().shoutId);

		return {
			shoutId: this.getParams().shoutId,
			shout: findRes.shout,
			full: findRes.full,
			loading: shoutStoreState.loading,
			user: userStoreState.user,
			replyDrafts: shoutStoreState.replyDrafts
		};
	},

	componentDidUpdate() {
		this.loadFullShout();
	},

	componentDidMount() {
		this.loadFullShout();
	},

	loadFullShout() {
		if (!this.state.loadingFull && !this.state.full) {
			this.setState({
				loadingFull: true
			});
			this.getFlux().actions.loadShout(this.state.shoutId);
		}
	},

	render() {
		let shout = this.state.shout,
			loading = this.state.loading;

		let content;

		if (shout && shout.id) {
			content =
				<DocumentTitle title={shout.title + " - Shoutit"}>
					<ShoutDetailBody shout={shout} flux={this.getFlux()}/>
				</DocumentTitle>;
		} else if (!loading && shout === null) {
			content = (
				<DocumentTitle title={"Not found - Shoutit"}>
					<Col xs={12} md={12} className="section-right">
						<h1>Shout not found!</h1>
					</Col>
				</DocumentTitle>
			);
		} else {
			content = (
				<Col xs={12} md={12} className="section-right">
					<Loader/>
				</Col>
			);
		}

		return (
			<Col xs={12} md={8}>
				<section className="col-xs-12 col-md-12 section-12">
					{content}
				</section>
				<ShoutReplySection
					shout={shout}
					user={this.state.user}
					onReplyTextChange={this.onReplyTextChange}
					onReplySendClicked={this.onReplySendClicked}
					replyDrafts={this.state.replyDrafts}/>
			</Col>
		);
	},

	onReplyTextChange(e) {
		this.getFlux().actions.changeReplyDraft(this.state.shoutId, e.target.value);
	},

	onReplySendClicked() {
		this.getFlux().actions.sendShoutReply(this.state.shoutId, this.state.replyDrafts[this.state.shoutId]);
	}
});
