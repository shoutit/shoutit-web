import React, { Component, PropTypes } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { connect } from 'react-redux';
import Conversation from './Conversation';
import ConversationName from './ConversationName';
import { closeConversation, deleteConversation } from '../actions/chat';
import { denormalize } from '../schemas';

import Navbar from 'react-bootstrap/lib/Navbar';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';
import NavDropdown from 'react-bootstrap/lib/NavDropdown';
import MenuItem from 'react-bootstrap/lib/MenuItem';

import Icon from '../ui/Icon';

if (process.env.BROWSER) {
  require('./HostedConversation.scss');
}

export class HostedConversation extends Component {

  static propTypes = {
    id: PropTypes.string.isRequired,
    onClick: PropTypes.func,
  };

  render() {
    const { onCloseClick, conversation, onClick, onLeaveClick } = this.props;
    return (
      <div className="HostedConversation" onClick={ onClick }>
        <div className="HostedConversation-header">
          <h3>
            <ConversationName conversation={ conversation } />
          </h3>

          <Navbar bsClass="Toolbar" bsStyle="small white">
            <Nav bsSize="small" bsStyle="pills">
              <NavDropdown bsSize="small" noCaret pullRight title={ <Icon name="cog" size="small" fill /> } id="basic-nav-dropdown">
                <LinkContainer onClick={ onCloseClick } to={ `/messages/${conversation.id}` }>
                  <MenuItem>See full conversation</MenuItem>
                </LinkContainer>
                <MenuItem divider />
                <MenuItem onClick={ onLeaveClick }>Leave conversation</MenuItem>
              </NavDropdown>
              <NavItem onClick={ onCloseClick }>
                <Icon name="close" size="small" fill />
              </NavItem>
            </Nav>
          </Navbar>

        </div>
        <div className="HostedConversation-conversation">
          <Conversation id={ conversation.id } layout="hosted" />
        </div>
      </div>
    );
  }
}

HostedConversation.propTypes = {
  onClick: PropTypes.func,
  onCloseClick: PropTypes.func.isRequired,
  onLeaveClick: PropTypes.func.isRequired,
  conversation: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  conversation: denormalize(state.entities.conversations[ownProps.id], state.entities, 'CONVERSATION'),
});
const mapDispatchToProps = (dispatch, ownProps) => ({
  onCloseClick: () => dispatch(closeConversation(ownProps.id)),
  onLeaveClick: () => {
    if (confirm('Leave this conversation?')) { // eslint-disable-line
      dispatch(closeConversation(ownProps.id));
      dispatch(deleteConversation(ownProps.id));
    }
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(HostedConversation);
