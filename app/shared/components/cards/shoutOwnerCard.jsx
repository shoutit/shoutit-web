import React from 'react';
import {Link} from 'react-router';
import {Icon, Grid, Column, Flag, Progress} from '../helper';
import Separator from '../general/separator.jsx';
import UserImage from '../user/userImage.jsx';
import ListenButton from "../general/listenButton.jsx";
import ListenersButton from "../general/listenersButton.jsx";

export default function shoutOwnerCard(props) {
  const {shout, flux, users, loggedUser} = props;

  const loggedUsername = loggedUser? loggedUser.username: undefined;

  return (
    <section className="si-card shout-owner-card">
      { shout.user?
        <Grid fluid={true}>
          <Column fluid={true} clear={true} size="4" className="owner-info-left">
            <UserImage image={ shout.user.image } type="rounded" height={44} width={44}/>
          </Column>
          <Column fluid={true} size="11" className="owner-info-right">
            <Link to="">{ shout.user.name }</Link>
            <Flag country={ shout.location.country } size="16"/>
            <span>{ shout.location.city }</span>
          </Column>
          <div className="holder">
            <Separator />
            {shout.user.username !== loggedUsername && users[shout.user.username] ?
              <div>
                <Column fluid={true} clear={true} size="5" className="owner-contact-action">
                  <ListenersButton user={ users[shout.user.username] }/>
                </Column>
                <Column fluid={true} size="5" className="owner-contact-action">
                  <Icon name="message"/>
                  Message
                </Column>
                <Column fluid={true} size="5" className="owner-contact-action">
                  <ListenButton flux={ flux } username={ shout.user.username }/>
                </Column>
                <Separator />
              </div>
              : null
            }
            <ul className="owner-contact-details">
              <li>
                <Icon name="date"/>
                <span>Joined: 10/13/2015</span>
              </li>
              <li>
                <Icon name="phone"/>
                <span>+13-33252514</span>
              </li>
            </ul>
          </div>
        </Grid>
        :
        <Progress />
      }
    </section>
  );
}
