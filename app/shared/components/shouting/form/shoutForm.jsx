import React from 'react';
import Router from 'react-router';
import {FluxMixin} from 'fluxxor';
import {Row, Col, Button, Input, DropdownButton, MenuItem, Tooltip} from 'react-bootstrap';
import Overlay from 'react-overlays/lib/Overlay';
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
			files: [],
			touched: {}
		};
	},

	componentDidMount() {
		this.getFlux().actions.changeShoutDraft("latLng", this.props.current.location);
	},

	renderTitleInput() {
		return (
			<Input type="text"
				   placeholder="What are you shouting about?"
				   value={this.props.draft.title}
				   ref="title"
				   onChange={this.onTextChange("title")}
				/>
		);
	},

	onTextChange(key) {
		return function (event) {
			this.getFlux().actions.changeShoutDraft(key, event.target.value);
			this.onTouch(key);
		}.bind(this);
	},

	renderPriceInput() {
		return (
			<Input type="number"
				   className="price"
				   ref="price"
				   placeholder="Price"
				   min="0"
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
				</MenuItem>

				)
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
		};
		var eventHandlers = {
			init: null,
			addedfile: null,
			removedfile: this.onImageRemoved,
			uploadprogress: null,
			sending: null,
			success: this.onImageUploaded,
			complete: null,
			maxfilesexceeded: null
		};
		let djsConfig = {
			paramName: "shout_image",
			maxFilesize: 5, // 5 MB
			addRemoveLinks: true,
			maxFiles: 7,
			dictCancelUpload:''
		};
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
		this.onTouch('images');
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
		this.onTouch('currency');
		let code = key.split(":")[1];
		this.getFlux().actions.changeShoutDraft("currency", this.props.currencies[code]);
	},

	onCategorySelect(key) {
		this.onTouch('category');
		let index = key.split(":")[1];
		this.getFlux().actions.changeShoutDraft("category", this.props.categories[index]);
	},

	renderDescTextArea() {
		return (
			<Input type='textarea'
				   rows="3"
				   ref="text"
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

	getErrorTooltip(errorField) {
		let status = this.props.status;
		return <Tooltip>{status[errorField]}</Tooltip>;
	},

	getErrorProps(errorField) {
		if(this.props.status[errorField]) {
			return {
				show:!this.state.touched[errorField],
				container: this,
				target: () => React.findDOMNode(this.refs[errorField]),
				placement: 'bottom'
			}
		}
	},

	onTouch(elm) {
		// flag element as touched
		let touched = this.state.touched;
		touched[elm] = true;
		this.setState({touched:touched});
	},

	clearTouches() {
		this.setState({touched:{}});
	},

	renderAlerts() {
		return (
			<section>
				<Overlay {...this.getErrorProps('title')} >
					{this.getErrorTooltip('title')}
				</Overlay>
				<Overlay {...this.getErrorProps('text')} >
					{this.getErrorTooltip('text')}
				</Overlay>
				<Overlay {...this.getErrorProps('currency')} >
					{this.getErrorTooltip('currency')}
				</Overlay>
				<Overlay {...this.getErrorProps('price')} >
					{this.getErrorTooltip('price')}
				</Overlay>
				<Overlay {...this.getErrorProps('category')} >
					{this.getErrorTooltip('category')}
				</Overlay>
				<Overlay {...this.getErrorProps('images')} >
					{this.getErrorTooltip('images')}
				</Overlay>
				<Overlay {...this.getErrorProps('location')} >
					{this.getErrorTooltip('location')}
				</Overlay>
			</section>
		);
	},

	render() {
		return (
			<div className="modal-form">
				<form>
					{this.renderAlerts()}
					<Row>
						<Col sm={7} md={7}>
							{this.renderTitleInput()}
						</Col>
						<Col sm={5} md={5}>
							{this.renderPriceInput()}
						</Col>
					</Row>

					<Row>
						<Col sm={12} md={12}>
							{this.renderDescTextArea()}
						</Col>
					</Row>
					<Row>
						<Col sm={2} md={2}>
							{this.renderTypeSelect()}
						</Col>
						<Col sm={4} md={4} ref="category">
							{this.renderCategoryDropdown()}
						</Col>
						<Col sm={12} md={6}>
							{this.renderTagInput()}
						</Col>
					</Row>
					<Row>
						<Col sm={12} md={12} ref="images">
							{this.renderImageUpload()}
						</Col>
					</Row>
					<Row>
						<Col sm={12} md={12} >
							Click on the Map to select a location.
						</Col>
					</Row>
					<Row>
						<LocationSelection
							onChange={this.onLocationSelectionChange}
							flux={this.props.flux}
							ref="location"
							selected={this.props.draft.latLng || this.props.current.location}
							startLocation={this.props.current.location}
							/>
					</Row>
					<Row className="row-submit">
						<Button onClick={this.onSubmit} disabled={this.props.waiting} className="btn-submit submit">
							{this.props.waiting? "Loading...": "Create Shout"}
						</Button>
					</Row>
					
				</form>
			</div>
		);
	},

	onSubmit() {
		this.getFlux().actions.sendShout();
		this.clearTouches();
	},

	onLocationSelectionChange(newLatLng) {
		this.getFlux().actions.changeShoutDraft("latLng", newLatLng);
		this.onTouch('location');
	}
});