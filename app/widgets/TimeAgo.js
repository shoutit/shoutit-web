import React, { PropTypes, Component } from 'react';
import { toDate } from 'unix-timestamp';
import { FormattedRelative, injectIntl } from 'react-intl';

export class TimeAgo extends Component {

  static propTypes = {
    date: PropTypes.number.isRequired,
    intl: PropTypes.object.isRequired,
  };

  render() {
    const date = toDate(this.props.date);
    const titleOptions = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    };
    return (
      <span className="TimeAgo" title={ this.props.intl.formatDate(date, titleOptions) }>
        <FormattedRelative value={ date } />
      </span>
    );
  }
}

export default injectIntl(TimeAgo);
