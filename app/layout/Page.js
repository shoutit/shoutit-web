/* eslint-disable react/no-multi-comp */

import React, { PropTypes, Component } from 'react';
import Sticky from '@economist/component-stickyfill';
import { Desktop } from '../utils/MediaQueries';

import MiniFooter from '../layout/MiniFooter';
import './Page.scss';

class PageColumn extends Component {
  static propTypes = {
    sticky: PropTypes.bool,
    classModifier: PropTypes.string,
    children: PropTypes.node,
  }
  static defaultProps = {
    sticky: false,
  }
  render() {
    let className = 'PageColumn';
    if (this.props.classModifier) {
      className += ` ${this.props.classModifier}`;
    }
    if (this.props.sticky) {
      className += ' sticky';
    }
    const content = (
      <div className={ className }>
        { this.props.children }
      </div>
    );
    if (this.props.sticky) {
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
    <Desktop>
      <PageColumn { ...props } classModifier="start" />
    </Desktop>
  );
}
export function EndColumn({ children, footer = false, ...props }) {
  return (
    <Desktop>
      <PageColumn { ...props } classModifier="end">
        { children }
        { footer && <MiniFooter /> }
      </PageColumn>
    </Desktop>
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
