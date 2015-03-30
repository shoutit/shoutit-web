var React = require('react'),
	classNames = require('classnames'),
	Col = require('react-bootstrap/Col');

module.exports = React.createClass({
	displayName: "EditInfoRow",

	getInitialState: function () {
		return {
			edit: false,
			value: this.props.value
		}
	},

	renderDescr: function () {
		return (
			<Col xs={12} sm={4} md={3}>
				<h4>{this.props.title}</h4>
			</Col>
		);
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

	render: function () {
		var isEditState = this.state.edit;
		var classes = {
			"info-basic": true,
			"t-info-basic": !isEditState,
			"t-edit-info": isEditState
		};

		return (
			<div className={classNames(classes)}>
			{this.renderDescr()}
			{this.renderInput()}
			{this.renderButtons()}
			</div>
		);
	},

	handleChange: function(ev) {
		if(this.props.onChange) {
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
		if(this.props.onSaveClicked) {
			this.props.onSaveClicked(this.state.value);
		}
		this.setState({
			edit: false
		});
	},

	onCancelClick: function () {
		if(this.props.onChange) {
			this.props.onChange(this.state.oldValue);
		}

		this.setState({
			edit: false,
			value: this.state.oldValue
		});
	}

});