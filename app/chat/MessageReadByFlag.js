import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

import SVGIcon from '../ui/SVGIcon';

export default function MessageReadByFlag({ profiles }) {
  const tooltip = (
    <Tooltip>
      Read by { profiles.map(profile => profile.name).join(', ') }
    </Tooltip>
  );
  return (
    <OverlayTrigger placement="top" overlay={ tooltip }>
      <SVGIcon name="seen" active size="small" />
    </OverlayTrigger>
  );
}
