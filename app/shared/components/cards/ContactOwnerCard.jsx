import React from "react";
import {Link} from "react-router";
import {Icon, Grid, Column, Progress} from "../helper";
import SVGIcon from "../helper/SVGIcon";
import ReplyShoutForm from "../shout/ReplyShoutForm.jsx";
import Button from "../helper/Button.jsx";

if (process.env.BROWSER) {
  require("styles/components/ContactOwnerCard.scss");
}

export default function ContactOwnerCard({ shout, getMobileNumber}) {
  const { is_mobile_set, mobile_hint } = shout;

  return (
    <div>
      <section className="ContactOwnerCard">
        <div className="ContactOwnerCard-header">
          <h3 className="ContactOwnerCard-headerText">contact owner</h3>
        </div>
        <Grid fluid>
          {is_mobile_set?
            shout.mobile_number ?
             <span className="ContactOwnerCard-mobileNumber">
               { shout.mobile_number }
             </span>
            :
              <Button
                size="small"
                primary={ Boolean(shout.mobile_number) }
                secondary
                className="ContactOwnerCard-mobileButton"
                onClick={ () => { getMobileNumber(shout.id); } }
                label={ `${ mobile_hint } Show` }
                leftIcon={ <SVGIcon name="mobile" fill /> }
              />
          : null}
        </Grid>
        <ReplyShoutForm shout={ shout } placeholder="Send..."/>
      </section>
    </div>
  );
}
