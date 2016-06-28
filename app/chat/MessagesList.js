import React, { Component, PropTypes } from 'react';
import { FormattedDate } from 'react-intl';
import { toDate } from 'unix-timestamp';

import { isSameDay } from '../utils/DateUtils';
import MessageItem from './MessageItem';
import MessageReadBy from './MessageReadBy';

import last from 'lodash/last';

import './MessagesList.scss';

export default class MessagesList extends Component {

  static propTypes = {
    messages: PropTypes.array.isRequired,
  }

  renderMessage(message, i, messages, lastReadBy) {

    const prevMessage = i > 0 ? messages[i - 1] : null;
    const nextMessage = i < messages.length - 1 ? messages[i + 1] : null;

    const isPreviousInSameDay = prevMessage && isSameDay(toDate(prevMessage.createdAt), toDate(message.createdAt));
    const hasPreviousSameSender = prevMessage && prevMessage.profile && message.profile && prevMessage.profile.id === message.profile.id;
    const isNextInSameDay = nextMessage && isSameDay(toDate(nextMessage.createdAt), toDate(message.createdAt));
    const hasNextSameSender = nextMessage && nextMessage.profile && message.profile && nextMessage.profile.id === message.profile.id;
    const isNextAfterSomeTime = nextMessage && hasNextSameSender && ((nextMessage.createdAt - message.createdAt) > 5 * 60);
    const isPreviousBeforeSomeTime = prevMessage && hasPreviousSameSender && ((message.createdAt - prevMessage.createdAt) > 5 * 60);
    const showSender = i === 0 || !nextMessage || !hasNextSameSender || !isNextInSameDay || isNextAfterSomeTime;

    const isLastOfGroup = showSender || !nextMessage || !hasNextSameSender || !isNextInSameDay || !isNextInSameDay;

    return (
      <div key={ message.id } className="MessageList-item">
        { (!prevMessage || !isPreviousInSameDay) &&
          <div className="MessagesList-day">
            <FormattedDate value={ toDate(message.createdAt) } month="long" day="numeric" year="numeric" />
          </div>
        }

        <MessageItem
          isFirstOfGroup={ isPreviousBeforeSomeTime || !prevMessage || !isPreviousInSameDay || !hasPreviousSameSender }
          isLastOfGroup={ isLastOfGroup }
          showSender={ showSender }
          message={ message } />

        { isLastOfGroup && lastReadBy && lastReadBy.id === message.id && <MessageReadBy message={ message } /> }

      </div>
    );
  }

  render() {
    const lastReadBy = last(this.props.messages.filter(message => message.readBy.length > 0));
    return (
      <div className="MessagesList">
        { this.props.messages.map((message, i, messages) => this.renderMessage(message, i, messages, lastReadBy)) }
      </div>
    );
  }
}
