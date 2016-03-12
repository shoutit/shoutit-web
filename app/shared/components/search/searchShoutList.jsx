import React from 'react';
import {Progress, Clear, Column, Grid} from '../helper';
import ViewportSensor from '../misc/ViewportSensor.jsx';
import ShoutPreview from "../shout/ShoutPreview.jsx";

export default React.createClass({
  displayName: "SearchShoutList",

  contextTypes: {
    flux: React.PropTypes.object
  },

  renderShouts(shouts) {
    const { currentLocation } = this.props;

    if (!shouts.length) {
      return <h4>No shouts found to display!</h4>;
    }
    return shouts.map((shout, i) =>
      <ShoutPreview
        key={ "shout-" + i }
        shout={ shout }
        index={ i }
        currentLocation={ currentLocation }
      />
    );
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
