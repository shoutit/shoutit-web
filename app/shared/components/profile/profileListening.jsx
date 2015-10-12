import React from 'react';
import {Col} from 'react-bootstrap';
import {Loader, Clear} from '../helper';
import ListenerRow from './listenerRow.jsx';
import ViewportSensor from '../misc/ViewportSensor.jsx';

export default React.createClass({
	displayName: "ProfileListening",

	statics: {
		fetchData(client, session, params) {
			return client.users().getListening(session, params.username);
		}
	},

	componentDidMount() {
		let username = this.props.username;
		this.props.flux.actions.loadUserListening(username);

	},

	render() {
		let p = this.props,
			username = p.username,
			loggedUser = p.user,
			listening = p.listens[username]? p.listens[username].listenings.list : null,
			flux = p.flux,
			listeningChildren, stat;

		if (listening) {
			listeningChildren = listening.length ? 
				listening.map(function (listener, i) {
					return (
						<ListenerRow key={"listening-" + username + '-' + i} user={listener}
								listening={true} loggedUser={loggedUser} flux={flux}/>
					);
				})
				:
				!this.props.loading? <h4>You aren't listening to any other user.</h4>: [];
		} else {
			listeningChildren = <Loader/>;
		}

		return (
			<Col xs={12} md={12} className="content-listener">
				<div className="listener">
					<div className="listener-title">
						<p>Listeners:</p>
					</div>
					<Clear/>

					<div className="listener-scroll" tabIndex="5000" style={{overflow: "hidden", outline: "none"}}>
						{listeningChildren}
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
		this.props.flux.actions.loadMoreUserListening(this.props.username);
	}
});
