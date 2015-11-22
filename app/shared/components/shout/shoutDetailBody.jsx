import React from 'react';
import {Link} from 'react-router';
import moment from 'moment';
import {Col} from 'react-bootstrap';

import Rating from './rating.jsx';
import ShoutDetailActions from './shoutDetailActions.jsx';
import TagList from '../general/tagList.jsx';
import Video from './video.jsx';

import {Image} from '../helper';
import {ItemProp, ItemScope} from '../helper/microdata';

import ImageGallery from 'react-image-gallery';
import VideoPlayer from './videoPlayer.jsx';

let types = {
    offer: "Offer",
    request: "Request"
};

export default React.createClass({
    displayName: "ShoutDetailBody",

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
            </h5>
        );
    },

    renderVideos(shout) {
        if(shout.videos.length) {
            let videoOptions = {
                url: shout.videos[0].url,
                poster: shout.videos[0].thumbnail_url
            };
            return <VideoPlayer options={videoOptions} />
        } else {
            return [];
        }
    },

    renderImages(shout) {
        if (shout.images.length) {
            let images = shout.images.map(function (imageSrc) {
                let img = {};
                img.original = imageSrc.replace(/\..{3}$/i, '_large.' + imageSrc.split('.').pop());
                img.thumbnail = imageSrc.replace(/\..{3}$/i, '_small.' + imageSrc.split('.').pop());
                return img;
            });
            let singleImage = images.length == 1;
            return <ImageGallery
                items={images}
                autoPlay={false}
                showBullets={!singleImage}
                showThumbnails={!singleImage}
                onSlide={this.handleSlide}/>
        } else {
            return [];
        }
    },

    handleSlide(index) {
    },

    renderText(shout) {
        return (
            <ItemProp property="description">
                <p className="detail">{shout.text}</p>
            </ItemProp>
        );
    },

    renderTitle(shout) {
        return (
            <ItemProp property="name">
                <h4>{shout.title}</h4>
            </ItemProp>
        );
    },

    renderRating(shout) {
        return shout.rating ?
            <Rating rating={shout.rating}/> : null;
    },

    renderActions() {
        //return (<ShoutDetailActions/>);
    },

    renderTags(shout) {
        return shout.tags ?
            <TagList tags={shout.tags}/> : null;
    },

    renderBottom(shout) {
        return (
            <div className="btn-bottom single-shout">
                {this.renderActions()}
                {this.renderTags(shout)}
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

    render() {
        let shout = this.props.shout;

        return (
            <ItemScope type="Product">
                <Col {...this.props} xs={12} md={12} className="section-right">
                    {this.renderTitle(shout)}
                    {this.renderSubtitle(shout)}
                    {this.renderText(shout)}
                    {this.renderImages(shout)}
                    {this.renderVideos(shout)}
                    {this.renderOffer(shout)}
                    {this.renderRating(shout)}
                    {this.renderBottom(shout)}
                </Col>
            </ItemScope>
        );
    }
});
