import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import { getTypingProfiles } from '../reducers/chat';

if (process.env.BROWSER) {
  require('./Typing.scss');
}

export function Typing({ profiles }) {

  let content = '';
  if (profiles.length > 0) {
    content = (
      <FormattedMessage
        id="chat.typing.profiles"
        defaultMessage="{count, plural,
            one {{names} is typing…}
            two {{names} are typing…}
            other {{names} are typing…}
        }"
        values={ {
          count: profiles.length,
          names: profiles.map(user => user.name).join(', '),
        } }
      />
    );
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
