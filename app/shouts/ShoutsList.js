import React, { PropTypes, Component } from 'react';

import ShoutPreview from './ShoutPreview';

import './ShoutsList.scss';

export default class ShoutsList extends Component {

  static state = {
    layout: 'extended',
  };

  static propTypes = {
    shouts: PropTypes.array,
    showProfile: PropTypes.bool,
    showCategory: PropTypes.bool,
  };

  static defaultProps = {
    shouts: [],
    showProfile: true,
    showCategory: true,
  };

  render() {
    const { shouts, showProfile, showCategory } = this.props;
    return (
      <div className="ShoutsList">
        { shouts.map((shout, i) =>
          <div className="ShoutsList-item" key={ i }>
            <ShoutPreview
              shout={ shout }
              showProfile={ showProfile }
              showCategory={ showCategory }
              size="flexible-medium"
            />
          </div>
        ) }
      </div>
    );
  }
}
