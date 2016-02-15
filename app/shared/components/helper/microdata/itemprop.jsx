/**
 * Created by Philip on 22.04.2015.
 */

import React from 'react';
import itemTypes from './types';
import itemProps from './properties';
import keys from 'lodash/object/keys';

let propArray = keys(itemProps);

export default React.createClass({
  displayName: "itemScope",

  propTypes: {
    children: React.PropTypes.element.isRequired,
    property: React.PropTypes.oneOf(propArray).isRequired
  },

  render() {
    let prop = this.props.property,
      content = this.props.content;

    let microdataProps = {
      itemProp: prop
    };

    if (content) {
      microdataProps.content = content;
    }

    if (itemProps[prop] && itemProps[prop].itemScope && itemTypes[itemProps[prop].itemScope]) {
      microdataProps.itemScope = true;
      microdataProps.itemType = itemTypes[itemProps[prop].itemScope];
    }

    let inputReactObject = React.Children.only(this.props.children);
    return React.cloneElement(inputReactObject, microdataProps);
  }
});
