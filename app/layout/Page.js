/* eslint-env browser */
/* eslint-disable react/no-multi-comp */

import React, { PropTypes, Component } from 'react';
import Sticky from '@economist/component-stickyfill';

import MiniFooter from '../layout/MiniFooter';
import './Page.scss';

class PageColumn extends Component {
  static propTypes = {
    sticky: PropTypes.bool,
    classModifier: PropTypes.string,
    children: PropTypes.node,
    wide: PropTypes.bool,
  }
  static defaultProps = {
    sticky: false,
  }
  state = {
    sticky: false,
  }
  constructor(props) {
    super(props);
    this.setSticky = this.setSticky.bind(this);
  }
  componentDidMount() {
    if (this.props.sticky) {
      this.setSticky();
      window.addEventListener('resize', this.setSticky);
    }
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.setSticky);
  }

  setSticky() {
    this.setState({
      sticky: true,
      width: this.refs.node.offsetWidth,
    });
  }
  render() {
    let className = 'PageColumn';
    let style;
    if (this.props.classModifier) {
      className += ` ${this.props.classModifier}`;
    }
    if (this.state.sticky) {
      className += ' sticky';
      style = {
        width: this.state.width,
      };
    }
    if (this.props.wide) {
      className += ' wide';
    }
    const content = (
      <div className={ className } ref="node" style={ style }>
        { this.props.children }
      </div>
    );
    if (this.state.sticky) {
      return <Sticky>{ content }</Sticky>;
    }
    return content;
  }
}

export class Body extends Component {
  static propTypes = {
    children: PropTypes.node,
  }
  render() {
    const className = 'PageBody';
    return (
      <div className={ className }>
        { this.props.children }
      </div>
    );
  }
}

export function StartColumn(props) {
  return (
    <PageColumn { ...props } classModifier="start" />
  );
}
export function EndColumn({ children, footer = false, ...props }) {
  return (
    <PageColumn { ...props } classModifier="end">
      { children }
      { footer && <MiniFooter /> }
    </PageColumn>
  );
}
EndColumn.propTypes = {
  children: PropTypes.node,
  footer: PropTypes.bool,
};

export default function Page({ children, className }) {
  let cssClass = 'Page';
  if (className) {
    cssClass += ` ${className}`;
  }
  return (
    <div className={ cssClass }>
      { children }
    </div>
  );
}

Page.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};
