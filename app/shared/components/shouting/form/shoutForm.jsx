import React from 'react';
import {FluxMixin} from 'fluxxor';

import {Row, Col, Button, Input, DropdownButton, MenuItem} from 'react-bootstrap';
import TagsInput from 'react-tagsinput';

import map from 'lodash/collection/map';

import Clearfix from '../../helper/clearFix.jsx';
import LocationSelection from './locationSelection.jsx';

const shoutTypes = {
	offer: "Offer",
	request: "Request"
};

export default React.createClass({
	displayName: "ShoutForm",
	mixins: [new FluxMixin(React)],

	getInitialState() {
		return {
			gmap: null,
			marker: null
		};
	},

	renderTitleInput() {
		return (
			<Input type="text"
				   placeholder="What are you shouting about?"
				   value={this.props.draft.title}
				   onChange={this.onTextChange("title")}
				/>
		);
	},

	onTextChange(key) {
		return function (event) {
			this.getFlux().actions.changeShoutDraft(key, event.target.value);
		}.bind(this);
	},

	renderPriceInput() {
		return (
			<Input type="number"
				   className="price"
				   placeholder="1.000"
				   value={this.props.draft.price}
				   onChange={this.onTextChange('price')}
				   buttonAfter={this.renderCurrencyDropdown()}
				/>
		);
	},

	renderCurrencyDropdown() {
		let currencies = map(this.props.currencies, (currency) => (
				<MenuItem eventKey={"currency:" + currency.code}>
					{currency.name + "(" + currency.code + ")"}
				</MenuItem>)
		);

		let selected = this.props.draft.currency || this.props.currencies['AED'],
			title = selected.name + "(" + selected.code + ")";

		return (
			<DropdownButton
				bsStyle="pills"
				onSelect={this.onCurrencySelect}
				title={title}>
				{currencies}
			</DropdownButton>
		);
	},

	renderCategoryDropdown() {
		let categories = map(this.props.categories, (category, i) => (
				<MenuItem eventKey={"category:" + i}>
					{category.name}
				</MenuItem>)
		);

		let selected = this.props.draft.category,
			title = selected ? selected.name : "Select a category";

		return (
			<DropdownButton
				className="categoryDropdown"
				block
				bsStyle="pills"
				onSelect={this.onCategorySelect}
				title={title}>
				{categories}
			</DropdownButton>
		);
	},

	onCurrencySelect(key) {
		var code = key.split(":")[1];
		this.getFlux().actions.changeShoutDraft("currency", this.props.currencies[code]);
	},

	onCategorySelect(key) {
		var index = key.split(":")[1];
		this.getFlux().actions.changeShoutDraft("category", this.props.categories[index]);
	},

	renderDescTextArea() {
		return (
			<Input type='textarea'
				   rows="3"
				   onChange={this.onTextChange('text')}
				   value={this.props.draft.text}
				   placeholder="Description"/>
		);
	},

	renderTypeSelect()
	{
		let options = map(shoutTypes, (value, key) => {
			return (
				<MenuItem eventKey={"type:" + key}>
					{value}
				</MenuItem>
			);
		});


		let title = shoutTypes[this.props.draft.type];

		return (
			<DropdownButton
				bsStyle="pills"
				onSelect={this.onTypeSelect}
				title={title}>
				{options}
			</DropdownButton>
		);
	}
	,

	onTypeSelect(key)
	{
		var type = key.split(":")[1];
		this.getFlux().actions.changeShoutDraft("type", type);
	}
	,

	renderTagInput()
	{
		return (
			<div className="form-group">
				<TagsInput ref='tags' value={this.props.draft.tags}
						   onChange={this.onTagsChange}
						   placeholder="Add a key word" addKeys={[9, 13, 32]}>
				</TagsInput>
			</div>
		);
	}
	,

	onTagsChange(newTags) {
		this.getFlux().actions.changeShoutDraft("tags", newTags);
	},

	render() {
		return (
			<div className="modal-form">
				<form>
					<Row>
						<Col sm={7} md={7}>
							{this.renderTitleInput()}
						</Col>
						<Col sm={5} md={5}>
							{this.renderPriceInput()}
						</Col>
					</Row>
					<Clearfix/>
					<Row>
						<Col sm={12} md={12}>
							{this.renderDescTextArea()}
						</Col>
					</Row>
					<Row>
						<Col sm={2} md={2}>
							{this.renderTypeSelect()}
						</Col>
						<Col sm={4} md={4}>
							{this.renderCategoryDropdown()}
						</Col>
						<Col sm={12} md={6}>
							{this.renderTagInput()}
						</Col>
					</Row>
					<Row>
						<Col sm={12} md={12}>
							Click on the Map to select a location.
						</Col>
					</Row>
					<Row>
						<LocationSelection
							onChange={this.onLocationSelectionChange}
							flux={this.props.flux}
							selected={this.props.draft.latLng}
							startLocation={this.props.current.location}
							/>
					</Row>
					<Row className="row-submit">
						<Button onClick={this.onSubmit} className="btn-submit submit">
							Shoutit!
						</Button>
					</Row>
				</form>
			</div>
		);
	}
	,

	onSubmit() {
		this.getFlux().actions.sendShout();
		if(this.props.requestHide) {
			this.props.requestHide();
		}
	},

	onLocationSelectionChange(newLatLng) {
		this.getFlux().actions.changeShoutDraft("latLng", newLatLng);
	}
});
