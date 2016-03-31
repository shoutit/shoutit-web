import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

import { loadHomeShouts } from '../actions/users';
import { denormalize } from '../schemas';

const fetchData = store => store.dispatch(loadHomeShouts());

export class Dashboard extends Component {

  static propTypes = {
    shouts: PropTypes.array,
    searchString: PropTypes.string,
    nextUrl: PropTypes.string,
    searchParams: PropTypes.array,
  };

  static fetchData = fetchData;

  componentDidMount() {
    const { firstRender, dispatch } = this.props;
    // if (!firstRender) {
      dispatch(loadHomeShouts());
    // }
  }

  render() {
    return (
      <div>
        Dashboard
        { this.props.shouts.map(shout => <p>{ shout.title }</p>)}
      </div>
    );
  }

}

const mapStateToProps = state => {
  return {
    shouts: state.paginated.shoutsByHome.ids.map(id =>
      denormalize(state.entities.shouts[id], state.entities, 'SHOUT')
    ),
  };
};

export default connect(mapStateToProps)(Dashboard);
