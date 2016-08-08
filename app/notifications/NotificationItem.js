import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { backgroundImageStyle } from '../utils/DOMUtils';
import FormattedCreatedAt from '../utils/FormattedCreatedAt';

import './NotificationItem.scss';

function getSegmentsFromRange(text, ranges) {
  let segments;
  if (ranges.length > 0) {
    const initialSegment = {
      text: text.slice(0, ranges[0].offset),
      highlight: false,
    };
    segments = ranges.reduce((segments, range, i) => {
      if (i > 0) {
        segments.push({
          highlight: false,
          text: text.slice(segments.map(s => s.text).join().length, range.offset - 1),
        });
      }
      segments.push({
        highlight: true,
        text: text.slice(range.offset, range.offset + range.length),
      });
      if (i === ranges.length - 1) {
        segments.push({
          highlight: false,
          text: text.slice(segments.map(s => s.text).join().length),
        });
      }
      return segments;
    }, [initialSegment]).filter(segment => !!segment.text);
  } else {
    segments = [text];
  }
  return segments;
}

export default class NotificationItem extends Component {

  static propTypes = {
    notification: PropTypes.object.isRequired,
    onClick: PropTypes.func,
  };

  render() {
    const {
      notification,
      onClick,
    } = this.props;

    let className = 'NotificationItem';
    if (!notification.isRead) {
      className = `${className} is-unread`;
    }
    const { text, ranges } = notification.display;
    return (
      <li className={ className }>
        <Link onClick={ onClick } to={ notification.webUrl }>
          <div
            className="NotificationItem-image"
            style={ backgroundImageStyle({ url: notification.display.image }) }
          />
          <div className="NotificationItem-content">
            <div className="NotificationItem-text">
              { getSegmentsFromRange(text, ranges).map((segment, i) => {
                if (segment.highlight) {
                  return <strong key={ i } className="highlight">{ segment.text }</strong>;
                }
                return <span key={ i }>{ ' ' } { segment.text }{ ' ' }</span>;
              }) }
            </div>
            <div className="NotificationItem-date">
              <FormattedCreatedAt value={ notification.createdAt } />
            </div>
          </div>
        </Link>
      </li>
    );
  }
}
