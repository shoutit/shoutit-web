import React from 'react';
import {StoreWatchMixin} from 'fluxxor';
import {Link} from 'react-router';
import TagList from '../../../general/tagList.jsx';
import Separator from '../../../general/separator.jsx';
import {Image, Icon} from '../../../helper';
import {ItemProp} from '../../../helper/microdata';
import moment from 'moment';
import currency from '../../../../consts/currencies';



let types = {
	offer: "Offer",
	request: "Request"
};

export default React.createClass({
	displayName: "ShoutBody",
	mixins: [StoreWatchMixin('users')],

	getStateFromFlux() {
		let flux = this.props.flux;

		return {
			users: flux.store('users').getState().users
		}
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
			<ItemProp property="image">
				<Image className="shout-img" src={shout.thumbnail} size="medium"/>
			</ItemProp>
			: null;
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
		// limit text to 40 words
		let textReg = shout.text.match(/\S+\s/g) || [];
		let text = textReg.length > 40? textReg.slice(0,40).join('') + '...': shout.text;
		return (
			<ItemProp property="description">
				<p>{text}</p>
			</ItemProp>
		);
	},

	renderTags(shout) {
		return (
			<TagList tags={shout.tags}/>
		);
	},

	renderFootnote(shout) {
		// getting user info for country name
		let user = this.state.users[shout.user.username];
		let country = user? user.location.country: 'noflag';

		// Same photo just to have support from API
		let catIcon = 'http://i.imgur.com/e2asioJ.png';
		let countryFlag = 'http://i.imgur.com/rfZuNla.png';
		
		return (
			<div className="shout-footnote">
				<span>
					<img src={countryFlag} />
				</span>
				<span>
					<img src={catIcon} />
				</span>
				<span>
					<Icon name="chat" className="shout-chat-icon" />
				</span>
			</div>
		);
	},

	render(){
		let shout = this.props.shout;
		let URITitle = encodeURIComponent(shout.title.replace(/\s+/g, '-'));
		let separatorSize = shout.thumbnail? '90%': '94%';
		let currencySign = currency[shout.origCurrency]? currency[shout.origCurrency].sign: shout.origCurrency;

		return (
			<div className="shout-body">
				<div className="title-holder">
					<ItemProp property="name">
						<Link to={`/shout/${shout.id}/${shout.location.city}/${URITitle}`}>
							<span className="shout-title">{shout.title}</span>
						</Link>
					</ItemProp>
					<Icon name="drop_down" style={{transform: 'rotate(270deg)', margin:'2px 10px',display:'inline-block'}} />
					
					<Link to={`/tag/${encodeURIComponent(shout.category.slug)}`}>
						<span className="shout-cat">
							{shout.category.name}
						</span>
					</Link>
				</div>
				<span className="shout-price">
					{currencySign}&nbsp;{shout.price}
				</span>
				
				<div className="body-holder">
					{this.renderThumbnail(shout)}
					<div className="body-text">
						{this.renderDescription(shout)}
						{this.renderTags(shout)} 
						<Separator size={separatorSize}/>
						{this.renderFootnote(shout)}
					</div>
				</div>
			</div>
		);
	}

	/*{this.renderTitle(shout)}
				{this.renderSubtitle(shout)}
				{this.renderThumbnail(shout)}
				{this.renderDescription(shout)}
				{this.renderOffer(shout)}
				{this.renderBottom(shout)}*/
});
