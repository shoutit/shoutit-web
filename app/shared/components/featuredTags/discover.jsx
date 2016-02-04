import React from 'react';
import {Grid} from 'react-bootstrap';
import FeaturedTagsContainer from './featuredTagsContainer.jsx';

export default React.createClass({
  display: "Discover",

  render() {
    return (
      <Grid>
        <FeaturedTagsContainer {...this.props}/>
      </Grid>
    );
  }
});
