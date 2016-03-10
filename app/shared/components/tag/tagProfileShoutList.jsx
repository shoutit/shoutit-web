import React from 'react';
import {Grid, Progress} from '../helper';
import ShoutPreview from "../shout/ShoutPreview.jsx";
import ViewportSensor from '../misc/ViewportSensor.jsx';

let map = {
  request: "Requests",
  offer: "Offers"
};

export default React.createClass({
  displayName: "TagProfileShoutList",

  componentDidMount() {
    let tagName = this.props.tagName;

    if (!this.props.tags[tagName] || !this.props.tags[tagName]['shouts']) {
      this.props.flux.actions.loadTagShouts(this.props.tagName, 'all');
    }
  },

  componentDidUpdate() {
    const {tagName, loading} = this.props;
    const tagEntry = this.props.tags[tagName];

    if (!tagEntry || !tagEntry.shouts && !loading ) {
      this.props.flux.actions.loadTagShouts(this.props.tagName, 'all');
    }
  },

  renderTagProfileShouts(shouts) {
    const { currentLocation } = this.props;

    return shouts.length ? shouts.map(function (shout, i) {
      return (
        <ShoutPreview
          key={"shout-" + i}
          shout={shout}
          index={i}
          currentLocation={ currentLocation }
        />
      );
    }) : <h4>No shouts found to show!</h4>;
  },

  render() {
    let tagName = this.props.tagName,
      tag = this.props.tags[tagName].tag,
      tags = this.props.tags[tagName]['shouts'],
      content, stat;

    if (tags) {
      content = this.renderTagProfileShouts(tags);
      stat = <span>{' (' + tags.length + ')'}</span>;
    } else {
      content = <Progress/>;
    }

    return (
      <div>
        <Grid fluid={true}>
          <h3 className="si-subtitle">{tag.name + " shouts"}</h3>
        </Grid>
        <Grid fluid={true}>
          {content}
          {this.renderViewportSensor()}
        </Grid>
      </div>
    );
  },

  renderViewportSensor() {
    if(!this.props.loading) {
      return (
        <Grid fluid={true}>
          <ViewportSensor onChange={this.onLastVisibleChange}></ViewportSensor>
        </Grid>);
    }
  },

  onLastVisibleChange(isVisible) {
    if (isVisible) {
      this.loadMore();
    }
  },

  loadMore() {
    this.props.flux.actions.loadMoreTagShouts(this.props.tagName, 'all');
  }
});
