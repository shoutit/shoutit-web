import React from 'react';
import {Link} from 'react-router';
import {Column, Grid} from '../helper';
import {Icon} from '../helper';

export default function SuggestShoutCard(props) {
  // mock data
  let image = "http://goo.gl/aW2kUD",
      user = "John Do",
      title = "Tesla Model S - Top Deal",
      price = "$150000";

  return (
      <section className="si-card suggest-shout-card">
          <div className="card-header">
              <h3>suggested shout</h3>
          </div>
          <Grid fluid={true}>
              <Link to="">
                  <div style={{backgroundImage:`url(${image})`}} className="suggest-image"></div>
              </Link>
          </Grid>
          <Grid fluid={true}>
              <Grid fluid={true} className="suggest-title">
                  {title}
              </Grid>
              <Column fluid={true} clear={true} size="11" className="suggest-user">
                  {user}
              </Column>
              <Column fluid={true} size="4" className="suggest-price">
                  {price}
              </Column>
          </Grid>
      </section>
  );
};
