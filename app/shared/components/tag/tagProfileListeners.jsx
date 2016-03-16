import React from 'react';
import {Col} from 'react-bootstrap';
import findIndex from 'lodash/array/findIndex';
import {Progress, Clear} from '../helper';

import ListenerRow from '../profile/popuplist/listenerRow.jsx';

export default React.createClass({
  displayName: "ProfileListeners",
  // 
  // statics: {
  //   fetchId: 'taglisteners',
  //   fetchData(client, session, params) {
  //     return client.tags().getListeners(session, params.tagName);
  //   }
  // },

  componentDidMount() {
    let tagName = this.props.tagName;

    if (!this.props.tags[tagName] || !this.props.tags[tagName].listeners) {
      this.props.flux.actions.loadTagListeners(tagName);
    }
  },

  render() {
    let tagName = this.props.tagName,
      loggedUser = this.props.user,
      tag = this.props.tags[tagName],
      listening = [],
      listeners = tag.listeners,
      flux = this.props.flux,
      listenerChildren, stat;

    if (listeners) {
      stat = <span>({listeners.length})</span>;
      listenerChildren = listeners.length ? listeners.map(function (listener, i) {
        let isListening = findIndex(listening, 'username', listener.username) > -1;
        return (
          <ListenerRow key={"tag-listener-" + tagName + '-' + i } user={listener}
                 listening={isListening} loggedUser={loggedUser} flux={flux}/>
        );
      }) : <h4>This tag has no listeners</h4>;
    } else {
      listenerChildren = <Progress/>;
    }

    return (
      <Col xs={12} md={12} className="content-listener">
        <div className="listener">
          <div className="listener-title">
            <p>Listeners:
              {stat}
            </p>
          </div>
          <Clear/>

          <div className="listener-scroll" tabIndex="5000" style={{overflow: "hidden", outline: "none"}}>
            {listenerChildren}
          </div>
        </div>
      </Col>
    );
  }
});
