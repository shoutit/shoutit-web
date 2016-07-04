import React, { PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';

import Icon from '../widgets/Icon';

import './MessageReadBy.scss';

export default function MessageReadBy({ message }) {
  const profiles = message.readBy.map(readBy => readBy.profile);

  return (
    <div className="MessageReadBy">
      <Icon name="seen" active size="small" />
      <FormattedMessage id="chat.message.readBy"
        defaultMessage="Read by {namesAsList}"
        values={ {
          namesAsList: profiles.map(profile => profile.firstName).join(', '),
        } } />
    </div>
  );
}

MessageReadBy.propTypes = {
  message: PropTypes.shape({
    readBy: PropTypes.array.isRequired,
  }).isRequired,
};
