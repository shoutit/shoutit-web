/* eslint-disable react/no-multi-comp */
import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

import './Pager.scss';

function makeUrl(baseUrl, page) {
  if (!baseUrl) {
    return '';
  }
  if (page <= 1) {
    return baseUrl;
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
    maxItems: PropTypes.number,

    previousLabel: PropTypes.node,
    nextLabel: PropTypes.node,
    onPageClick: PropTypes.func,
  }

  static defaultProps = {
    previousLabel: '←',
    nextLabel: '→',
    maxItems: 5,
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
    const items = [];
    const { total, current, maxItems } = this.props;

    if (total <= maxItems) {
      // Display all the page numbers
      for (let i = 1; i <= total; i++) {
        items.push(
          <PageItem
            key={ items.length }
            url={ this.props.url }
            active={ i === current }
            onClick={ this.handlePageClick }
            page={ i }>
            { i }
          </PageItem>
        );
      }
    } else if (current < maxItems - 1) {
      for (let i = 1; i < maxItems; i++) {
        items.push(
          <PageItem
            key={ items.length }
            url={ this.props.url }
            active={ i === current }
            onClick={ this.handlePageClick }
            page={ i }>
            { i }
          </PageItem>
        );
      }
      items.push(
        <PageItem key={ items.length } disabled />
      );
      // End of the batch, display first and last 5
      items.push(
        <PageItem
          key={ items.length }
          url={ this.props.url }
          onClick={ this.handlePageClick }
          page={ total }>
          { total }
        </PageItem>
      );
    } else if (current > total - maxItems + 2) {
      // End of the batch, display first and last 5
      items.push(
        <PageItem
          key={ items.length }
          url={ this.props.url }
          onClick={ this.handlePageClick }
          page={ 1 }>
          1
        </PageItem>
      );
      items.push(<PageItem key={ items.length } disabled />);
      for (let i = total - maxItems + 2; i <= total; i++) {
        items.push(
          <PageItem
            key={ items.length }
            url={ this.props.url }
            active={ i === current }
            onClick={ this.handlePageClick }
            page={ i }>
            { i }
          </PageItem>
        );
      }
    } else {
      // Middle of the batch
      items.push(
        <PageItem
          key={ items.length }
          url={ this.props.url }
          onClick={ this.handlePageClick }
          page={ 1 }>
          1
        </PageItem>
      );
      items.push(<PageItem key={ items.length } disabled />);
      for (let i = current - 1; i <= current + 1; i++) {
        items.push(
          <PageItem
            key={ items.length }
            url={ this.props.url }
            active={ i === current }
            onClick={ this.handlePageClick }
            page={ i }>
            { i }
          </PageItem>
        );
      }
      items.push(<PageItem key={ items.length } disabled />);
      items.push(
        <PageItem
          key={ items.length }
          url={ this.props.url }
          onClick={ this.handlePageClick }
          page={ total }>
          { total }
        </PageItem>
      );
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
