import React from 'react';
import {Link} from 'react-router';
import {Grid, Column} from '../../helper';
import ListenButton from '../../general/listenButton.jsx';
import UserImage from '../../user/userImage.jsx';

export default React.createClass({
  displayName: "ListenerRow",

  contextTypes: {
    flux: React.PropTypes.object
  },

  onButtonChange(ev) {
    if(this.props.onChange) {
      this.props.onChange(ev);
    }
  },

  render() {
    const listener = this.props.user;
    const flux = this.context.flux;

    if(listener.username) {
      return (
        <Grid fluid={true} className="popuplist-row">
          <Column fluid={true} clear={true} size="2" >
            <Link to={`/user/${encodeURIComponent(listener.username)}`}>
              <UserImage size="32" image={listener.image} type="circle"/>
            </Link>
          </Column>
          <Column fluid={true} size="10" className="popuplist-text-row">
            <Link to={`/user/${encodeURIComponent(listener.username)}`}>
              {listener.name}
            </Link>
          </Column>
          <Column fluid={true} size="3" style={{paddingTop: "5px"}}>
            <ListenButton key={listener.id}
                    username={listener.username}
                    onChange={this.onButtonChange}
                    hasTitle={false}
                    flux={flux}
                    />
          </Column>
        </Grid>
      );
    } else {
      return null;
    }
  }
});
