import React from 'react';
import { Link } from "react-router";
import {Icon, Column, Grid} from '../helper';
import UserAvatar from '../../../users/UserAvatar';
import ProfileInfoTooltip from '../general/profileInfoTooltip.jsx';

var HOVER_EFFECT_DURATION = 500;

export default React.createClass({
  displayName: "ListeningCard",

  contextTypes: {
    params: React.PropTypes.object
  },

  getInitialState() {
    return {
      activeTooltip: null
    }
  },

  mouseEnterHandle(itemIdx) {
    const { listening, flux } = this.props;

    return () => {
      this.focusedItem = itemIdx;
      // checking if the mouse stayed for a period on the item or not
      ((idx) => {
        setTimeout(() => {
          if (this.focusedItem === idx) {
            flux.actions.loadUser(listening[idx].username);
            this.setState({activeTooltip: idx});
          }
        }, HOVER_EFFECT_DURATION)
      })(itemIdx);
    }
  },

  mouseLeaveHandle(itemIdx) {
    return () => {
      this.focusedItem = null;
      this.setState({activeTooltip: null});
    }
  },

  render() {
    const { listening, flux } = this.props;

    return (
      <section className="si-card gray-card" style={{overflow: "visible"}}>
        <div className="card-header">
          <h3>listening to</h3>
        </div>
        {listening.map((item, idx) => {
          return (
            <Grid
              fluid={true}
              key={`listening-card-${idx}`}
              onMouseEnter={this.mouseEnterHandle(idx)}
              onMouseLeave={this.mouseLeaveHandle(idx)}>
              <Column fluid={true} clear={true} size="3" className="card-list-img">
                <span className="pull-left">
                  <UserAvatar user={ item } size="small" linkToUserPage />
                </span>
              </Column>
              <Column fluid={true} size="12" className="card-list-item">
                <Link to={`/user/${item.username}`}>{ item.name }</Link>
              </Column>
              {this.state.activeTooltip === idx &&
                <ProfileInfoTooltip
                  user={ item }
                  loading={ !item.location }
                  flux={ flux }
                />
              }
            </Grid>
          );
        })}
      </section>
    );

  }
});
