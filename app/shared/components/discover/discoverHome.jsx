import React from 'react';
import {Grid, Column} from '../helper';

export default React.createClass({
  displayName: "DiscoverHome",

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
    }
  },

  render() {
    const {flux, params} = this.props;
    return (
      <div className="discover-holder">
        <Grid >
          <Column size="12" clear={true}>
            { React.cloneElement(this.props.children, {flux, params}) }
          </Column>
          <Column size="3">

          </Column>
        </Grid>
      </div>
    );
  }
});
