import React from 'react';
import {Progress, Grid} from '../helper';
import Shout from '../feed/feed/shout.jsx';
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

  renderTagProfileShouts(shouts) {
    return shouts.length ? shouts.map(function (shout, i) {
      return <Shout listType="small" key={"shout-" + i} shout={shout} index={i}/>;
              //last={i === shouts.length - 1 ? onLastVisibleChange : null}/>;
    }) : <h4>No shouts.</h4>;
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
    if(this.props.loading) {
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
      this.loadMore();
    }
  },

  loadMore() {
    this.props.flux.actions.loadMoreTagShouts(this.props.tagName, 'all');
  }
});
