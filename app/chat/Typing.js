import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, FormattedPlural } from 'react-intl';

import { getTypingProfiles } from '../selectors';

if (process.env.BROWSER) {
  require('./Typing.scss');
}

export function Typing({ profiles }) {

  let content = '';
  if (profiles.length > 0) {
    content = (
      <FormattedPlural
        value={ profiles.length }
        one={
          <FormattedMessage
            id="chat.typing.profiles.one"
            defaultMessage="{name} is typing…"
            values={ {
              name: profiles.map(user => user.name).join(', '),
            } }
          />
        }
        other={
          <FormattedMessage
            id="chat.typing.profiles.many"
            defaultMessage="{namesAsList} are typing…"
            values={ {
              namesAsList: profiles.map(user => user.name).join(', '),
              profilesCount: profiles.length,
            } }
          />
        }
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
