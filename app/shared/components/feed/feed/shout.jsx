import React from "react";
import ShoutHeader from "./listShout/header.jsx";
import ShoutBody from "./listShout/body.jsx";
import ReplyShoutForm from "../../shout/ReplyShoutForm.jsx";
import GridShoutItem from "./gridShout/gridShoutItem.jsx";
import moment from "moment";
import {ItemScope} from "../../helper/microdata";

export default React.createClass({
  displayName: "Shout",

  contextTypes: {
    flux: React.PropTypes.object
  },

  getDefaultProps() {
    return {
      presentLayer: "list"
    };
  },

  agoText() {
    return moment.unix(this.props.shout.date_published).fromNow();
  },

  render() {
    let presentLayer = this.props.presentLayer,
      shout = this.props.shout,
      ago = this.agoText();

    return (
      <section>
        <ItemScope type="Product">
          <div className={presentLayer!=="list"? "hide si-shout": "si-shout"}>
            <ShoutHeader creator={shout.user}
                   listType={this.props.listType}
                   agoText={ago}
                   logoSrc={shout.user.image}
                   />
            <ShoutBody flux={this.context.flux}
                   listType={this.props.listType}
                   shout={shout}
                   />
            <ReplyShoutForm shout={shout} flux={this.context.flux} />
          </div>
        </ItemScope>
        <ItemScope type="Product">
          <GridShoutItem className={presentLayer!=="grid"? "hide": ""}
                   creator={shout.user}
                   index={this.props.index}
                   flux={this.context.flux}
                   shout={shout}
                   />
        </ItemScope>
      </section>
    );
  }
});
