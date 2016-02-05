import React from "react";
import {Grid, Column} from "../helper";

export default React.createClass({
  displayName: "Home",

  childContextTypes: {
    flux: React.PropTypes.object,
    params: React.PropTypes.object,
    location: React.PropTypes.object
  },

  getChildContext() {
    return {
      flux: this.props.flux,
      params: this.props.params,
      location: this.props.location
    };
  },

  render() {

    return (
      <Grid className="homepage-holder">
          <Column size="3" clear={true}>

          </Column>
          <Column size="9">
              {React.cloneElement(this.props.children, {flux: this.props.flux})}
          </Column>
          <Column size="3">

          </Column>
      </Grid>
    );
  }
});
