import React from 'react';
import {Col} from 'react-bootstrap';
import findIndex from 'lodash/array/findIndex';
import {Loader, Clear} from '../helper';
import ViewportSensor from '../misc/ViewportSensor.jsx';
import ListenerRow from './listenerRow.jsx';

export default React.createClass({
	displayName: "ProfileListeners",

	statics: {
		fetchData(client, session, params) {
			return client.users().getListeners(session, params.username);
		}
	},

	componentDidMount() {
		let username = this.props.username;
		this.props.flux.actions.loadUserListeners(username);
	},

	render() {
		console.log(this.props);
		let p = this.props,
			username = p.username,
			loggedUser = p.user,
			listening = p.listens[loggedUser]? p.listens[loggedUser].listenings.list: [],
			listeners = p.listens[username].listeners.list,
			flux = p.flux,
			listenerChildren, stat;

		if (listeners) {
			listenerChildren = listeners.length ?
				listeners.map(function (listener, i) {
					let isListening = findIndex(listening, 'username', listener.username) > -1;
					return (
						<ListenerRow key={"listener-" + username + '-' + i } user={listener}
									listening={isListening} loggedUser={loggedUser} flux={flux}/>
					);
				})
				:
				!this.props.loading? <h4>You don't have any listeners</h4>: [];
		} else {
			listenerChildren = <Loader/>;
		}

		return (
			<Col xs={12} md={12} className="content-listener">
				<div className="listener">
					<div className="listener-title">
						<p>Listeners:</p>
					</div>
					<Clear/>

					<div className="listener-scroll" tabIndex="5000" style={{overflow: "hidden", outline: "none"}}>
						{listenerChildren}
						{this.renderViewportSensor()}
					</div>
				</div>
			</Col>
		);
	},

	renderViewportSensor() {
		if(this.props.loading) {
			return (
				<section>
						<Col xs={12} md={12}>
							<Loader />
						</Col>
				</section>);
		} else {
			return (
				<section>
					<Col xs={12} md={12}>
						<ViewportSensor onChange={this.onLastVisibleChange}></ViewportSensor>
					</Col>
				</section>);
		}
	},

	onLastVisibleChange(isVisible) {
		if (isVisible) {
			this.loadMore();
		}
	},

	loadMore() {
		this.props.flux.actions.loadMoreUserListeners(this.props.username);
	}
});
