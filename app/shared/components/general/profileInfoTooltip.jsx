import React from 'react';
import {Icon, Column, Grid, Progress} from '../helper';
import Separator from './separator.jsx';
import UserImage from '../user/userImage.jsx';
import ListenButton from "./listenButton.jsx";
import ListenersButton from "./listenersButton.jsx";
import CountryShelfButton from './CountryShelfButton.jsx';

import { imagesPath } from "../../../../config";

export default function ProfileInfoTooltip(props) {
  const { user, loading, flux } = props;
  const defaultCoverImg = imagesPath + "/pattern@2x.png";

  return (
    <div className="profile-info-tooltip">
      <div className="tooltip-box">
        {loading?
          <Progress />
        : user.location &&
          <div>
            <Grid fluid={true} className="profile-cover" backgroundImage={ `url(${user.cover || defaultCoverImg}` }>
            </Grid>
            <Grid fluid={true} className="profile-context">
              <Column fluid={true} clear={true} size="13">
                <UserImage image={ user.image } size="64" type="rounded" className="profile-context-image"/>
                <h3>{ user.name }</h3>
                <h4>{ user.username }</h4>
              </Column>
              <Column fluid={true} size="2">
                <Icon name="listen" className="profile-context-listen"/>
              </Column>
            </Grid>
            <Separator />
            <Grid fluid={true} className="profile-actions">
              <Column fluid={true} clear={true} size="5">
                <ListenersButton user={ user }/>
              </Column>
              <Column fluid={true} size="5">
                <CountryShelfButton country={ user.location.country } city={ user.location.city } />
              </Column>
              <Column fluid={true} size="5">
                <ListenButton flux={ flux } username={ user.username }/>
              </Column>
            </Grid>
          </div>
        }
      </div>
    </div>
  );
}
