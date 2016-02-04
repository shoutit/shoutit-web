import React from 'react';
import {Icon} from '../helper';

export default React.createClass({
  displayName: "ShoutDetailActions",

  getDefaultProps() {
    return {
      actions: [
        {icon: "ir1"},
        {icon: "b1"},
        {icon: "ir3"},
        {icon: "ir4"},
        {icon: "b3"},
        {icon: "ir6"},
        {icon: "b2"}
      ]
    };
  },

  renderActions() {
    return this.props.actions.map(function (action, i) {
      let el = "";
      if (action.icon) {
        el = <Icon name={action.icon}/>;
      }
      if (action.onClick) {
        el = <a href="#" onClick={action.onClick}>{el}</a>;
      }
      el = <li key={"shoutDetailAction-" + i}>{el}</li>;

      return el;
    });
  },

  render() {
    return (
      <ul className="book col-md-6">
        {this.renderActions()}
      </ul>
    );
  }
});
