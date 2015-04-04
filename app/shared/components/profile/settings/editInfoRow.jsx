var React = require('react'),
	classNames = require('classnames'),
	Col = require('react-bootstrap/Col');

module.exports = React.createClass({
	displayName: "EditInfoRow",

	getInitialState: function () {
		return {
			edit: false,
			value: this.props.value || ""
		}
	},

	renderDescr: function () {
		return this.props.type !== "password" ? (
			<Col xs={12} sm={4} md={3}>
				<h4>{this.props.title}</h4>
			</Col>
		) : "";
	},

	renderInput: function () {
		var classes = {
			"t-edit-text": this.state.edit
		};

		var input = this.state.edit ?
			<input ref="input" type={this.props.type || "text"} value={this.state.value} onChange={this.handleChange}/> :
			<p>{this.state.value}</p>;

		return (
			<Col xs={12} sm={4} md={this.state.edit ? 5 : 7} className={classNames(classes)}>
			{input}
			</Col>
		)
	},

	renderButtons: function () {
		return (
			<Col xs={12} sm={4} md={this.state.edit ? 4 : 2} >
			{this.renderEditButton()}
			{this.renderSaveButton()}
			{this.renderCancelButton()}
			</Col>
		);
	},

	renderEditButton: function () {
		return this.state.edit ? "" : <p className="edit t-edit" onClick={this.onEditClick}>Edit</p>;
	},

	renderSaveButton: function () {
		return this.state.edit ?
			<Col xs={6} sm={6} md={7}>
				<p className="t-Save" onClick={this.onSaveClick}>Save</p>
			</Col>
			: "";
	},

	renderCancelButton: function () {
		return this.state.edit ?
			<Col xs={6} sm={6} md={5}>
				<p className="t-hiden" onClick={this.onCancelClick}>Cancel</p>
			</Col>
			: "";
	},

	renderPasswordInput: function () {
		var classes = {
			"t-edit-text": true,
			"t-fix-edit-text": true
		};

		return (
			<Col xs={12} sm={12} md={8}>
				<Col xs={12} sm={6} md={12} className={classNames(classes)}>
					<Col md={5} className="t-edit-left">
						<h4>New password</h4>
					</Col>
					<div className="t-edit-text">
						<input ref="passwordInput" type="password"/>
					</div>
				</Col>
				<Col xs={12} sm={6} md={12} className={classNames(classes)}>
					<Col md={5} className="t-edit-left">
						<h4>Retype new password</h4>
					</Col>
					<div className="t-edit-text">
						<input ref="passwordRetypeInput" type="password"/>
					</div>
				</Col>
			</Col>
		);
	},

	render: function () {
		var type = this.props.type || "text";
		var isEditState = this.state.edit;
		var classes = {
			"info-basic": true,
			"t-info-basic": !isEditState,
			"t-edit-info": isEditState
		};

		var renderedInput = type === "password" && isEditState ?
			this.renderPasswordInput() :
			this.renderInput();


		return (
			<div className={classNames(classes)}>
			{this.renderDescr()}
			{renderedInput}
			{this.renderButtons()}
			</div>
		);
	},

	handleChange: function (ev) {
		if (this.props.onChange) {
			this.props.onChange(ev.target.value);
		}
		this.setState({
			value: ev.target.value
		});
	},

	onEditClick: function () {
		this.setState({
			edit: true,
			oldValue: this.state.value
		});
	},

	onSaveClick: function () {
		if (this.props.onSaveClicked) {
			if (this.props.type === "password") {
				var password = this.refs.passwordInput.getDOMNode().value,
					retypePassword = this.refs.passwordRetypeInput.getDOMNode().value;
				if (password === retypePassword) {
					this.props.onSaveClicked({
						value: [password, retypePassword]
					});
				}
			} else {
				this.props.onSaveClicked(this.state.value);
			}
		}
		this.setState({
			edit: false
		});
	},

	onCancelClick: function () {
		if (this.props.onChange) {
			this.props.onChange(this.state.oldValue);
		}

		this.setState({
			edit: false,
			value: this.state.oldValue
		});
	}

});