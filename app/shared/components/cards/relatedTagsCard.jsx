import React from "react";
import { Link } from "react-router";
import {Icon, Grid, Column, Progress} from "../helper";
import TagListenButton from "../general/tagListenButton.jsx";

export default function RelatedTags(props) {
  const { onListeningChange } = props;
  return (
    <section className="si-card">
      <div className="card-header">
        <h3>related tags</h3>
      </div>
      { props.loading?
          <Progress />
        :
          props.tags.map((item, idx) => {
            return (
              <Grid fluid={true} key={`related-tags-card-${idx}`}>
                <Column fluid={true} clear={true} size="3" className="card-list-img">
                  <Icon name="tag" className="tag-card-icon"/>
                </Column>
                <Column fluid={true} size="9" className="card-list-item">
                  <Link to={`/tag/${item.name}`}>{ item.name }</Link>
                </Column>
                <Column fluid={true} size="3">
                  <TagListenButton
                    flux={ props.flux }
                    tag={ item }
                    hasTitle={ false }
                    onChange={ onListeningChange }
                  />
                </Column>
              </Grid>
            );
          })
      }
    </section>
  );
}
