import React from 'react';
import {Progress, Icon, Column, Grid} from '../helper';
import ShoutPreview from '../shout/ShoutPreview.jsx';
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
      gridView: false
    };
  },

  componentDidMount() {
    const username = this.props.username,
      userShouts = this.props.shouts[username] || {},
      offers = userShouts[this.props.type + 's'];

    if (!offers) {
      this.context.flux.actions.loadUserShouts(this.props.username, this.props.type);
    }
  },

  renderProfileShouts(shouts) {
    return shouts? shouts.map((shout, i) => {
      return (
        <Grid fluid>
          <ShoutPreview
            gridView={this.state.gridView}
            listType="small"
            key={"shout-" + i}
            shout={shout}
            index={i}
          />
        </Grid>
      );
    }) : <h4>No shouts posted by this user yet :(</h4>;
  },

  renderViewportSensor() {
    let username = this.props.username,
      userShouts = this.props.shouts[username] || {},
      shouts = userShouts[this.props.type + 's'];

    const { loading } = this.props;

    if(shouts && !loading) {
      return (
        <Grid fluid={true}>
          <ViewportSensor onChange={this.onLastVisibleChange} />
        </Grid>
      );
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
    const { gridView } = this.state;
    let gridIcon, listIcon;
    shouts = shouts || {};

    if(gridView) {
      gridIcon = "grid_active";
      listIcon = "list_inactive";
    } else {
      gridIcon = "grid_inactive";
      listIcon = "list_active";
    }

    const name = users[username]? users[username].name: "";

    return (
      <Grid fluid={true}>
        <Column size="11" clear={true} fluid={true}>
          <h3 className="switch-bar-title">{name}'s shouts</h3>
        </Column>
        <Column size="4" fluid={true}>
          {shouts.length?
            <div className="switch-bar pull-right">
              <Icon name={gridIcon} onSwitchClick={ () => { this.setState({gridView: !gridView}); } }
                className="grid-btn pull-left"/>
              <Icon name={listIcon} onSwitchClick={ () => { this.setState({gridView: !gridView}); } }
                className="list-btn pull-left"/>
            </div>
          : null}
        </Column>
      </Grid>
    );
  },

  render() {
    let username = this.props.username,
      userShouts = this.props.shouts[username] || {},
      shouts = userShouts[this.props.type + 's'];

    const { loading } = this.props;

    return (
      <Grid fluid={true} >
        { this.renderSwitchBar(shouts) }
        { this.renderProfileShouts(shouts) }
        { loading?
          <Progress/>
          :
          this.renderViewportSensor()
        }
      </Grid>
    );
  }
});
