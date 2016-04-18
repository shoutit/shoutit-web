import React, { PropTypes } from 'react';
import ReactTooltip from 'rc-tooltip';

if (process.env.BROWSER) {
  require('./Tooltip.scss');
}

export default function Tooltip({ children, white = false, getTooltipContainer, ...props }) {
  let prefixCls;
  if (white) {
    prefixCls = 'TooltipWhite';
    props.arrowContent = <div className="TooltipWhite-arrow-inner" />;
  } else {
    prefixCls = 'Tooltip';
  }
  return (
    <ReactTooltip destroyTooltipOnHide { ...props } getTooltipContainer={ getTooltipContainer } prefixCls={ prefixCls }>
      { children }
    </ReactTooltip>
  );
}

Tooltip.propTypes = {
  ...ReactTooltip.propTypes,
  white: PropTypes.bool,
};
