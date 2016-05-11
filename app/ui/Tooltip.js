import React, { PropTypes } from 'react';

import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import ReactBootstrapTooltip from 'react-bootstrap/lib/Tooltip';

export default function Tooltip({ children, overlay, placement = 'top', disabled = false }) {
  return (
    <OverlayTrigger placement={ placement } trigger={ disabled ? [] : ['hover', 'focus'] } overlay={ <ReactBootstrapTooltip id="Tooltip">{ overlay }</ReactBootstrapTooltip> }>
      <span>{ children }</span>
    </OverlayTrigger>
  );
}

Tooltip.propTypes = {
  children: PropTypes.node.isRequired,
  placement: PropTypes.string,
  overlay: PropTypes.node,
  disabled: PropTypes.bool,
};
