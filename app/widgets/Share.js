import React, { Component, PropTypes } from 'react';
import { ShareButtons, ShareCounts, generateShareIcon } from 'react-share';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';
import { getVariation } from '../utils/APIUtils';

import Tooltip from '../widgets/Tooltip';
import { siteUrl } from '../config';

const { FacebookShareButton, GooglePlusShareButton, TwitterShareButton, PinterestShareButton } = ShareButtons;
const { FacebookShareCount, GooglePlusShareCount, PinterestShareCount } = ShareCounts;

const FacebookIcon = generateShareIcon('facebook');
const TwitterIcon = generateShareIcon('twitter');
const GooglePlusIcon = generateShareIcon('google');
const PinterestIcon = generateShareIcon('pinterest');

const DEFAULT_TITLE = 'Shoutit - Buy and sell while chatting';

import './Share.scss';

const MESSAGES = defineMessages({
  defaultTitle: {
    id: 'share.defaultTitle',
    defaultMessage: 'Shoutit - Buy and sell while chatting',
  },
});
export class Share extends Component {

  static propTypes = {
    shareUrl: PropTypes.string.isRequired,
    intl: PropTypes.object.isRequired,
    title: PropTypes.string,
    image: PropTypes.string,
    iconSize: PropTypes.number,
  }

  static defaultProps = {
    shareUrl: '',
    iconSize: 32,
    title: DEFAULT_TITLE,
  }

  render() {
    const { shareUrl, title, image, iconSize } = this.props;
    const { formatMessage } = this.props.intl;
    const url = `${siteUrl}${shareUrl}`;
    return (
      <div className="Share">
        <div className="Share-network">

          <Tooltip overlay={ <FormattedMessage id="share.facebook.tooltip" defaultMessage="Share on Facebook" /> }>
            <FacebookShareButton
              url={ url }
              title={ title || formatMessage(MESSAGES.defaultTitle) }
              className="Share-network-button">
              <FacebookIcon size={ iconSize } round />
            </FacebookShareButton>
          </Tooltip>

          <FacebookShareCount url={ url } className="Share-network-count">
            { count => count }
          </FacebookShareCount>
        </div>

        <div className="Share-network">
          <Tooltip overlay={ <FormattedMessage id="share.twitter.tooltip" defaultMessage="Share on Twitter" /> }>
            <TwitterShareButton
              url={ url }
              title={ title || DEFAULT_TITLE }
              className="Share-network-button">
              <TwitterIcon size={ iconSize } round />
            </TwitterShareButton>
          </Tooltip>
          <div className="Share-network-count" />
        </div>

        <div className="Share-network">
          <Tooltip overlay={ <FormattedMessage id="share.google.tooltip" defaultMessage="Share on Google+" /> }>
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
            <Tooltip overlay={ <FormattedMessage id="share.pininterest.tooltip" defaultMessage="Share on Pininterest+" /> }>
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

export default injectIntl(Share);
