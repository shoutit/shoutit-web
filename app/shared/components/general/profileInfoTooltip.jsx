import React from 'react';
import {Icon, Column, Grid, Progress} from '../helper';
import Separator from './separator.jsx';
import UserAvatar from '../user/UserAvatar.jsx';
import ListenButton from "./listenButton.jsx";
import ListenersButton from "./listenersButton.jsx";
import CountryShelfButton from './CountryShelfButton.jsx';

import { imagesPath } from "../../../../config";

export default function ProfileInfoTooltip(props) {
  const { user, loading, flux } = props;
  const defaultCoverImg = imagesPath + "/pattern.png";

  return (
    <div className="profile-info-tooltip">
      <div className="tooltip-box">
        {loading?
          <Progress />
        : user.location &&
          <div>
            <Grid fluid={true} className="profile-cover" style={{
              backgroundImage: `url(${user.cover || defaultCoverImg})`,
              backgroundColor: "#fff"
            }}/>
            <Grid fluid={true} className="profile-context">
                <span className="profile-context-image">
                  <UserAvatar size="large" user={ user } outline />
                </span>
                <h3>{ user.name }</h3>
                <h4>{ user.username }</h4>
            </Grid>
            <Separator style={{marginTop: "-5px"}}/>
            <Grid fluid={true} style={{marginTop: "-10px"}}>
              <Column fluid={true} clear={true} size="5">
                <ListenersButton user={ user } />
              </Column>
              <Column fluid={true} size="5">
                <CountryShelfButton country={ user.location.country } city={ user.location.city } />
              </Column>
              <Column fluid={true} size="5">
                <ListenButton flux={ flux } username={ user.username } onChange={ props.onListeningChange }/>
              </Column>
            </Grid>
          </div>
        }
      </div>
    </div>
  );
}
