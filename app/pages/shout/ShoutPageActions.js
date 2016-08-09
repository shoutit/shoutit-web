import React, { PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

import { openConversation } from '../../actions/conversations';
import { startShoutReply } from '../../actions/shouts';

import { getLoggedUser } from '../../reducers/session';

import ShoutUpdateButton from '../../shouts/ShoutUpdateButton';
import ShoutCallButton from '../../shouts/ShoutCallButton';
import ShoutPageDeleteAction from './ShoutPageDeleteAction';

import Button from '../../forms/Button';

import RequiresLogin from '../../auth/RequiresLogin';
import { REPLY_SHOUT } from '../../auth/loginActions';

function ShoutActions({ shout, onReplyClick }) {
  let callButton;
  if (shout.isMobileSet) {
    callButton = <ShoutCallButton shout={ shout } block />;
  }

  if (shout.profile.isOwner) {
    return (
      <div className="ShoutPage-Actions">
        <div>
          { callButton }
        </div>
        <div>
          <ShoutUpdateButton block shoutId={ shout.id } />
        </div>
        <ShoutPageDeleteAction shout={ shout } />
      </div>
    );
  }
  return (
    <div className="ShoutPage-Actions">
      <div>
        <RequiresLogin event="onClick" loginAction={ REPLY_SHOUT }>
          <Button block onClick={ onReplyClick } kind="primary" icon="balloon-dots">
            <FormattedMessage id="shoutActions.reply" defaultMessage="Reply to this Shout" />
          </Button>
        </RequiresLogin>
      </div>
      <div>
        { callButton }
      </div>
    </div>
  );
}

ShoutActions.propTypes = {
  shout: PropTypes.object.isRequired,
  onReplyClick: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  loggedUser: getLoggedUser(state),
});

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { loggedUser } = stateProps;
  const { dispatch } = dispatchProps;
  const { shout } = ownProps;

  return {
    ...ownProps,
    onReplyClick: () => {
      if (shout.conversations && shout.conversations.length > 0) {
        dispatch(openConversation(shout.conversations[0]));
      } else {
        dispatch(startShoutReply(loggedUser, shout));
      }
    },
  };
};


export default connect(mapStateToProps, null, mergeProps)(ShoutActions);
