import React, { PropTypes } from 'react';
import { injectIntl } from 'react-intl';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import ReactBootstrapTooltip from 'react-bootstrap/lib/Tooltip';

export function Tooltip({ children, overlay, placement = 'top', disabled = false, intl }) {
  if (intl.locale === 'ar') {
    if (placement === 'left') {
      placement = 'right';
    } else if (placement === 'right') {
      placement = 'left';
    }
  }
  return (
    <OverlayTrigger placement={ placement } trigger={ disabled ? [] : ['hover', 'focus'] } overlay={ <ReactBootstrapTooltip id="Tooltip">{ overlay }</ReactBootstrapTooltip> }>
      <span>{ children }</span>
    </OverlayTrigger>
  );
}

Tooltip.propTypes = {
  children: PropTypes.node.isRequired,
  intl: PropTypes.object.isRequired,
  placement: PropTypes.string,
  overlay: PropTypes.node,
  disabled: PropTypes.bool,
};

export default injectIntl(Tooltip);
