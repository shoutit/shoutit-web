import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import { login } from '../utils/FacebookUtils';
import { updateLinkedAccount } from '../actions/session';
import Switch from '../ui/Switch';

export class PublishToFacebook extends Component {

  static propTypes = {
    defaultChecked: PropTypes.bool,
    disabled: PropTypes.bool,
    onLinkedAccountChange: PropTypes.func.isRequired,
    onChange: PropTypes.func,
  }

  static defaultProps = {
    defaultChecked: false,
    disabled: false,
  }

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      checked: props.defaultChecked,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.defaultChecked && !nextProps.defaultChecked && this.state.checked) {
      this.setState({ checked: false });
    }
  }

  getValue() {
    return this.state.checked;
  }

  handleChange(e) {
    const { onChange } = this.props;
    const { checked } = e.target;
    if (!checked) {
      this.setState({ checked });
      if (onChange) {
        onChange(checked);
      }
      return;
    }
    if (this.props.defaultChecked) {
      this.setState({ checked });
      if (onChange) {
        onChange(checked);
      }
      return;
    }
    login({ scope: 'publish_actions' }, (err, response) => {
      if (err) {
        return;
      }
      this.props.onLinkedAccountChange(response.authResponse.accessToken);
      this.setState({ checked });
      if (onChange) {
        onChange(checked);
      }
    });
  }

  render() {
    return (
      <Switch
        disabled={ this.props.disabled }
        checked={ this.state.checked }
        type="checkbox"
        name="publish_to_facebook"
        id="publish_to_facebook"
        onChange={ this.handleChange }
      >
        <FormattedMessage
          id="ui.PublishToFacebook.label"
          defaultMessage="Publish to Facebook"
        />
      </Switch>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  onLinkedAccountChange: facebook_access_token =>
    dispatch(updateLinkedAccount({
      account: 'facebook',
      facebook_access_token,
    })),
});

const wrapped = connect(null, mapDispatchToProps)(PublishToFacebook);
export default wrapped;
