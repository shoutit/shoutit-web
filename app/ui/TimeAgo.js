import React, { PropTypes, Component } from 'react';
import moment from 'moment';

export default class TimeAgo extends Component {

  static propTypes = {
    date: PropTypes.number.isRequired,
  };

  render() {
    const m = moment.unix(this.props.date);
    return (
      <span className="TimeAgo" title={ m.format() }>
        { m.fromNow() }
      </span>
    );
  }
}
