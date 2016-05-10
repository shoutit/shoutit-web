import React, { Component, PropTypes } from 'react';
import { ShareButtons, ShareCounts, generateShareIcon } from 'react-share';
import { getVariation } from '../utils/APIUtils';

import Tooltip from '../ui/Tooltip';
import { siteUrl } from '../config';

const { FacebookShareButton, GooglePlusShareButton, TwitterShareButton, PinterestShareButton } = ShareButtons;
const { FacebookShareCount, GooglePlusShareCount, PinterestShareCount } = ShareCounts;

const FacebookIcon = generateShareIcon('facebook');
const TwitterIcon = generateShareIcon('twitter');
const GooglePlusIcon = generateShareIcon('google');
const PinterestIcon = generateShareIcon('pinterest');

if (process.env.BROWSER) {
  require('./Share.scss');
}

export default class Share extends Component {

  static propTypes = {
    shareUrl: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    image: PropTypes.string,
    iconSize: PropTypes.number,
  }

  static defaultProps = {
    shareUrl: '',
    iconSize: 32,
  }

  render() {
    const { shareUrl, title, image, iconSize } = this.props;
    const url = `${siteUrl}${shareUrl}`;
    return (
      <div className="Share">
        <div className="Share-network">

          <Tooltip overlay="Share on Facebook">
            <FacebookShareButton
              url={ url }
              title={ title || 'Shoutit' }
              className="Share-network-button">
              <FacebookIcon size={ iconSize } round />
            </FacebookShareButton>
          </Tooltip>

          <FacebookShareCount url={ url } className="Share-network-count">
            { count => count }
          </FacebookShareCount>
        </div>

        <div className="Share-network">

          <Tooltip overlay="Share on Twitter">
            <TwitterShareButton
              url={ url }
              title={ title || 'Shoutit' }
              className="Share-network-button">
              <TwitterIcon size={ iconSize } round />
            </TwitterShareButton>
          </Tooltip>
          <div className="Share-network-count" />
        </div>

        <div className="Share-network">
          <Tooltip overlay="Share on Google+">
            <GooglePlusShareButton
              url={ url }
              className="Share-network-button">
              <GooglePlusIcon size={ iconSize } round />
            </GooglePlusShareButton>
          </Tooltip>
          <GooglePlusShareCount url={ url } className="Share-network-count">
            { count => count }
          </GooglePlusShareCount>
        </div>

        { image &&
          <div className="Share-network">
            <Tooltip overlay="Share on Pininterest">
              <PinterestShareButton
                url={ url }
                media={ getVariation(image, 'large') }
                className="Share-network-button">
                <PinterestIcon size={ iconSize } round />
              </PinterestShareButton>
            </Tooltip>
            <PinterestShareCount url={ url } className="Share-network-count" />
          </div>
        }
      </div>
    );
  }
}
