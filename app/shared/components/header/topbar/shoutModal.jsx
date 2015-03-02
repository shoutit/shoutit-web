

var React = require('react'),
	NavItem = require('react-bootstrap/NavItem'),
	Modal = require('react-bootstrap/Modal'),
	OverlayMixin = require('react-bootstrap/OverlayMixin');

var Icon = require('../../helper/icon.jsx');

var ShoutModal = React.createClass({
	render: function () {
		return (
			<Modal {...this.props}>
				<div className="modal-header">
					<button onClick={this.props.onRequestHide} type="button" className="close" data-dismiss="modal" aria-label="Close">
						<Icon name="nhan"/>
					</button>
				</div>
				<div className="modal-body">
					One fine body...
				</div>
			</Modal>
		);
	}
});

module.exports = React.createClass({
	displayName: "ShoutModalTrigger",

	mixins: [OverlayMixin],

	getInitialState: function () {
		return {
			isModalOpen: false
		};
	},

	toggle: function () {
		this.setState({
			isModalOpen: !this.state.isModalOpen
		});
	},

	show: function () {
		this.setState({isModalOpen: true});
	},

	close: function () {
		this.setState({isModalOpen: false});
	},

	render: function () {
		return (
			<NavItem onSelect={this.show}>
				<Icon name="plug-icon"/>
			</NavItem>
		);
	},

	renderOverlay: function () {
		if (!this.state.isModalOpen) {
			return <span/>;
		}

		return (
			<ShoutModal onRequestHide={this.close}/>
		);
	}
});