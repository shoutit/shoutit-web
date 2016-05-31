import React, { PropTypes } from 'react';

import Icon from '../ui/Icon';

if (process.env.BROWSER) {
  require('./MessageReadBy.scss');
}

export default function MessageReadBy({ message }) {
  const profiles = message.readBy.map(readBy => readBy.profile);

  return (
    <div className="MessageReadBy">
      <Icon name="seen" active size="small" />
      Read by { profiles.map(profile => profile.firstName).join(', ') }
    </div>
  );
}

MessageReadBy.propTypes = {
  message: PropTypes.shape({
    readBy: PropTypes.array.isRequired,
  }).isRequired,
};
