import React from 'react';
import {Button, Input, ButtonToolbar, DropdownButton, MenuItem } from 'react-bootstrap';
import TagsInput from 'react-tagsinput';
import {Icon} from '../helper';

export default React.createClass({
	displayName: "SearchTitle",

	getInitialState() {
		return {
			min: this.props.min,
			max: this.props.max
		}
	},

	renderInput() {
		return (
			<Input
				name="term"
				type="text"
				addonAfter={
				<Button className="chat-search-button" bsStyle="link">
					<Icon name="search-chat"/>
				</Button>
				}
				onChange={this.props.onTermChange}
				onKeyUp={this.onKeyUp}
				value={this.props.term}
				/>
		);
	},

	onKeyUp(ev) {
		if (ev.which === 13) {
			this.props.onSubmit();
		}
	},

	renderFilters() {
		let categories = this.props.search.categories;
		let catItems = categories.length? categories.map((item,idx) => 
			<option key={idx} value={item.slug}>{item.name}</option>): [];
		
		return (
			<div className="search-filters">
				<div>
					<select name="shouttype" value={this.props.shouttype} onInput={this.props.onTermChange}>
						<option value="all">All</option>
						<option value="offer">Offers</option>
						<option value="request">Request</option>
					</select>
					<span>
						Price range:
						<input type="number" min="0" value={this.state.min} name="min" onInput={this.handlePrice}
								onChange={this.props.onTermChange}/>
						<span>-</span>
						<input type="number" min="0" value={this.state.max} name="max" onInput={this.handlePrice}
								onChange={this.props.onTermChange}/>
					</span>
					<select name="category" value={this.props.category} onInput={this.props.onTermChange}>
						<option key="0" value='all'>All categories</option>
						{catItems}
					</select>
				</div>
				<div>
					<TagsInput ref='tags' onChange={this.onTagsChange} value={null} defaultValue={this.getInitialTags()}
							placeholder="Search with tags" addKeys={[9, 13, 32]} />
				</div>
			</div>
		);
	},

	onTagsChange() {
		setTimeout(function() {
			this.props.onTermChange({tags: this.refs.tags.getTags().join(',')});
		}.bind(this),0);
	},

	getInitialTags() {
		let tags = this.props.tags;
		if(tags === '') {
			return [];
		} else {
			return tags.split(",");
		}
	},

	handlePrice(elm) {
		let price = elm.target.value,
			name = elm.target.name;

		if(name === "min") {
			this.setState({min: price});
		} else if (name === "max") {
			this.setState({max: price});
		}
	},

	render() {
		return (
			<div className="listener-title search-shoutit">
				<p>Results</p>

				<div className="search-listener">
					<div className="chat-search">
						{this.renderInput()}
					</div>
				</div>
				{this.renderFilters()}
			</div>
		);
	}
});
