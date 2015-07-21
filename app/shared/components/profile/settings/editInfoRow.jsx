import React from 'react';
import classNames from 'classnames';
import {Col} from 'react-bootstrap';

export default React.createClass({
	displayName: "EditInfoRow",

	getInitialState() {
		return {
			edit: false,
			value: this.props.value || ""
		};
	},

	renderDescr() {
		return this.props.type !== "password" ? (
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
			<p>{this.state.value}</p>;

		return (
			<Col xs={12} sm={4} md={this.state.edit ? 5 : 7} className={classNames(classes)}>
				{input}
			</Col>
		);
	},

	renderButtons() {
		return (
			<Col xs={12} sm={4} md={this.state.edit ? 4 : 2}>
				{this.renderEditButton()}
				{this.renderSaveButton()}
				{this.renderCancelButton()}
			</Col>
		);
	},

	renderEditButton() {
		return this.state.edit ? null : <p className="edit t-edit" onClick={this.onEditClick}>Edit</p>;
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

	render() {
		let type = this.props.type || "text";
		let isEditState = this.state.edit;
		let classes = {
			"info-basic": true,
			"t-info-basic": !isEditState,
			"t-edit-info": isEditState
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

	onSaveClick() {
		if (this.props.onSaveClicked) {
			if (this.props.type === "password") {
				let password = this.refs.passwordInput.getDOMNode().value,
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

	onCancelClick() {
		if (this.props.onChange) {
			this.props.onChange(this.state.oldValue);
		}

		this.setState({
			edit: false,
			value: this.state.oldValue
		});
	}

});
