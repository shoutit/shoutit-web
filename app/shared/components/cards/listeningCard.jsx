import React from 'react';
import {Icon, Column, Grid} from '../helper';
import UserImage from '../user/userImage.jsx';
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
    return () => {
      this.focusedItem = itemIdx;
      // checking if the mouse stayed for a period on the item or not
      ((idx) => {
        setTimeout(() => {
          if (this.focusedItem === idx) {
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
    // image mock variables
    let userImg = "http://goo.gl/TdBdpF";
    let userImg2 = "http://goo.gl/AoUK08";
    // user mock object
    let user = {
      name: 'Eduardo Saverin',
      username: 'eduardo30',
      image: 'http://goo.gl/AoUK08',
      location: {
        country: 'Singapore'
      }
    }

    return (
      <section className="si-card gray-card" style={{overflow: "visible"}}>
        <div className="card-header">
          <h3>listening to</h3>
        </div>
        <Grid fluid={true} onMouseEnter={this.mouseEnterHandle(0)} onMouseLeave={this.mouseLeaveHandle(0)}>
          <Column fluid={true} clear={true} size="3" className="card-list-img">
            <UserImage type="circle" size="26" className="pull-left" image={userImg}/>
          </Column>
          <Column fluid={true} size="12" className="card-list-item">
            <span>Ryan Gosling</span>
          </Column>
          {this.state.activeTooltip === 0 ?
            <ProfileInfoTooltip user={user}/> : null}
        </Grid>

      </section>
    );

  }
});
