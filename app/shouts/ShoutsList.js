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
  };

  static defaultProps = {
    shouts: [],
  };

  render() {
    const { shouts } = this.props;
    return (
      <div className="ShoutsList">
        { shouts.map(shout =>
          <div className="ShoutsList-item" key={ shout.id }>
            <ShoutPreview shout={ shout } />
          </div>
        )}
      </div>
    );
  }
}
