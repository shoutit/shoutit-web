import React from 'react';
import { Link } from "react-router";
import { Grid, Column } from "../helper";

export default function Explore({ categories = [] }) {
  const selectedCategories = categories.slice(0, 6);
  return (
    <Grid>
      <Column offset="3" size="9">
        <h2>Explore Shouts</h2>
        { selectedCategories.map(function (cat, i) {
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
        }) }
      </Column>
    </Grid>
  );
}
