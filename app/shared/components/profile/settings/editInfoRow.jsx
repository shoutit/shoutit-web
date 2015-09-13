import React from 'react';
import classNames from 'classnames';
import {Col} from 'react-bootstrap';

export default React.createClass({
	displayName: "EditInfoRow",

	getInitialState() {
		return {
			edit: false,
			value: this.props.value || "",
			errorCheck: '',
			verifyClicked: false
		};
	},

	renderDescr() {
		return this.props.type !== "password" || 
			this.props.type === "password" && !this.state.edit? (
				<Col xs={12} sm={4} md={3}>
					<h4>{this.props.title}</h4>
				</Col>
		) : null;
	},

	renderInput() {
		let classes = {
			"t-edit-text": this.state.edit
		};

		let input = this.state.edit ?
			<input ref="input" type={this.props.type || "text"} value={this.state.value}
				   onChange={this.handleChange}/> :
			<p>{this.state.value}
				<span style={{fontSize:'12px',color:'#A0A0A0'}}>
					{this.props.settings.loading? '[Loading...]': ''}{!this.state.errorCheck? this.props.settings.msg: ''}
				</span>
				<span style={{fontSize:'12px',color:'#e65653'}}>
					{this.state.errorCheck}
				</span>
			</p>;

		return (
			<Col xs={12} sm={4} md={5} className={classNames(classes)}>
				{input}
			</Col>
		);
	},

	renderButtons() {
		return (
			<Col xs={12} sm={4} md={4}>
				{this.renderEditButton()}
				{this.renderVerifyButton()}
				{this.renderSaveButton()}
				{this.renderCancelButton()}
			</Col>
		);
	},

	renderEditButton() {
		return this.state.edit ? null : <p className="edit" onClick={this.onEditClick}>Edit</p>;
	},

	renderVerifyButton() {
		let btn;
		if (this.props.settings.has_verify_btn && !this.state.edit){

			if (this.props.settings.is_verified){
				btn = <p className="edit lg-btn verified" 
					onClick={this.onVerifyClick}>Email Verified</p>;
			}
			else if (this.state.verifyClicked){
				btn = <p className="edit lg-btn verified" 
					onClick={this.onVerifyClick}>Email Sent</p>;
			}
			else {
				btn = <p className="edit lg-btn" 
					onClick={this.onVerifyClick}>Resend Verification</p>;
			}
			return btn;
		}
	},

	renderSaveButton() {
		return this.state.edit ?
			<Col xs={6} sm={6} md={7}>
				<p className="t-Save" onClick={this.onSaveClick}>Save</p>
			</Col>
			: null;
	},

	renderCancelButton() {
		return this.state.edit ?
			<Col xs={6} sm={6} md={5}>
				<p className="t-hiden" onClick={this.onCancelClick}>Cancel</p>
			</Col>
			: null;
	},

	renderPasswordInput() {
		let classes = {
			"t-edit-text": true,
			"t-fix-edit-text": true
		};

		let oldPassField;
		if (this.props.settings['has_old_password']) {
			oldPassField = 
				<Col xs={12} sm={6} md={12} className={classNames(classes)}>
					<Col md={5} className="t-edit-left">
						<h4>Current password</h4>
					</Col>
					<div className="t-edit-text">
						<input ref="oldPasswordInput" type="password"/>
					</div>
				</Col>;
		}


		return (
			<Col xs={12} sm={12} md={8}>
				{oldPassField}
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

	render() {
		let type = this.props.type || "text";
		let isEditState = this.state.edit;
		let classes = {
			"info-basic": true,
			"t-info-basic": !isEditState,
			"t-edit-info": isEditState,
			"change-pass": type==='password'
		};

		let renderedInput = type === "password" && isEditState ?
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

	handleChange(ev) {
		if (this.props.onChange) {
			this.props.onChange(ev.target.value);
		}
		this.setState({
			value: ev.target.value
		});
	},

	onEditClick() {
		this.setState({
			edit: true,
			oldValue: this.state.value
		});
	},

	onVerifyClick() {
		if(this.props.onVerifyClicked) {
			this.props.onVerifyClicked(this.props.type);
			setTimeout(()=> this.setState({verifyClicked: true}),500);
		}
	},

	onSaveClick() {
		if (this.props.onSaveClicked) {
			if (this.props.type === "password") {
				let forms = this.validateField();

				if (forms.validated) {
					this.setState({errorCheck:''});
					this.props.onSaveClicked(forms.output);
				} else {
					this.dropError(forms.message);
				}
			} else {
				this.props.onSaveClicked(this.state.value);
			}
		}
		this.setState({edit: false});
	},

	validateField() {
		let validated = false,
			output = {},
			msg = '',
			propType = this.props.type,
			hasOldPass = this.props.settings['has_old_password'];

		if(propType === "password") {
			let oldPassword = hasOldPass?
				this.refs.oldPasswordInput.getDOMNode().value: "NOTNEEDED";
			let password = this.refs.passwordInput.getDOMNode().value,
				retypePassword = this.refs.passwordRetypeInput.getDOMNode().value;
			
			oldPassword === '' ? msg = "Current password should be specified":
				password !== retypePassword? msg = "Passwords should be equal":
				password.length < 6? msg = "Passwords should has at least 6 characters":
				validated = true;

			output = hasOldPass?
				{value: [oldPassword, password, retypePassword]}:
				{value: [password, retypePassword]};
		}

		return {
			validated: validated,
			message: msg,
			output: output
		}
	},

	onCancelClick() {
		if (this.props.onChange) {
			this.props.onChange(this.state.oldValue);
		}

		this.setState({
			edit: false,
			value: this.state.oldValue
		});
	},

	dropError(message) {
		this.setState({errorCheck:message});
	}

});
