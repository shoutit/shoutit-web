import React from 'react';
import {Link} from 'react-router';
import {Col} from 'react-bootstrap';
import TagList from './tags.jsx';
import Actions from './actions.jsx';
import {Mui, Image} from '../../../helper';
import moment from'moment';

import {ItemProp} from '../../../helper/microdata';

let types = {
	offer: "Offer",
	request: "Request"
};

export default React.createClass({
	displayName: "ShoutBody",

	getDefaultProps(){
		return {
			logoRight: false
		};
	},

	renderBottom(shout) {
		return this.props.listType === "small" ?
			(
				<div className="ctn-offerpro-bottom">
					<ul>
						<li className="postby">
							{"Posted by : " + shout.user.name + ", " +
							moment.unix(shout.date_published).format('L')}
						</li>
					</ul>
				</div>
			) :
			(
				<div className="btn-bottom">
					<Actions/>
					<TagList tags={shout.tags}/>
				</div>
			);
	},

	renderOffer(shout) {
		if (shout.type === "offer" && shout.price && shout.currency) {
			return (
				<ItemProp property="offers">
					<div className="price-offer">
						<div className="price">
							<ItemProp property="price">
								<span>{shout.price}</span>
							</ItemProp>
							&nbsp;
							<ItemProp property="priceCurrency" content={shout.origCurrency}>
								<span>{shout.currency}</span>
							</ItemProp>
						</div>
					</div>
				</ItemProp>
			);
		}
	},

	renderSubtitle(shout) {
		let link = shout.user.is_activated ?
			<Link to="user" params={{username: encodeURIComponent(shout.user.username)}}>
				{shout.user.name}
			</Link> : shout.user.name;

		return (
			<h5>{types[shout.type]} by&nbsp;
				<span className="poster">
					{link}
				</span>
				&nbsp;-&nbsp;
				{moment.unix(shout.date_published).fromNow()}
				&nbsp;-&nbsp;in&nbsp;
				<Link to="tag" params={{tagName: encodeURIComponent(shout.category.main_tag.name)}}>
					{shout.category.name}
				</Link>
				&nbsp;-&nbsp;near&nbsp;
				{shout.location.city}
			</h5>
		);
	},

	renderThumbnail(shout) {
		return shout.thumbnail ?
			<div className="section-right-img">
				<ItemProp property="image">
					<Image src={shout.thumbnail}/>
				</ItemProp>
			</div> : null;
	},

	renderTitle(shout) {
		return (
			<h4>
				<ItemProp property="url">
					<Link to="shout"
						  params={{shoutId: shout.id, location: shout.location.city, title: encodeURIComponent(shout.title.replace(/\s+/g, '-'))}}>
						<ItemProp property="name">
							<span>{shout.title}</span>
						</ItemProp>
					</Link>
				</ItemProp>
			</h4>
		);
	},

	renderDescription(shout) {
		return (
			<ItemProp property="description">
				<p>{shout.text.replace(/(?:\r\n|\r|\n)/g, '<br />')}</p>
			</ItemProp>
		);
	},

	render(){
		let shout = this.props.shout;

		return (
			<Col xs={12} md={10} mdPull={this.props.logoRight ? 2 : 0} className="section-right">
				<Mui right={this.props.logoRight}/>
				{this.renderTitle(shout)}
				{this.renderSubtitle(shout)}
				{this.renderThumbnail(shout)}
				{this.renderDescription(shout)}
				{this.renderOffer(shout)}
				{this.renderBottom(shout)}
			</Col>
		);
	}
});
