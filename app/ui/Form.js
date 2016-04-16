import React, { PropTypes, Component } from 'react';

if (process.env.BROWSER) {
  require('./Form.scss');
}

export default class Form extends Component {

  static propTypes = {
    error: PropTypes.object,
    style: PropTypes.object,
    className: PropTypes.string,
    children: PropTypes.node,
    actions: PropTypes.node,
    onSubmit: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  blur() {
    [...this.refs.form.elements].filter(el => !!el.blur).forEach(el => el.blur);
  }

  handleSubmit(e) {
    e.preventDefault();
    this.blur();
    if (this.props.onSubmit) {
      this.props.onSubmit(e);
    }
  }

  render() {
    const { className, children, actions, error, ...props } = this.props;
    let cssClass = 'Form';
    if (className) {
      cssClass += ` ${className}`;
    }
    const errorMessages = [];

    if (error) {
      if (error.hasOwnProperty('errors')) {
        error.errors.filter(error => !error.location).forEach(error => errorMessages.push(error.message));
      } else {
        errorMessages.push(error.message || 'An error happened. Please try again.');
      }
    }

    return (
      <form {...props} className={ cssClass } onSubmit={ this.handleSubmit } ref="form">
        { children }

        { errorMessages.length > 0 &&
          <ul className="Form-errors">
            { errorMessages.map(message => <li>{ message }</li>) }
          </ul>
        }

        { actions &&
          <div className="Form-actions">
            { actions }
          </div>
        }

      </form>
    );
  }
}
