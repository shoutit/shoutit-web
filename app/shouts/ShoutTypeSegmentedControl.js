import React, { PropTypes, Component } from 'react';
import { injectIntl, defineMessages } from 'react-intl';
import SegmentedControl from '../forms/SegmentedControl';

const MESSAGES = defineMessages({
  offers: {
    id: 'shoutTypeControl.offer',
    defaultMessage: 'Offers',
  },
  requests: {
    id: 'shoutTypeControl.request',
    defaultMessage: 'Requests',
  },
  all: {
    id: 'shoutTypeControl.all',
    defaultMessage: 'All',
  },
});

export class ShoutTypeSegmentedControl extends Component {

  static propTypes = {
    intl: PropTypes.object.isRequired,
  };

  getValue() {
    return this.el.getValue();
  }

  render() {
    const { intl, ...props } = this.props;
    const { formatMessage } = intl;
    const options = [
      { label: formatMessage(MESSAGES.all), value: 'all' },
      { label: formatMessage(MESSAGES.offers), value: 'offer' },
      { label: formatMessage(MESSAGES.requests), value: 'request' },
    ];
    return (
      <SegmentedControl
        { ...props }
        options={ options }
      />
    );
  }
}

export default injectIntl(ShoutTypeSegmentedControl);
