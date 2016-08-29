import React, { Component, PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import ShoutsList from '../../shouts/ShoutsList';

import { loadRelatedShouts } from '../../actions/shouts';

import { getRelatedShouts } from '../../reducers/paginated/relatedShoutsByShout';

class ShoutPageRelated extends Component {

  static propTypes = {
    shouts: PropTypes.array,
    shoutId: PropTypes.string.isRequired,
    loadShouts: PropTypes.func.isRequired,
  }

  componentDidMount() {
    this.props.loadShouts();
  }

  componentWillUpdate(nextProps) {
    if (nextProps.shoutId !== this.props.shoutId) {
      this.props.loadShouts();
    }
  }

  render() {
    if (!this.props.shouts || this.props.shouts.length === 0) {
      return null;
    }
    return (
      <div className="ShoutPage-Related">
        <h4>
          <FormattedMessage
            id="shout.related"
            defaultMessage="Related Shouts"
          />
        </h4>
        <ShoutsList shouts={ this.props.shouts } />
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  shouts: getRelatedShouts(state, ownProps.shoutId),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  loadShouts: () => dispatch(loadRelatedShouts(ownProps.shoutId, { page_size: 8 })).catch(() => {}),
});

export default connect(mapStateToProps, mapDispatchToProps)(ShoutPageRelated);
