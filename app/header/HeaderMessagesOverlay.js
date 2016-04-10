import React, { Component } from 'react';
import { Link } from 'react-router';

import ConversationsList from '../chat/ConversationsList.js';

if (process.env.BROWSER) {
  require('../styles/components/ListOverlay.scss');
}
export default class HeaderMessagesOverlay extends Component {
  render() {
    return (
      <div className="ListOverlay">
        <div className="ListOverlay-header">
          <span className="ListOverlay-title">
            Messages
          </span>
        </div>
        <div className="ListOverlay-body">
          <ConversationsList />
        </div>
        <div className="ListOverlay-footer">
          <Link to="/messages">
            See All
          </Link>
        </div>
      </div>
    );
  }
}
