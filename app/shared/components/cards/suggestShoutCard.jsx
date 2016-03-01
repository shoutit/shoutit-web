import React from "react";
import {Link} from "react-router";
import {Column, Grid, Progress} from "../helper";
import currencyFormatter from "currency-formatter";

export default function SuggestShoutCard({ loading, shout }) {
  return (
    <section className="si-card suggest-shout-card">
      <div className="card-header">
          <h3>suggested shout</h3>
      </div>
      { loading?
        <Progress />
      : shout &&
        <Grid fluid={true}>
          <Link to={`/shout/${shout.id}`}>
            <div style={{backgroundImage:`url(${shout.thumbnail})`}} className="suggest-image" ></div>
          </Link>
          <Grid fluid={true}>
              <Grid fluid={true} className="suggest-title">
                <Link to={`/shout/${shout.id}`}>
                  { shout.title }
                </Link>
              </Grid>
              <Column fluid={true} clear={true} size="11" className="suggest-user">
                  { shout.user.name }
              </Column>
              <Column fluid={true} size="4" className="suggest-price">
                  { currencyFormatter.format(shout.price/100, { code: shout.currency } )}
              </Column>
          </Grid>
        </Grid>
      }
    </section>
  );
}
