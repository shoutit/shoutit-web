import React from 'react';
import {Grid, Column, Icon} from '../../helper';
import ListenButton from '../../general/listenButton.jsx';
import MessageButton from '../../general/messageButton.jsx';
import ListenersButton from '../../general/listenersButton.jsx';
import ListeningButton from '../../general/listeningButton.jsx';
import UserListeningTagsButton from '../../general/userListeningTagsButton.jsx';
import Popuplist from '../popuplist/popuplist.jsx';

export default React.createClass({
  displayName: "ProfileButtonsCard",

  propTypes: {
    user: React.PropTypes.object.isRequired
  },

  contextTypes: {
    flux: React.PropTypes.object
  },

  getInitialState() {
    return {
      activePopuplist: null
    }
  },

  componentDidMount() {
    this._notificationSystem = this.refs.notificationSystem;
  },

  componentDidUpdate() {
    this._notificationSystem = this.refs.notificationSystem;
  },

  renderPopuplists() {
    const {username} = this.props.user;
    const { onListeningChange, flux } = this.props;
    return (
      <Popuplist
        open={Boolean(this.state.activePopuplist)}
        onClose={ this.onPopuplistClose }
        username={ username }
        type={ this.state.activePopuplist }
        onListeningChange={ onListeningChange }
        flux={ flux }
      />
    );
  },

  onPopuplistClose() {
    this.setState({activePopuplist: null})
  },

  listOnClick(type) {
    return () => {
      this.setState({activePopuplist: type});
    }
  },

  renderForOwner() {
    let user = this.props.user;

    return (
      <Grid fluid={true} className="si-card" style={{paddingTop: "15px"}}>
        <Column fluid={true} clear={true} size="5" onClick={this.listOnClick("Listeners")}>
          <ListenersButton user={user}/>
        </Column>
        <Column fluid={true} size="5" onClick={this.listOnClick("Listening")}>
          <ListeningButton user={user}/>
        </Column>
        <Column fluid={true} size="5" onClick={this.listOnClick("Tags")}>
          <UserListeningTagsButton user={user}/>
        </Column>
        {this.renderPopuplists()}
      </Grid>
    );
  },

  renderForViewers() {
    let {username} = this.props.user;
    let flux = this.context.flux;

    return (
      <Grid fluid={true} className="si-card" style={{paddingTop: "15px"}}>
        <Column fluid={true} clear={true} size="5">
          <ListenersButton user={this.props.user}/>
        </Column>
        <Column fluid={true} size="5">
          <MessageButton />
        </Column>
        <Column fluid={true} size="5">
          <ListenButton username={username} onChange={this.onUserListenChange} flux={flux}/>
        </Column>
        <NotificationSystem ref="notificationSystem"/>
      </Grid>
    );
  },

  render() {
    if (this.props.user.is_owner) {
      return this.renderForOwner();
    } else {
      return this.renderForViewers();
    }
  }

});
