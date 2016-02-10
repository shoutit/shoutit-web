import React from 'react';
import {Icon, Column, Grid, Progress} from '../helper';
import ListenButton from "../general/listenButton.jsx";
import UserImage from '../user/userImage.jsx';

export default React.createClass({
  displayName: "listenToCard",

  getInitialState() {
    return {
      more: false
    }
  },

  toggleMore() {
    this.setState({more: !this.state.more});
  },

  render() {
    const { users, loading } = this.props;

    return (
      <section className="si-card" style={{maxHeight: this.state.more? "initial": "157px"}}>
        <div className="card-header">
          <h3 className="pull-left">to listen to</h3>
          <span className="refresh-btn pull-right">Refresh</span>
          <span onClick={this.toggleMore} className="more-btn pull-right">
              {this.state.more ? "Less" : "More"}
          </span>
        </div>

        { loading?
          <Progress />
          :
          users.map((user, idx) => {
            return (
              <Grid fluid={true} key={ `card-listen-to-${idx}` }>
                <Column fluid={true} clear={true} size="3" className="card-list-img">
                  <UserImage type="circle" size="26" className="pull-left" image={ user.image }/>
                </Column>
                <Column fluid={true} size="9" className="card-list-item">
                  <span>{ user.name }</span>
                </Column>
                <Column fluid={true} size="3">
                  <ListenButton flux={this.props.flux}
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
