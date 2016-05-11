import React, { PropTypes } from 'react';
import Tooltip from '../ui/Tooltip';

import Icon from '../ui/Icon';

export default function MessageReadByFlag({ profiles }) {
  return (
    <Tooltip overlay={ `Read by ${profiles.map(profile => profile.name).join(',')}` }>
      <Icon name="seen" active size="small" />
    </Tooltip>
  );
}

MessageReadByFlag.propTypes = {
  profiles: PropTypes.array,
};
