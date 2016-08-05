import React, { PropTypes, Component } from 'react';

import Picker from '../forms/Picker';

export default class ValuePicker extends Component {
  static propTypes = {
    defaultValue: PropTypes.string,
    values: PropTypes.array,
  }
  render() {
    const { defaultValue, values, ...rest } = this.props;
    return (
      <Picker { ...rest }>
        <option value="">{ defaultValue }</option>
        { values.map(item =>
          <option value={ item.value } key={ item.value }>
            { item.label }
          </option>
        ) }
      </Picker>
    );
  }
}

ValuePicker.defaultProps = {
  values: [],
};
