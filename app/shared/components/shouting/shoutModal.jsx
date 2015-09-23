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
			locationState = this.getFlux().store('locations').getState().current,
			username = this.getFlux().store('users').getState().user;
		return {
			currencies: storeState.currencies,
			categories: storeState.categories,
			draft: storeState.draft,
			current: locationState,
			status:storeState.status,
			waiting: storeState.waiting,
			username: username
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
					<ShoutForm {...this.state}
						requestHide={this.props.onRequestHide}
						flux={this.props.flux}/>
				</div>
			</Modal>
		);
	}
});
