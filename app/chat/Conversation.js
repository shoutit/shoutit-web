import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { FormattedMessage } from 'react-intl';

import ConversationReplyForm from '../chat/ConversationReplyForm';
import ConversationMessages from '../chat/ConversationMessages';
import ConversationStart from '../chat/ConversationStart';
import ConversationHead from '../chat/ConversationHead';

import { loadConversation, setActiveConversation, unsetActiveConversation, markConversationAsRead } from '../actions/conversations';

import { getConversation } from '../reducers/entities/conversations';

import Progress from '../ui/Progress';

if (process.env.BROWSER) {
  require('./Conversation.scss');
}

export class Conversation extends Component {

  static propTypes = {

    id: PropTypes.string.isRequired,

    loadConversation: PropTypes.func.isRequired,
    unsetActive: PropTypes.func.isRequired,
    setActive: PropTypes.func.isRequired,
    markAsRead: PropTypes.func.isRequired,

    conversation: PropTypes.object,
    draft: PropTypes.string,

    layout: PropTypes.oneOf(['hosted', 'full']),
  };

  static defaultProps = {
    layout: 'full',
  }

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isFetching: false,
    };
  }

  state = {
    showDelete: false,
    showAttachShout: false,
    typingProfiles: [],
  };

  componentDidMount() {
    this.loadData();
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.draft === this.props.draft;
  }

  componentWillUpdate(nextProps) {
    if (nextProps.id !== this.props.id) {
      this.props.unsetActive();
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.id !== this.props.id) {
      this.loadData();
    }
  }

  componentWillUnmount() {
    this.props.unsetActive();
  }

  loadData() {
    if (this.props.conversation && this.props.conversation.isNew) {
      return;
    }
    this.setState({ isFetching: true, error: null });
    this.props.loadConversation()
    .then(() => {
      this.setState({ isFetching: false });
      this.props.setActive();
      this.props.markAsRead();
    })
    .catch(error => {
      this.setState({ isFetching: false, error });
    });

    if (this.form) {
      this.form.focus();
    }
  }

  form = null;

  render() {
    const { layout, conversation } = this.props;
    return (
      <div className={ `Conversation layout-${layout}` }>

        { conversation && (layout === 'full' || conversation.about) &&
          <div className="Conversation-head">
            <ConversationHead showTitle={ layout === 'full' } conversation={ conversation } />
          </div>
        }

        <div className="Conversation-body">

          { !conversation && this.state.error &&
            <div className="Conversation-error">
              <FormattedMessage id="chat.conversation.loadError" defaultMessage="Error while loading this conversation." />
            </div>
          }

          { !conversation && this.state.isFetching && <Progress animate /> }
          { conversation && conversation.isCreating && <Progress animate /> }

          { conversation && conversation.isNew && !conversation.isCreating &&
            <ConversationStart conversation={ conversation } />
          }
          { conversation && !conversation.isNew &&
            <ConversationMessages conversation={ conversation } />
          }
        </div>

        { conversation &&
          <div className="Conversation-footer">
            <ConversationReplyForm
              inputRef={ form => { this.form = form; } }
              ref="replyForm"
              conversation={ conversation }
              autoFocus
            />
          </div>
        }
      </div>
    );
  }

}

const mapStateToProps = (state, ownProps) => ({
  conversation: getConversation(state, ownProps.id),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  loadConversation: () => dispatch(loadConversation({ id: ownProps.id })),
  setActive: () => dispatch(setActiveConversation({ id: ownProps.id })),
  unsetActive: () => dispatch(unsetActiveConversation({ id: ownProps.id })),
  markAsRead: () => dispatch(markConversationAsRead({ id: ownProps.id })),
});

export default connect(mapStateToProps, mapDispatchToProps)(Conversation);
