import React from 'react';
import {StoreWatchMixin} from 'fluxxor';
import {Progress, Grid} from '../../helper';
import Separator from '../../general/separator.jsx';
import ListenerRow from './listenerRow.jsx';
import TagRow from './tagRow.jsx';
import ViewportSensor from '../../misc/ViewportSensor.jsx';
import Dialog from 'material-ui/lib/dialog';
import popuplistHelper from './popuplistHelpers';
import {Scrollbars} from 'react-custom-scrollbars';
import SearchBar from './searchBar.jsx';

export default React.createClass({
  displayName: "PopupList",
  mixins: [StoreWatchMixin('users', 'tags')],

  propTypes: {
    username: React.PropTypes.string.isRequired,
    type: React.PropTypes.oneOf(['Listeners', 'Listening', 'Tags']),
    open: React.PropTypes.bool.isRequired
  },

  contextTypes: {
    flux: React.PropTypes.object
  },

  getStateFromFlux() {
    const {flux} = this.context;
    const userStore = flux.store("users").getState();

    return {
      tags: flux.store("tags").getState().tags,
      users: userStore.users,
      user: userStore.user,
      listens: userStore.listens,
      loading: userStore.loading
    }
  },

  componentWillMount() {
    // Initializing helper
    this.helper = popuplistHelper(this.props.type, this.props.username);
  },

  componentDidUpdate(prevProps) {
    const {type, username} = this.props;
    const {flux} = this.context;
    // Setting helper
    this.helper = popuplistHelper(type, username);
    // condition to send action
    if (prevProps.type !== type || prevProps.username !== username) {
      switch (type) {
        case 'Listeners':
          flux.actions.loadUserListeners(username);
          break;
        case 'Listening':
          flux.actions.loadUserListening(username);
          break;
        case 'Tags':
          flux.actions.loadUserListeningTags(username);
          break;
      }
    }
  },

  handleClose() {
    if (this.props.onClose) {
      this.props.onClose();
    }
  },

  renderViewportSensor() {
    const list = this.helper.getList(this.state);

    if (this.state.loading && list && list.length) {
      return (
        <Grid fluid={true}>
          <Progress />
        </Grid>);
    } else {
      return (
        <Grid fluid={true}>
          <ViewportSensor onChange={this.onLastVisibleChange}></ViewportSensor>
        </Grid>);
    }
  },

  onLastVisibleChange(isVisible) {
    if (isVisible) {
      this.loadMore();
    }
  },

  loadMore() {
    const {type, username} = this.props;
    const {flux} = this.context;

    switch (type) {
      case 'Listeners':
        flux.actions.loadMoreUserListeners(username);
        break;
      case 'Listening':
        flux.actions.loadMoreUserListening(username);
        break;
      case 'Tags':
        flux.actions.loadMoreUserListeningTags(username);
        break;
    }
  },

  render() {
    const { flux } = this.props;
    const title = this.helper.getTitle();
    const list = this.helper.getList(this.state);

    return (
      <Dialog
        contentClassName="popuplist-dialog"
        modal={false}
        open={this.props.open}
        onRequestClose={this.handleClose}>
        <Grid fluid={true} className="popuplist-content">
          <h3>{title}</h3>
          <Separator />
          <Scrollbars style={{ width: 380, height: 320}} className="si-scrollbar">
            <SearchBar type={this.props.type}/>
            {list && list.length ?
              this.props.type === "Tags" ?
                list.map((tag, idx) => {
                  return (
                    <TagRow
                      key={`tags-popuplist-${idx}`}
                      tag={tag}
                      onListenTag={ flux.actions.listenTag }
                      onStopListenTag={ flux.actions.stopListenTag }
                    />
                  );
                })
                :
                /* Could be listeners or listenings - both use ListenerRow component*/
                list.map((user, idx) => {
                  if(!user) { return null; };
                  return (
                    <ListenerRow
                      key={`listens-popuplist-${idx}`}
                      user={user}
                      onListen={ flux.actions.listen }
                      onStopListen={ flux.actions.stopListen }
                    />
                  );
                })
              :
              <Progress />
            }
            {this.renderViewportSensor()}
          </Scrollbars>
        </Grid>
      </Dialog>
    );
  }
});
