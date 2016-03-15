import React from "react";
import {Link} from "react-router";
import moment from "moment";

import currencyFormatter from "currency-formatter";

import TagButtons from "../general/TagButtons.jsx";
import Separator from "../general/separator.jsx";
import ReplyShoutForm from "../shout/ReplyShoutForm.jsx";

import {ItemProp, ItemScope} from "../helper/microdata";

import ImageGallery from "./ImageGallery.react.jsx";
import VideoPlayer from "./videoPlayer.jsx";
import { Column, Grid } from "../helper";

import { getVariation } from "../../../utils/APIUtils";

const types = {
  offer: "Offer",
  request: "Request"
};

export default React.createClass({
  displayName: "ShoutDetailBody",

  shouldComponentUpdate(nextProps) {
    return nextProps.shout.id && nextProps.shout.id !== this.props.shout.id;
  },

  renderVideos(shout) {
    if (!shout.videos.length) {
      return null;
    }

    const videoOptions = {
      url: shout.videos[0].url,
      poster: shout.videos[0].thumbnail_url
    };

    return <VideoPlayer options={videoOptions}/>;
  },

  renderImages(shout) {
    if (!shout.images.length) {
      return null;
    }

    const videos = [];
    // add video first
    if (shout.videos.length) {
      videos.push({
        original: shout.videos[0].url,
        thumbnail: shout.videos[0].thumbnail_url,
        isVideo: true
      });
    }
    // adding images
    const images = shout.images.map(function (imageSrc) {
      const img = {};
      img.original = getVariation(imageSrc, "large");
      img.thumbnail = getVariation(imageSrc, "small");
      return img;
    });

    const items = [...videos, ...images];
    const singleImage = images.length === 1;

    return <ImageGallery
      items={items}
      autoPlay={false}
      showThumbnails={!singleImage}
    />;
  },

  renderTitle(shout) {
    const { city, country, state } = this.props.currentLocation;

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

  renderOffer(shout) {
    if (shout.type !== "offer" || !shout.price || !shout.currency) {
      return;
    }

    return (
      <Column fluid={true} size="4">
        <ItemProp property="offers">
          <div className="price-offer">
            <div className="price">
              { currencyFormatter.format(shout.price/100, {code: shout.origCurrency || shout.currency})}
            </div>
          </div>
        </ItemProp>
      </Column>
    );
  },

  render() {
    const { shout, currentLocation } = this.props;

    return (
      <div>
        <ItemScope type="Product">
          <div className="si-shout-detail">
            <Grid fluid style={{ height: "45px" }}>
              { this.renderTitle(shout) }
              { this.renderOffer(shout) }
            </Grid>
            <Grid fluid>
              { this.renderImages(shout) }
            </Grid>
            { shout.images.length > 1 &&
              <Separator size="640px" style={{ marginTop: "25px" }}/>
            }
            <Grid fluid>
              <Column fluid clear size="7">
                <ItemProp property="description">
                  <p className="shout-text">{ shout.text }</p>
                </ItemProp>
              </Column>
            </Grid>
            <Grid fluid>
              <TagButtons
                tags={shout.filters}
                showWithType
                currentLocation={ currentLocation }
              />
            </Grid>
          </div>
        </ItemScope>
        <ReplyShoutForm shout={ shout } flux={ this.props.flux }/>
      </div>
    );
  }
});
