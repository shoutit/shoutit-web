import React from 'react';
import Router from 'react-router';
import {FluxMixin} from 'fluxxor';
import {Row, Col, Button, Input, DropdownButton, MenuItem} from 'react-bootstrap';
import TagsInput from 'react-tagsinput';
import DropzoneComponent from 'react-dropzone-component';

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
			marker: null,
			files: []
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

		let selected = this.props.draft.currency,
			title = selected ? selected.name : "Select a currency";

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

	renderImageUpload() {
		let componentConfig = {
			allowedFiletypes: ['.jpg', '.png'],
			showFiletypeIcon: true,
			postUrl: '/services/image_upload'
		}
		var eventHandlers = {
			init: null,
			addedfile: null,
			removedfile: this.onImageRemoved,
			uploadprogress: null,
			sending: null,
			success: this.onImageUploaded,
			complete: null,
			maxfilesexceeded: null
		}
		let djsConfig = {
			paramName: "shout_image",
			maxFilesize: 5, // 5 MB
			addRemoveLinks: true,
			maxFiles: 7,
			dictCancelUpload:''
		}
		return <DropzoneComponent config={componentConfig} 
                       eventHandlers={eventHandlers} 
                       djsConfig={djsConfig} />;
	},


	onImageUploaded(file, resp) {
		let files = this.state.files.slice(),
			filesList=[];

		files.push({name: file.name,remoteName: resp});
		filesList = files.map((item)=>item.remoteName);

		this.setState({files:files});
		this.getFlux().actions.changeShoutDraft("images", filesList);
	},

	onImageRemoved(file) {
		let files = this.state.files.slice(),
			cleanedFiles,
			deletedImageName,
			filesList=[];

		// getting the name of the image on s3 server and removing url part
		deletedImageName = files.filter((item)=> item.name === file.name)[0]
										.remoteName.match(/[^\/]*$/)[0];
		cleanedFiles = files.filter((val) => val.name !== file.name);
		filesList = cleanedFiles.map((item)=>item.remoteName);
		
		this.setState({files:cleanedFiles});
		this.getFlux().actions.changeShoutDraft("images", filesList);
		this.getFlux().actions.removeShoutImage(deletedImageName);
	},

	onCurrencySelect(key) {
		let code = key.split(":")[1];
		this.getFlux().actions.changeShoutDraft("currency", this.props.currencies[code]);
	},

	onCategorySelect(key) {
		let index = key.split(":")[1];
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

	renderTypeSelect() {
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
	},

	onTypeSelect(key) {
		let type = key.split(":")[1];
		this.getFlux().actions.changeShoutDraft("type", type);
	},

	renderTagInput() {
		return (
			<div className="form-group">
				<TagsInput ref='tags' value={this.props.draft.tags}
						   onChange={this.onTagsChange}
						   placeholder="Add a key word" addKeys={[9, 13, 32]}>
				</TagsInput>
			</div>
		);
	},

	onTagsChange(newTags) {
		this.getFlux().actions.changeShoutDraft("tags", newTags);
	},

	componentDidUpdate() {
		let status = this.props.status;
		if(status) {
			if(status.id) { 
				// Shout sent successfully
				window.location = status.web_url;
			}
		}
	},

	renderErrors() {
		let status = this.props.status;
		if(status) {
			if(!status.id) {
				let errors=[];

				for(let err in status) {
					errors.push(<p>{status[err]}</p>);
				}
				return errors;
			}
		}
	},

	render() {
		return (
			<div className="modal-form">
				<form>
					<Row>
						<Col sm={10} md={8}>
							{this.renderErrors()}
						</Col>
					</Row>
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
							{this.renderImageUpload()}
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
						<Button onClick={this.onSubmit} disabled={this.props.waiting} className="btn-submit submit">
							{this.props.waiting? "Loading...": "Shoutit!"}
						</Button>
					</Row>
				</form>
			</div>
		);
	},

	onSubmit() {
		this.getFlux().actions.sendShout();
		
	},

	onLocationSelectionChange(newLatLng) {
		this.getFlux().actions.changeShoutDraft("latLng", newLatLng);
	}
});