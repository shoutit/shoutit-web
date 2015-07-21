import React from 'react';
import {Col} from 'react-bootstrap';
import {NavItemLink} from 'react-router-bootstrap';
import {Icon, Clear} from '../helper';

export default React.createClass({
	displayName: "SearchForm",

	render() {
		let term = this.props.term,
			linkParams = {term: encodeURIComponent(term)};

		let shoutCount = this.props.search.shouts[term] ?
			"(" + this.props.search.shouts[term].length + ")" :
				"",
			userCount = this.props.search.users[term] ?
			"(" + this.props.search.users[term].length + ")" :
				"",
			tagCount = this.props.search.tags[term] ?
			"(" + this.props.search.tags[term].length + ")" :
				"";

		return (
			<Col xs={12} md={3} className="profile-left">
				<div className="profile-img">
					<h4>Results for: </h4>
					<span>"{term}"</span>
				</div>
				<Clear/>
				<ul>
					<NavItemLink to="searchShouts" params={linkParams}>
						<Icon name="lis2"/>
						Shouts
						<span>{shoutCount}</span>
					</NavItemLink>
					<NavItemLink to="searchTags" params={linkParams}>
						<Icon name="tags-gray"/>
						Tags
						<span>{tagCount}</span>
					</NavItemLink>
					<NavItemLink to="searchUsers" params={linkParams}>
						<Icon name="user-gray"/>
						Users
						<span>{userCount}</span>
					</NavItemLink>
				</ul>
			</Col>
		);
	}
});
