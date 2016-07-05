/* eslint-disable react/no-multi-comp */
import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

import './Pager.scss';

function makeUrl(baseUrl, page) {
  if (!baseUrl) {
    return '';
  }
  if (baseUrl.indexOf('?') === -1) {
    return `${baseUrl}?page=${page}`;
  }
  return `${baseUrl}&page=${page}`;
}

class PageItem extends Component {
  static propTypes = {
    active: PropTypes.bool,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
    children: PropTypes.node,
    page: PropTypes.number,
    url: PropTypes.string,
  }
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(e) {
    if (this.props.disabled) {
      e.preventDefault();
      return;
    }
    if (this.props.onClick && !this.props.active && !this.props.disabled) {
      this.props.onClick(this.props.page);
    }
  }
  render() {
    let className = this.props.active ? 'active' : '';
    if (this.props.disabled) {
      className += ' disabled';
    }
    return (
      <li className={ className }>
        <Link
          onClick={ this.handleClick }
          to={ makeUrl(this.props.url, this.props.page) }
        >
          { this.props.disabled ? '…' : this.props.children }
        </Link>
      </li>
    );
  }
}

class ButtonItem extends Component {
  static propTypes = {
    active: PropTypes.bool,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
    children: PropTypes.node,
    page: PropTypes.number,
    url: PropTypes.string,
  }
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(e) {
    if (this.props.disabled) {
      e.preventDefault();
      return;
    }
    if (this.props.onClick && !this.props.disabled) {
      this.props.onClick(this.props.page);
    }
  }
  render() {
    const className = this.props.disabled ? 'disabled' : '';
    return (
      <li className={ className }>
        <Link onClick={ this.handleClick } to={ makeUrl(this.props.url, this.props.page) } aria-hidden="true">
          { this.props.children }
        </Link>
      </li>
    );
  }
}

export default class Pager extends Component {

  static propTypes = {
    current: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    url: PropTypes.string,

    previousLabel: PropTypes.node,
    nextLabel: PropTypes.node,
    onPageClick: PropTypes.func,
  }

  static defaultProps = {
    previousLabel: '←',
    nextLabel: '→',
  }

  constructor(props) {
    super(props);
    this.handlePageClick = this.handlePageClick.bind(this);
  }

  handlePageClick(page) {
    if (this.props.onPageClick) {
      this.props.onPageClick(page);
    }
  }

  renderFirstItem() {
    return (
      <ButtonItem
        url={ this.props.url }
        disabled={ this.props.current === 1 }
        onClick={ this.handlePageClick }
        page={ this.props.current - 1 }>
        { this.props.previousLabel }
      </ButtonItem>
    );
  }

  renderLastItem() {
    return (
      <ButtonItem
        url={ this.props.url }
        disabled={ this.props.current === this.props.total }
        onClick={ this.handlePageClick }
        page={ this.props.current + 1 }>
        { this.props.nextLabel }
      </ButtonItem>
    );
  }

  renderItems() {
    const { total, current } = this.props;
    const items = [];
    let from = 1;
    let active;
    const skip = 2;
    let to = total;

    if (current > skip) {
      from = current - skip;
    }
    if (total - current > skip) {
      to = current + skip;
    }
    if (from !== 1) {
      items.push(<PageItem url={ this.props.url } onClick={ this.handlePageClick } page={ 1 }>1</PageItem>);
      if (from > 1) {
        items.push(<PageItem disabled />);
      }
    }

    for (let i = from; i <= to; i++) {
      active = current === i;
      items.push(<PageItem url={ this.props.url } active={ active } onClick={ this.handlePageClick } page={ i }>{ i }</PageItem>);
    }

    if (to < total - 1) {
      active = current === total - 1;
      if (to < total - 2) {
        items.push(<PageItem disabled />);
      }
      items.push(<PageItem url={ this.props.url } onClick={ this.handlePageClick } page={ total }>{ total }</PageItem>);
    }
    return items;
  }

  render() {
    return (
      <ul className="Pager">
        { this.renderFirstItem() }
        { this.renderItems() }
        { this.renderLastItem() }
      </ul>
    );
  }
}
