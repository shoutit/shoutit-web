import React from "react";
import {Link} from "react-router";
import {Icon, Grid, Column, Progress} from "../helper";
import ReplyShoutForm from "../shout/ReplyShoutForm.jsx";

if (process.env.BROWSER) {
  require("styles/components/ContactOwnerCard.scss");
}

export default function ContactOwnerCard({ shout }) {

  return (
    <section className="ContactOwnerCard">
      <div className="ContactOwnerCard-header">
        <h3 className="ContactOwnerCard-headerText">contact owner</h3>
      </div>
      <Grid fluid>
        <ReplyShoutForm shout={ shout } placeholder="Send..."/>
      </Grid>
    </section>
  );
}
