import React from "react";
import { Icon, Column, Grid } from "../helper";
import { ANDROID_LINK, IOS_LINK, FACEBOOK, TWITTER, INSTAGRAM } from "../../consts/defaults";

import { imagesPath } from "../../../../config";

if (process.env.BROWSER) {
  require("styles/components/SideFooter.scss");
}

export default function SideFooterCard() {
  return (
    <Grid fluid className="SideFooter">
      <Grid fluid>
        <p className="SideFooter-copyright">© 2016 Shoutit</p>
        <a className="SideFooter-link" href={ FACEBOOK } target="_blank">Facebook</a>
        <a className="SideFooter-link" href={ INSTAGRAM } target="_blank">Instagram</a>
        <a className="SideFooter-link" href={ TWITTER } target="_blank">Twitter</a>
      </Grid>
      <Grid fluid className="SideFooterButtons">
        <a href={ ANDROID_LINK } target="_blank">
          <img className="SideFooterButtons-button right-spacing" src={`${imagesPath}/app_store.png`} />
        </a>
        <a href={ IOS_LINK } target="_blank">
          <img className="SideFooterButtons-button" src={`${imagesPath}/google_play.png`} />
        </a>
      </Grid>
    </Grid>
  );
};
