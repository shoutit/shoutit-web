import React, { PropTypes } from 'react';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import ReactBootstrapTooltip from 'react-bootstrap/lib/Tooltip';
import { connect } from 'react-redux';
import { getCurrentLanguage } from '../reducers/i18n';

export function Tooltip({ children, overlay, placement = 'top', disabled = false, language }) {
  if (language === 'ar') {
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
  language: PropTypes.string.isRequired,
  placement: PropTypes.string,
  overlay: PropTypes.node,
  disabled: PropTypes.bool,
};

const mapStateToProps = state => ({
  language: getCurrentLanguage(state),
});

export default connect(mapStateToProps)(Tooltip);
