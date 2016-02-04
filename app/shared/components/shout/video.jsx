import React from 'react';

import {ItemProp} from '../helper/microdata';

export default React.createClass({
  displayName: "Video",

  render() {
    if (this.props.provider === "youtube") {
      return this.renderYTVideo();
    } else {
      return <h3 key={this.props.key}>UnknownProvider</h3>;
    }
  },

  renderYTVideo() {
    return (
      <ItemProp property="video">
        <iframe
          key={this.props.key} id="ytplayer" type="text/html" width="640" height="390"
          src={"https://www.youtube.com/embed/" + this.props.id_on_provider}
          frameBorder="0"/>
      </ItemProp>
    );
  }
});
