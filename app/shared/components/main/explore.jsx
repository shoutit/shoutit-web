import React from 'react';
import { Link } from "react-router";
import { Grid, Column } from "../helper";
import { getVariation } from "../../../utils/APIUtils";

export default function Explore({ categories = [] }) {
  const selectedCategories = categories.slice(0, 6);
  const { countryCode } = this.props;
  return (
    <Grid>
      <Column offset="3" size="9">
        <h2>Explore Shouts</h2>
        { selectedCategories.map(function (cat, i) {
          return (
            <Column size="3" clear={ i % 3 === 0 } key={`main-explore-${i}`}>
              <div className="si-item-box">
                { cat.image && <Link to={`/interest/${ cat.slug }/${ countryCode }`}>
                  <div className="img" style={{backgroundImage:`url(${getVariation(cat.image, "small")})`}}></div>
                </Link>
                }
                <Link className="subtitle" to={`/interest/${cat.slug}`}>{cat.name}</Link>
              </div>
            </Column>
          );
        }) }
      </Column>
    </Grid>
  );
}
