import React, { PropTypes, Component } from 'react';

if (process.env.BROWSER) {
  require('./Icon.scss');
}

export default class Icon extends Component {

  static propTypes = {
    name: PropTypes.string.isRequired,
    badge: PropTypes.number,
  }

  getIconNode() {
    return this.refs.icon;
  }

  render() {
    const {
      name,
      active = false,
      disabled = false,
      on = false,
      fill = false,
      size = 'medium',
      badge,
      hover = false,
      ...props,
    } = this.props;

    let className = `Icon ${size}`;

    if (active) {
      className += ' active';
    }
    if (on) {
      className += ' on';
    }
    if (fill) {
      className += ' fill';
    }
    if (hover) {
      className += ' hover';
    }
    if (disabled) {
      className += ' disabled';
    }

    let badgeEl;
    if (typeof badge !== 'undefined') {
      // Set visibility hidden to leave the space once the badge get a value
      badgeEl = (
        <span className={ `Icon-badge ${badge === 0 ? ' isHidden' : ''}` }>
          { badge }
        </span>
      );
    }

    const style = { ...props.style };
    if (props.onClick) {
      style.cursor = 'pointer';
    }

    return (
      <span { ...props } style={ style } className={ className } >
        <span ref="icon" className={ `Icon-icon ${name}` } />
        { badgeEl }
      </span>

    );
  }
}

Icon.propTypes = {
  name: PropTypes.string.isRequired,

  active: PropTypes.bool,
  badge: PropTypes.number,
  disabled: PropTypes.bool,
  fill: PropTypes.bool,
  hover: PropTypes.bool,
  on: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium', 'huge', 'large']),

};
