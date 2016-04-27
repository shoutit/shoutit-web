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
    showCategory: PropTypes.bool,
    columns: PropTypes.number,
  };

  static defaultProps = {
    shouts: [],
    showProfile: true,
    showCategory: true,
    columns: 2,
  };

  render() {
    const { shouts, showProfile, showCategory, columns } = this.props;
    const width = `${100 / columns}%`;
    return (
      <div className="ShoutsList">
        { shouts.map(shout =>
          <div className="ShoutsList-item" style={ { width } } key={ shout.id }>
            <ShoutPreview shout={ shout } showProfile={ showProfile } showCategory={ showCategory } />
          </div>
        ) }
      </div>
    );
  }
}
