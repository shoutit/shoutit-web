import React, { Component, PropTypes } from 'react';
import { FormattedDate } from 'react-intl';
import { toDate } from 'unix-timestamp';

import ProfileAvatar from '../users/ProfileAvatar';
import MessageAttachment from './MessageAttachment';
import NewlineToBreak from '../widgets/NewlineToBreak';
import Tooltip from '../widgets/Tooltip';

import './MessageItem.scss';

export default class MessageItem extends Component {

  static propTypes = {
    message: PropTypes.object.isRequired,
    previousMessage: PropTypes.object,
    readByProfiles: PropTypes.array,
    showSender: PropTypes.bool,
    isFirstOfGroup: PropTypes.bool,
    isLastOfGroup: PropTypes.bool,
  }

  static defaultProps = {
    readByProfiles: [],
    showSender: true,
  }

  render() {
    const { message } = this.props;
    const { isCreating, text, createError, attachments = [] } = message;
    const isOwner = message.profile && message.profile.isOwner;
    let className = 'MessageItem';
    const shouldBeLinkified = true;

    if (this.props.isFirstOfGroup) {
      className += ' is-first';
    }
    if (this.props.isLastOfGroup) {
      className += ' is-last';
    }
    if (message.readBy.length > 0) {
      className += ' is-read';
    }
    if (isOwner) {
      className += ' is-owner';
    }
    if (!message.profile) {
      className += ' no-profile';
    }
    if (createError) {
      className += ' did-error';
    }
    if (isCreating) {
      className += ' sending';
    }
    if (attachments.length > 0) {
      className += ' has-attachments';
      if (attachments.some(attachment => attachment.type === 'media')) {
        className += ' has-media-attachments';
      }
      if (attachments.some(attachment => attachment.type === 'location')) {
        className += ' has-location-attachments';
      }
    }

    let sender;
    if (!isOwner && this.props.showSender && message.profile) {
      let tooltip = (
        <span>
          { message.profile.name }
          { ' ' }
          (<FormattedDate
            value={ toDate(message.createdAt) }
            formatMatcher="basic"
            hour="numeric"
            minute="numeric"
            day="numeric"
            month="numeric"
            weekday="short" />
          )
        </span>

      );
      sender = (
        <div className="MessageItem-sender-wrapper">
          <Tooltip placement="left" overlay={ tooltip }>
            <span>
              <ProfileAvatar profile={ message.profile } linkToProfilePage />
            </span>
          </Tooltip>
        </div>
      );
    }

    return (
      <div className={ className }>
        { !isOwner && message.profile &&
          <div className="MessageItem-sender">
            { sender }
          </div>
        }

        <div className="MessageItem-message">
          { attachments.length > 0 &&
            <span className="MessageItem-attachments">
              { attachments.map((attachment, i) =>
                <MessageAttachment key={ i } attachment={ attachment } />
              ) }
            </span>
          }
          { text &&
            <div className="MessageItem-text" dir="auto">
              <NewlineToBreak shouldBeLinkified={ shouldBeLinkified }>
                { text }
              </NewlineToBreak>
            </div>
          }
        </div>

        { false && isOwner &&
          <div className="MessageItem-sender">
            { sender }
          </div>
        }
{/*
        { !isCreating && createError &&
          <div className="MessageItem-retry" title={ createError.message }>
            ⚠️ This message could not be sent
          </div>
        }*/}
      </div>
    );

  }

}
