import React from 'react';
import {Link} from 'react-router';
import {Column, Grid, Progress} from '../helper';

export default function SuggestShoutCard(props) {

  return (
    <section className="si-card suggest-shout-card">
      <div className="card-header">
          <h3>suggested shout</h3>
      </div>
      { props.loading?
        <Progress />
      : props.shout &&
        <Grid fluid={true}>
          <Link to={`/shout/${props.shout.id}`}>
            <div style={{backgroundImage:`url(${props.shout.thumbnail})`}} className="suggest-image" ></div>
          </Link>
          <Grid fluid={true}>
              <Grid fluid={true} className="suggest-title">
                <Link to={`/shout/${props.shout.id}`}>
                  { props.shout.title }
                </Link>
              </Grid>
              <Column fluid={true} clear={true} size="11" className="suggest-user">
                  { props.shout.user.name }
              </Column>
              <Column fluid={true} size="4" className="suggest-price">
                  { props.shout.currency + " " + props.shout.price }
              </Column>
          </Grid>
        </Grid>
      }
    </section>
  );
};
