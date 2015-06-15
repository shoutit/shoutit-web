import React from 'react';
import {FluxMixin, StoreWatchMixin} from 'fluxxor';
import {Col} from 'react-bootstrap';
import DocumentTitle from 'react-document-title';
import ShoutDetailBody from './shoutDetailBody.jsx';
import Loader from '../helper/loader.jsx';

export default React.createClass({
	displayName: "ShoutDetail",
	mixins: [new FluxMixin(React), new StoreWatchMixin("shouts")],

	contextTypes: {
		router: React.PropTypes.func
	},

	statics: {
		fetchData(client, session, params) {
			return client.shouts().get(session, params.shoutId);
		}
	},

	getStateFromFlux() {
		let shoutStore = this.getFlux().store("shouts"),
			storeState = shoutStore.getState(),
			findRes = shoutStore.findShout(this.context.router.getCurrentParams().shoutId);

		return {
			shoutId: this.context.router.getCurrentParams().shoutId,
			shout: findRes.shout,
			full: findRes.full,
			loading: storeState.loading
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
		var shout = this.state.shout,
			loading = this.state.loading;

		var content;

		if (shout && shout.id) {
			content =
				<DocumentTitle title={"Shoutit - " + shout.title}>
					<ShoutDetailBody shout={shout} flux={this.getFlux()}/>
				</DocumentTitle>;
		} else if (!loading && shout === null) {
			content = (
				<DocumentTitle title={"Shoutit - Not found"}>
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
			</Col>
		);
	}
});
