import React from 'react';
import {Icon, Grid, Column} from '../helper';
import {Link} from 'react-router';
import {Link as ScrollLink} from 'react-scroll';
import {ANDROID_LINK, IOS_LINK, FACEBOOK, TWITTER, INSTAGRAM} from '../../consts/defaults';

export default (props) => {
  return (
    <Grid className="mainpage-footer">
      <Column clear={true} size="4" className="logo-section">
        <Icon name="footer_logo"/>
        <span className="copyright">Copyright © 2016 Shoutit All rights reserved.</span>
      </Column>

      <Column size="2" className="links-section">
        {/*
         <h3>Explore</h3>
         <Link to="policy">Shouts</Link>
         <Link to="policy">Tags</Link>
         <Link to="policy">Users</Link>
         */}
      </Column>
      <Column size="2" className="links-section">
        {/*
         <h3>About</h3>
         <Link to="policy">The Company</Link>
         <Link to="policy">History</Link>
         <Link to="policy">Vision</Link>
         */}
      </Column>

      <Column size="2" className="links-section">
        <h3>Follow Us</h3>
        <a href={FACEBOOK} target="_blank">Facebook</a>
        <a href={INSTAGRAM} target="_blank">Instagram</a>
        <a href={TWITTER} target="_blank">Twitter</a>
      </Column>
      <Column size="2" className="links-section grid-2">
        {/*
         <h3>Contact</h3>
         <Link to="policy">Basic Info</Link>
         <Link to="policy">Map</Link>
         <Link to="policy">Contact Form</Link>
         <ScrollLink className="btn-explore"  spy={true} to="nav" smooth={true} offset={-100} duration={500}>
          Go to top
         </ScrollLink>
         */}
      </Column>
      <Column size="3" className="links-section">
        <h3 style={{textAlign: "center"}}>Get Shoutit Apps</h3>
        <a href={ANDROID_LINK} target="_blank">
          <Icon name="app-store-small"/>
        </a>
        <a href={IOS_LINK} target="_blank">
          <Icon name="google-play-small"/>
        </a>
      </Column>
    </Grid>
  );
};
