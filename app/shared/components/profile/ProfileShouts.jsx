import React from "react";
import {Progress, Icon, Column, Grid} from "../helper";
import ShoutPreview from "../shout/ShoutPreview.jsx";
import ViewportSensor from "../misc/ViewportSensor.jsx";

export default class ProfileShouts extends React.Component {
  state = {
    gridView: false
  };

  componentDidMount() {
    const { username, shouts, flux } = this.props;
    const userShouts = shouts[username];

    if (!userShouts) {
      flux.actions.loadUserShouts(username);
    }
  }

  componentDidUpdate(prevProps) {
    const { username, shouts, flux } = this.props;

    if (prevProps.username !== username && !shouts[username]) {
      flux.actions.loadUserShouts(username);
    }
  }

  handleSensor(isVisible) {
    if (isVisible) {
      const { username, flux } = this.props;

      flux.actions.loadMoreUserShouts(username);
    }
  }

  renderSwitchBar(shouts) {
    const { users, username } = this.props;
    const { gridView } = this.state;


    let gridIcon = "grid_inactive";
    let listIcon = "list_active";

    if (gridView) {
      gridIcon = "grid_active";
      listIcon = "list_inactive";
    }

    const userFullName = users[username]? users[username].name: "";

    return (
      <Grid fluid>
        <Column size="11" clear fluid>
          <h3 className="switch-bar-title">{ userFullName }'s shouts</h3>
        </Column>
        <Column size="4" fluid>

          {shouts &&
            <div className="switch-bar pull-right">
              <Icon name={ gridIcon } onSwitchClick={ () => { this.setState({gridView: !gridView}); } }
                className="grid-btn pull-left"/>
              <Icon name={ listIcon } onSwitchClick={ () => { this.setState({gridView: !gridView}); } }
                className="list-btn pull-left"/>
            </div>
          }

        </Column>
      </Grid>
    );
  }

  render() {
    const { username, shouts } = this.props;
    const userShouts = shouts[username] && shouts[username].list;
    const loading = shouts[username] && shouts[username].loading;

    return (
      <Grid fluid>
        { this.renderSwitchBar(shouts) }
        {
          userShouts? userShouts.map((shout, i) =>
            <Grid fluid>
              <ShoutPreview
                gridView={ this.state.gridView }
                key={"shout-" + i}
                shout={ shout }
                index={ i }
              />
            </Grid>
          )
          : <h4>No shouts posted by this user yet :(</h4>
        }

        {
          loading && <Progress/>
        }

        {
          userShouts && !loading &&
            <Grid fluid>
              hey
              <ViewportSensor onChange={ e => { this.handleSensor(e) } } />
            </Grid>
        }

      </Grid>
    );
  }
}
