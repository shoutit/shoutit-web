import React from "react";
import { Link } from "react-router";
import {Icon, Grid, Column, Progress} from "../helper";
import TagListenButton from "../general/tagListenButton.jsx";

export default function RelatedTags(props) {
  const { flux, countryCode = "" } = props;
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
                  <Link to={`/interest/${item.name}/${countryCode}`}>{ item.name }</Link>
                </Column>
                <Column fluid={true} size="3">
                  <TagListenButton
                    flux={ flux }
                    onListenTag={ flux.actions.listenTag }
                    onStopListenTag={ flux.actions.stopListenTag }
                    tag={ item }
                    hasTitle={ false }
                  />
                </Column>
              </Grid>
            );
          })
      }
    </section>
  );
}
