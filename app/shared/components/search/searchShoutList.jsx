import React from 'react';
import {Progress, Clear, Column, Grid} from '../helper';
import ViewportSensor from '../misc/ViewportSensor.jsx';
import ShoutPreview from "../shout/ShoutPreview.jsx";

export default React.createClass({
  displayName: "SearchShoutList",

  contextTypes: {
    flux: React.PropTypes.object
  },

  componentDidMount() {
    let term = this.props.term,
      category = this.props.category,
      shouttype = this.props.shouttype,
      tags = this.props.tags,
      min = this.props.min,
      max = this.props.max,
      shouts = this.props.search.shouts[term],
      city = this.props.city || undefined,
      country = this.props.country || undefined;

    if (!shouts) {
      let payload = {
        term, category, shouttype, tags, min, max, city, country
      }
      this.context.flux.actions.searchShouts(payload);
    }
  },

  renderShouts(shouts) {
    return shouts.length ? shouts.map(function (shout, i) {
      return (
        <ShoutPreview
          listType="small"
          key={"shout-" + i}
          shout={shout}
          index={i}
        />
      );
    }) : <h4>No shouts found to display!</h4>;
  },

  render() {
    let term = this.props.term,
      shouts = this.props.search.shouts,
      content;

    if (shouts) {
      content = this.renderShouts(shouts);
    } else {
      content = <Progress/>;
    }

    return (
      <div>
        {content}
        {this.renderViewportSensor()}
      </div>
    );
  },

  renderViewportSensor() {
    let loading = this.props.search.searching.shouts;

    if(loading) {
      return (
        <Grid fluid={true}>
          <Progress />
        </Grid>);
    } else {
      return (
        <Grid fluid={true}>
          <ViewportSensor onChange={this.onLastVisibleChange}></ViewportSensor>
        </Grid>);
    }
  },

  onLastVisibleChange(isVisible) {
    if (isVisible) {
      this.context.flux.actions.searchLoadMore();
    }
  }
});
