import React, { Component, PropTypes } from 'react';
import ShoutPrice from '../../shouts/ShoutPrice';
import ShoutType from '../../shouts/ShoutType';

class ShoutPagePrice extends Component {
  static propTypes = {
    shout: PropTypes.object.isRequired,
  }
  render() {
    return (
      <div className="ShoutPage-Price">
        { this.props.shout.price !== null &&
          <div>
            <ShoutPrice shout={ this.props.shout } />
          </div>
        }
        <div>
          <ShoutType shout={ this.props.shout } />
        </div>
      </div>
    );
  }
}

export default ShoutPagePrice;
