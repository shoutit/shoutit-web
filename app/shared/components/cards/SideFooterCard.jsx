import React from "react";
import { Icon, Column, Grid } from "../helper";
import { ANDROID_LINK, IOS_LINK, FACEBOOK, TWITTER, INSTAGRAM } from "../../consts/defaults";

export default function SideFooterCard() {
  return (
    <Grid fluid>
      <Grid fluid>
        <a className="SideFooterLink" href={ FACEBOOK } target="_blank">Facebook</a>
        <a className="SideFooterLink" href={ INSTAGRAM } target="_blank">Instagram</a>
        <a className="SideFooterLink" href={ TWITTER } target="_blank">Twitter</a>
      </Grid>
      <Grid fluid>
        <a href={ ANDROID_LINK } target="_blank">
          <Icon name="app-store-small"/>
        </a>
        <a href={ IOS_LINK } target="_blank">
          <Icon name="google-play-small"/>
        </a>
      </Grid>
    </Grid>
  );
};
