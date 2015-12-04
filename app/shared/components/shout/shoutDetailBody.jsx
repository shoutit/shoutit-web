import React from 'react';
import {Link} from 'react-router';
import moment from 'moment';

//import Rating from './rating.jsx';
import ShoutDetailActions from './shoutDetailActions.jsx';
import TagList from '../general/tagList.jsx';
import Separator from '../general/separator.jsx';

import {Image} from '../helper';
import {ItemProp, ItemScope} from '../helper/microdata';

import ImageGallery from './ImageGallery.react.jsx';
import VideoPlayer from './videoPlayer.jsx';
import {Column, Grid, ReactVisible} from '../helper';
import currency from '../../consts/currencies';


let types = {
    offer: "Offer",
    request: "Request"
};

export default React.createClass({
    displayName: "ShoutDetailBody",

    renderSubtitle(shout) {
        let link = shout.user.is_activated ?
            <Link to={`/user/${encodeURIComponent(shout.user.username)}`}>
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
            let videos = [];
            // add video first
            if(shout.videos.length) {
                videos.push({
                        original: shout.videos[0].url, 
                        thumbnail: shout.videos[0].thumbnail_url,
                        isVideo: true
                    });
            }
            // adding images
            let images = shout.images.map(function (imageSrc) {
                let img = {};
                img.original = imageSrc.replace(/\..{3}$/i, '_large.' + imageSrc.split('.').pop());
                img.thumbnail = imageSrc.replace(/\..{3}$/i, '_small.' + imageSrc.split('.').pop());
                return img;
            });

            let items = [...videos, ...images];
            let singleImage = images.length == 1;

            return <ImageGallery
                items={items}
                autoPlay={false}
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
            <Column fluid={true} clear={true} size="7">
                <ItemProp property="description">
                    <p className="shout-text">{shout.text}</p>
                </ItemProp>
            </Column>
        );
    },

    renderTitle(shout) {
        let city = encodeURIComponent(this.props.current.city),
            country = encodeURIComponent(this.props.current.country),
            state = encodeURIComponent(this.props.current.state);

        return (
            <Column fluid={true} clear={true} size="11">
                <ItemProp property="name">
                    <Link className="shout-title" to={`/shout/${shout.id}`}>{shout.title}</Link>
                </ItemProp>
                <Link to={`/${shout.type}s/${country}/${state}/${city}`}>
                    <span className="shout-type">{types[shout.type]}</span>
                </Link>
            </Column>
        );
    },

    renderRating(shout) {
        //return shout.rating ?
          //  <Rating rating={shout.rating}/> : null;
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
            let currencySign = 
                    currency[shout.origCurrency]? currency[shout.origCurrency].sign: 
                    shout.origCurrency? shout.origCurrency: shout.currency;

            return (
                <Column fluid={true} size="4">
                    <ItemProp property="offers">
                        <div className="price-offer">
                            <div className="price">
                                <ItemProp property="price">
                                    <span>{shout.price}</span>
                                </ItemProp>
                                <ItemProp property="priceCurrency" content={shout.origCurrency}>
                                    <span>{currencySign}</span>
                                </ItemProp>
                            </div>
                        </div>
                    </ItemProp>
                </Column>
            );
        }
    },

    shouldComponentUpdate(nextProps,nextState) {
        if (nextProps.shout.id !== this.props.shout.id && nextProps.shout.id) {
            return true;
        } else {
            return false;
        }
    },

    render() {
        let shout = this.props.shout;

        return (
            <ItemScope type="Product">
                <div className="si-shout-detail">  
                    <Grid fluid={true} style={{height: '45px'}}>
                        {this.renderTitle(shout)}
                        {this.renderOffer(shout)}
                    </Grid>
                    <Grid fluid={true}>
                        {this.renderImages(shout)}
                    </Grid>
                    <ReactVisible condition={shout.images.length > 1}>
                        <Separator size="640px" style={{marginTop: '25px'}}/>
                    </ReactVisible>
                    <Grid fluid={true}>
                        {this.renderText(shout)}
                    </Grid>
                </div>
            </ItemScope>
        );
    }
});
