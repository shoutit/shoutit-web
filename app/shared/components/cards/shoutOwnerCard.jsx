import React from "react";
import {Link} from "react-router";
import {Icon, Grid, Column, Progress} from "../helper";
import Separator from "../general/separator.jsx";
import UserAvatar from "../user/UserAvatar.jsx";
import ListenButton from "../general/listenButton.jsx";
import ListenersButton from "../general/listenersButton.jsx";
import CountryFlag from "../helper/CountryFlag";
import SVGIcon from "../helper/SVGIcon";

import moment from "moment";

export default function shoutOwnerCard({ shout, flux, users, loggedUser }) {
  const { user, location } = shout;
  const loggedUsername = loggedUser? loggedUser.username: undefined;

  return (
    <section className="si-card shout-owner-card">
      { user ?
        <Grid fluid={true}>
          <Column fluid={true} clear={true} size="4" className="owner-info-left">
            <UserAvatar user={ user } size="large" linkToUserPage />
          </Column>
          <Column fluid={true} size="11" className="owner-info-right">
            <Link to={ `/user/${user.username}`}>{ user.name }</Link>
            <CountryFlag code={ location.country } />
            <span>{ location.city }</span>
          </Column>
          <div className="holder">
            <Separator />
            {user.username !== loggedUsername && users[user.username] ?
              <div>
                <Column fluid={true} clear={true} size="7" className="owner-contact-action">
                  <ListenersButton user={ users[user.username] }/>
                </Column>
                {/*<Column fluid={true} size="5" className="owner-contact-action">
                  <Icon name="message"/>
                  Message
                </Column>
                */}
                <Column fluid={true} size="7"  className="owner-contact-action">
                  <ListenButton flux={ flux } username={ user.username }/>
                </Column>
                <Separator />
              </div>
              : null
            }
            <ul className="owner-contact-details">
              {users[user.username] &&
                <li>
                  <SVGIcon name="clock" active />
                  <span>{ moment.unix(users[user.username].date_joined).fromNow() }</span>
                </li>
              }
              {/*
              <li>
                <Icon name="phone"/>
                <span>+13-33252514</span>
              </li>
              */}
            </ul>
          </div>
        </Grid>
        :
        <Progress />
      }
    </section>
  );
}
