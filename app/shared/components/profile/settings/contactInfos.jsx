import React from 'react';

import {Clear} from '../../helper';
import EditInfoRow from './editInfoRow.jsx';


export default React.createClass({
  displayName: "ContactInformations",

  render() {
    let user = this.props.user;

    let settings = {
      address:{},
      email: {
        has_verify_btn: true,
        is_verified: user.is_activated
      }
    };

    if (this.props.status.email) {
      settings.email.loading = this.props.status.email.loading;
      settings.email.msg = this.props.status.email.msg;
    }

    if (this.props.status.address) {
      settings.address.loading = this.props.status.address.loading;
      settings.address.msg = this.props.status.address.msg;
    }

    return (
      <div className="pro-basic">
        <h3>Contact Information</h3>
        <Clear/>
        <EditInfoRow settings={settings.email} title="Email" value={user.email}
               onSaveClicked={this.onSaveClicked("email")} onChange={this.onInfoChange("email")}
               onVerifyClicked={this.onVerifyClicked()}/>
        <EditInfoRow settings={settings.address} title="Address" value={user.location.address}
               onSaveClicked={this.onSaveClicked("address")} onChange={this.onInfoChange("address")}/>
      </div>
    );
  },

  onSaveClicked(field) {
    let action = this.props.onSaveClicked;
    return function (newValue) {
      action(field, newValue);
    };
  },

  onInfoChange(field) {
    let action = this.props.onInfoChange;
    return function (newValue) {
      action(field, newValue);
    };
  },

  onVerifyClicked() {
    let action = this.props.onVerifyClicked;
    return (field) => action(field);
  }
});
