import React, { PropTypes } from 'react';
// import { OverlayTrigger, Tooltip } from 'react-bootstrap';

import Icon from '../ui/Icon';

export default function MessageReadByFlag({ profiles }) {
  // const tooltip = (
  //   <Tooltip>
  //     Read by { profiles.map(profile => profile.name).join(', ') }
  //   </Tooltip>
  // );
  return (
    // <OverlayTrigger placement="top" overlay={ tooltip }>
      <Icon name="seen" active size="small" />
    // </OverlayTrigger>
  );
}

MessageReadByFlag.propTypes = {
  profiles: PropTypes.array,
};
