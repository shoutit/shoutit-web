import React from 'react';
import {FluxMixin, StoreWatchMixin} from 'fluxxor';
import {Modal} from 'react-bootstrap';
import Icon from '../helper/icon.jsx';
import ShoutForm from './form/shoutForm.jsx';

export default React.createClass({
	displayName: "ShoutModal",
	mixins: [new FluxMixin(React), new StoreWatchMixin('shouts')],

	getStateFromFlux() {
		let storeState = this.getFlux().store('shouts').getState(),
			locationState = this.getFlux().store('locations').getState().current;
		return {
			currencies: storeState.currencies,
			draft: storeState.draft,
			current: locationState
		};
	},

	render() {
		return (
			<Modal {...this.props} bsSize="large">
				<div className="modal-header">
					<button onClick={this.props.onRequestHide} type="button" className="close" data-dismiss="modal"
							aria-label="Close">
						<Icon name="nhan"/>
					</button>
				</div>
				<div className="modal-body">
					<div className="modal-logo">
						<div className="logo">
							<img src="/img/logo2.png"/>
						</div>
						<div className="slogun">
							<p>Shout an Offer</p>
						</div>
					</div>
					<ShoutForm {...this.state} flux={this.props.flux}/>
				</div>
			</Modal>
		);
	}
});
