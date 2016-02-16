import React from 'react';
import {Icon, Column, Grid} from '../helper';
import Separator from '../general/separator.jsx';
import UserImage from '../user/userImage.jsx';
import CountryFlag from '../helper/CountryFlag.jsx';

export default React.createClass({
  displayName: 'ProfileInfoTooltip',

  propTypes: {
    user: React.PropTypes.object
  },

  render() {
    let name = this.props.user.name,
      username = this.props.user.username,
      image = this.props.user.image,
      country = this.props.user.location.country;

    return (
      <div className="profile-info-tooltip">
        <div className="tooltip-box">
          <Grid fluid={true} className="profile-cover">
          </Grid>
          <Grid fluid={true} className="profile-context">
            <Column fluid={true} clear={true} size="13">
              <UserImage image={image} size="64" type="rounded" className="profile-context-image"/>
              <h3>{name}</h3>
              <h4>{username}</h4>
            </Column>
            <Column fluid={true} size="2">
              <Icon name="listen" className="profile-context-listen"/>
            </Column>
          </Grid>
          <Separator />
          <Grid fluid={true} className="profile-actions">
            <Column fluid={true} clear={true} size="5">
              <div className="si-country-button">
                <CountryFlag code={ country }/>
                {country}
              </div>
            </Column>
            <Column fluid={true} size="5">
              <div className="si-listening-button">
                <Icon name="listening"/>
                Listening
              </div>
            </Column>
            <Column fluid={true} size="5">
              <div className="si-message-button">
                <Icon name="message"/>
                Message
              </div>
            </Column>
          </Grid>
        </div>
      </div>
    );
  }
});
