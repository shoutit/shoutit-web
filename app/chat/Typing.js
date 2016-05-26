import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { getTypingProfiles } from '../selectors';

if (process.env.BROWSER) {
  require('./Typing.scss');
}

export function Typing({ profiles }) {

  let content = '';
  if (profiles.length > 0) {
    content += profiles.map(user => user.name).join(', ');
    if (profiles.length === 1) {
      content += ' is typing...';
    } else if (profiles.length > 1) {
      content += ' are typing...';
    }
  }
  return <div className="Typing">{ content }</div>;
}

Typing.propTypes = {
  profiles: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  profiles: getTypingProfiles(state, ownProps.conversationId),
});

export default connect(mapStateToProps)(Typing);
