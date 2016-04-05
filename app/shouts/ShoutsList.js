import React, { PropTypes, Component } from 'react';

import ShoutPreview from './ShoutPreview';

if (process.env.BROWSER) {
  require('./ShoutsList.scss');
}

export default class ShoutsList extends Component {

  static state = {
    layout: 'extended',
  };

  static propTypes = {
    shouts: PropTypes.array,
    showProfile: PropTypes.bool,
  };

  static defaultProps = {
    shouts: [],
    showProfile: true,
  };

  render() {
    const { shouts, showProfile } = this.props;
    return (
      <div className="ShoutsList">
        { shouts.map(shout =>
          <div className="ShoutsList-item" key={ shout.id }>
            <ShoutPreview shout={ shout } showProfile={ showProfile } />
          </div>
        )}
      </div>
    );
  }
}
