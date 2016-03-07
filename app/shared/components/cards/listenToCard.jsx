import React from 'react';
import { Link } from "react-router";
import {Icon, Column, Grid, Progress} from '../helper';
import ListenButton from "../general/listenButton.jsx";
import UserAvatar from '../user/UserAvatar.jsx';

export default React.createClass({
  displayName: "listenToCard",

  getDefaultProps() {
    return {
      users: []
    };
  },

  getInitialState() {
    return {
      more: false
    }
  },

  toggleMore() {
    this.setState({more: !this.state.more});
  },

  render() {
    const { users, loading, flux, currentLocation } = this.props;
    const itemsLimit = this.state.more? users.length: 3;

    return (
      <section className="si-card" >
        <div className="card-header">
          <h3 className="pull-left">to listen to</h3>
          <span className="refresh-btn pull-right"
            onClick={ () => {flux.actions.getSuggestions(currentLocation, ["users"])} }>Refresh</span>
          <span onClick={this.toggleMore} className="more-btn pull-right">
            {this.state.more ? "Less" : "More"}
          </span>
        </div>

        { loading?
          <Progress />
          :
          users.slice(0, itemsLimit).map((user, idx) => {
            return (
              <Grid fluid={true} key={ `card-listen-to-${idx}` }>
                <Column fluid={true} clear={true} size="3" className="card-list-img">
                  <span className="pull-left">
                    <UserAvatar user={ user } size="small" linkToUserPage />
                  </span>
                </Column>
                <Column fluid={true} size="9" className="card-list-item">
                  <Link to={`/user/${user.username}`}>{ user.name }</Link>
                </Column>
                <Column fluid={true} size="3">
                  <ListenButton
                    onListen={ flux.actions.listen }
                    onStopListen={ flux.actions.stopListen }
                    flux={ flux }
                    username={ user.username }
                    hasTitle={ false }
                  />
                </Column>
              </Grid>
            );
          })
        }

      </section>
    );
  }
});
