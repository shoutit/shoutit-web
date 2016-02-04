import React from 'react';
import {Progress, Icon, Column, Grid} from '../helper';
import Shout from '../feed/feed/shout.jsx';
import ViewportSensor from '../misc/ViewportSensor.jsx';

let map = {
  request: "Requests",
  offer: "Offers"
};

export default React.createClass({
  displayName: "ProfileShoutList",

  contextTypes: {
    flux: React.PropTypes.object
  },

  getInitialState() {
    return {
      presentLayer: 'list'
    }
  },

  componentDidMount() {
    let username = this.props.username,
      userShouts = this.props.shouts[username] || {},
      shouts = userShouts[this.props.type + 's'];

    if (!userShouts || !shouts) {
      this.context.flux.actions.loadUserShouts(this.props.username, this.props.type);
    }
  },

  renderProfileShouts(shouts) {
    let onLastVisibleChange = this.onLastVisibleChange;

    return shouts.length ? shouts.map((shout, i) => {
      return <Shout presentLayer={this.state.presentLayer} listType="small" key={"shout-" + i} shout={shout} index={i}/>;
    }) : <h4>No shouts posted by this user yet :(</h4>;
  },

  renderViewportSensor() {
    let username = this.props.username,
      userShouts = this.props.shouts[username] || {},
      shouts = userShouts[this.props.type + 's'];

    if(userShouts && shouts) {
      if(this.props.loading) {
        return (
          <Progress />
          );
      } else {
        return (
          <ViewportSensor onChange={this.onLastVisibleChange}></ViewportSensor>
          );
      }
    }
  },

  onLastVisibleChange(isVisible) {
    if (isVisible) {
      this.loadMore();
    }
  },

  loadMore() {
    this.context.flux.actions.loadMoreUserShouts(this.props.username, this.props.type);
  },

  renderSwitchBar(shouts) {
    const {users, username} = this.props;
    shouts = shouts || {};

    const gridBtn = this.state.presentLayer === 'grid'? 'grid_active': 'grid_inactive';
    const listBtn = this.state.presentLayer === 'list'? 'list_active': 'list_inactive';
    const name = users[username]? users[username].name: '';

    return (
      <Grid fluid={true}>
        <Column size="11" clear={true} fluid={true}>
          <h3 className="switch-bar-title">{name}'s shouts</h3>
        </Column>
        <Column size="4" fluid={true}>
          {shouts.length?
            <div className="switch-bar pull-right">
              <Icon name={gridBtn} onSwitchClick={this.presentToggle} className="grid-btn pull-left"/>
              <Icon name={listBtn} onSwitchClick={this.presentToggle} className="list-btn pull-left"/>
            </div>
          : null}
        </Column>
      </Grid>
    );
  },

  presentToggle() {
    let present = this.state.presentLayer;

    if(present === 'list') {
      this.setState({presentLayer: 'grid'});
    } else if(present === 'grid') {
      this.setState({presentLayer: 'list'});
    }
  },

  render() {
    let username = this.props.username,
      user = this.props.users[username],
      userShouts = this.props.shouts[username] || {},
      shouts = userShouts[this.props.type + 's'],
      markup = null;

    if (shouts) {
      markup = this.renderProfileShouts(shouts);
    } else {
      markup = <Progress/>;
    }

    return (
      <Grid fluid={true} >
        {this.renderSwitchBar(shouts)}
        {markup}
        {this.renderViewportSensor()}
      </Grid>
    );
  }
});
