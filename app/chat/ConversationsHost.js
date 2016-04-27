import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import HostedConversation from './HostedConversation';

if (process.env.BROWSER) {
  require('./ConversationsHost.scss');
}

export class ConversationsHost extends Component {

  static propTypes = {
    conversations: PropTypes.array.isRequired,
  }

  state = {
    focused: null,
  };

  render() {
    const { conversations } = this.props;
    if (conversations.length === 0) {
      return null;
    }
    return (
      <div className="ConversationsHost">
        <div className="ConversationsHost-wrapper">
          { conversations.map(id =>
            <div key={ id } className="ConversationsHost-hosted-conversation">
              <HostedConversation id={ id } onClick={ () => this.setState({ focused: id }) } />
            </div>
          ) }
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  conversations: state.chat.openedConversations,
});

export default connect(mapStateToProps)(ConversationsHost);
