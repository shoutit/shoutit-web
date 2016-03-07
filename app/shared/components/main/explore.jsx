import React from 'react';
import { Link } from "react-router";
import { Grid, Column, Progress } from "../helper";

export default React.createClass({
  displayName: 'explore',

  renderExplore() {
    const { categories } = this.props;

    if (categories.length) {
      // pick 6 unique random category
      const selectedCategories = categories.slice(0, 6);

      return (
        selectedCategories.map(function (cat, i) {
          // clear every three item
          if (!cat) { return null;}
          return (
            <Column size="3" clear={ i % 3 === 0 } key={`main-explore-${i}`}>
              <div className="si-item-box">
                <Link to={`/tag/${cat.slug}`}>
                  <div className="img" style={{backgroundImage:`url(${cat.image})`}}></div>
                </Link>
                <Link className="subtitle" to={`/tag/${cat.slug}`}>{cat.name}</Link>
              </div>
            </Column>
          );
        })
      );
    } else {
      return  <Progress /> ;
    }
  },

  render() {

    return (
      <Grid>
        <Column offset="3" size="9">
          <h2>Explore Shouts</h2>
          {this.renderExplore()}
        </Column>
      </Grid>
    );
  }
});
