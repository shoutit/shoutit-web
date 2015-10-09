import React from 'react';
import {Button, Input, ButtonToolbar, DropdownButton, MenuItem, Col } from 'react-bootstrap';
import TagsInput from 'react-tagsinput';
import {Icon} from '../helper';
import Sticky from 'react-sticky';
import isMobile from 'ismobilejs';

let mobile = isMobile.any;

export default React.createClass({
	displayName: "SearchFilters",

	getInitialState() {
		return {
			min: this.props.min,
			max: this.props.max,
			tags: this.props.tags
		}
	},

	onKeyUp(ev) {
		if (ev.which === 13) {
			this.onSubmit();
		}
	},

	renderFilters() {
		let categories = this.props.search.categories;
		let catItems = categories.length? categories.map((item,idx) => 
			<option key={idx} value={item.slug}>{item.name}</option>): [];
		
		return (
			<div className="search-filters">
				<div>
					<select name="shouttype" ref="shouttype" defaultValue={this.props.shouttype}>
						<option value="all">All</option>
						<option value="offer">Offers</option>
						<option value="request">Request</option>
					</select>
					<span>
						Price range:
						<input type="number" placeholder="0" min="0" value={this.state.min}
								name="min" ref="min" onInput={this.handlePrice}/>
						<span>-</span>
						<input type="number" placeholder="100" min="0" value={this.state.max}
								name="max" ref="max" onInput={this.handlePrice}/>
					</span>
					<select name="category" ref="category" defaultValue={this.props.category} >
						<option key="0" value='all'>All categories</option>
						{catItems}
					</select>
				</div>
				<div>
					<TagsInput 
							ref='tags'
							onChange={this.onTagsChange}
							defaultValue={this.getInitialTags()}
							placeholder="Search with tags"
							addKeys={[9, 13, 32]} 
							/>
					<input name="term" ref="term" placeholder="Keyword" type="text"
							onKeyUp={this.onKeyUp} defaultValue={this.props.term}/>
				</div>
				<Button bsStyle="primary" onClick={this.onSubmit} block>Search</Button>
			</div>
		);
	},

	onTagsChange() {
		// moving to the end of the function queue for a small bug
		setTimeout(() => {
			this.setState({tags: this.refs.tags.getTags().join(',')});
		},0);
	},

	getInitialTags() {
		let tags = this.props.tags;
		if(tags === '') {
			return [];
		} else {
			return tags.split(",");
		}
	},

	// In case needed to manipulated data entry instantly
	handlePrice(elm) {
		let price = elm.target.value,
			name = elm.target.name;

		if(name === "min") {
			this.setState({min: price});
		} else if (name === "max") {
			this.setState({max: price});
		}
	},

	onSubmit() {
		let min = this.state.min,
			max = this.state.max,
			tags = this.state.tags,
			category = React.findDOMNode(this.refs.category).value,
			shouttype = React.findDOMNode(this.refs.shouttype).value,
			term = React.findDOMNode(this.refs.term).value;

		// send back to owner module for processing
		this.props.onSubmit({term,shouttype,category,tags,min,max});
	},

	render() {
		let content = mobile?
			<Col xs={12} md={3} style={{margin:'20px 0'}} className="search-left-container">
					<div className="search-filters">
						<p>What kind of information you need?</p>
						{this.renderFilters()}
					</div>
			</Col>
			:
			<Col xs={12} md={3} className="search-left-container">
				<Sticky topOffset={120}>
					<div className="search-filters">
						<p>What kind of information you need?</p>
						{this.renderFilters()}
					</div>
				</Sticky>
			</Col>
			;

		return content;
	}
});
