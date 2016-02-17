import React from 'react';
import { Link } from "react-router";
import {Icon, Column, Grid, Progress} from '../helper';
import TagListenButton from '../general/tagListenButton.jsx';

export default function TagsCard(props){
  const {loading, tags, flux} = props;

  return (
    <section className="si-card">
      <div className="card-header">
        <h3>suggested tags</h3>
      </div>
      {loading ?
        <Progress />
        :
        tags.map((tag, idx) => {
          return (
            <Grid fluid={true} key={`card-tag-${idx}`}>
              <Column fluid={true} clear={true} size="3" className="card-list-img">
                <Icon name="tag" className="tag-card-icon"/>
              </Column>
              <Column fluid={true} size="9" className="card-list-item">
                <Link to={`/tag/${tag.name}`}>{ tag.name }</Link>
              </Column>
              <Column fluid={true} size="3">
                <TagListenButton
                  hasTitle={ false }
                  tag={ tag }
                  onChange={ props.onListeningChange }
                  flux={ flux }
                />
              </Column>
            </Grid>
          );
        })
      }
    </section>
  );
}
