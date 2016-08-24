import React, { PropTypes, Component } from 'react';
import classNames from 'classnames';

import './Form.scss';

/**
 * Create a standard HTML form element. The form element can display errors using the `error`
 * prop and is submitted when pressing the Enter key in one of its fields (to disable
 * this behavior, set `submitOnEnter` prop to false).
 *
 * @export
 * @class Form
 * @extends {Component}
 */

export default class Form extends Component {

  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    error: PropTypes.object,
    onSubmit: PropTypes.func,
    style: PropTypes.object,
    submitOnEnter: PropTypes.bool,
  };

  static defaultProps = {
    submitOnEnter: true,
  }

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  state = {
    submitOnEnter: false,
  }

  componentDidMount() {
    if (this.props.submitOnEnter) {
      this.enableSubmit();
    }
  }

  node = null

  enableSubmit() {
    this.setState({
      submitOnEnter: true,
    });
  }

  blur() {
    [...this.node.elements]
      .filter(el => typeof (el.blur) === 'function')
      .forEach(el => el.blur());
  }

  handleSubmit(e) {
    e.preventDefault();
    this.blur();
    if (this.props.onSubmit) {
      this.props.onSubmit(e);
    }
  }

  renderError(error) {
    const errorMessages = [];
    if (error) {
      if (error.hasOwnProperty('errors')) {
        error.errors.filter(error => !error.location).forEach(error => errorMessages.push(error.message));
      } else {
        errorMessages.push(error.message || 'An error happened. Please try again.');
      }
    }

    if (errorMessages.length === 0) {
      return null;
    }

    return (
      <ul className="Form-errors">
        { errorMessages.map((message, i) => <li key={ i }>{ message }</li>) }
      </ul>
    );
  }

  render() {
    const { className, children, error, ...props } = this.props;
    const cssClass = classNames('Form', className);

    return (
      <form
        method="post"
        noValidate
        { ...props }
        className={ cssClass }
        onSubmit={ this.handleSubmit }
        ref={ el => this.node = el }>
        { children }
        { this.renderError(error) }
        { this.state.submitOnEnter && <button type="submit" style={ { display: 'none' } } /> }
      </form>
    );
  }
}
