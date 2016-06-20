import React, { PropTypes } from 'react';
import { injectIntl } from 'react-intl';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import ReactBootstrapTooltip from 'react-bootstrap/lib/Tooltip';
import { connect } from 'react-redux';
import { getCurrentLocale } from '../reducers/i18n';

export function Tooltip({ children, overlay, placement = 'top', disabled = false, locale }) {
  if (locale === 'ar') {
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
  locale: PropTypes.string.isRequired,
  placement: PropTypes.string,
  overlay: PropTypes.node,
  disabled: PropTypes.bool,
};

const mapStateToProps = state => ({
  locale: getCurrentLocale(state),
});

export default connect(mapStateToProps)(Tooltip);
