import React from 'react';
import { Link } from "react-router";
import { Grid, Column, Progress } from "../helper";

export default React.createClass({
  displayName: 'explore',

  getInitialState() {
    return {
      cats: []
    };
  },

  componentDidMount() {
    this.loadCategories();
  },

  loadCategories() {
    let cats = this.props.categories;

    if (cats.length) {
      // pick 6 unique random category
      let codes = [], i = 0;
      let step = Math.round(cats.length / 6);
      while (i < cats.length - 1) {
        let min = i;
        let max = i + step;
        if (i + step < cats.length - 1) {
          i = i + step;
        } else {
          i = cats.length - 1;
        }
        codes.push(Math.floor(Math.random() * (max - min - 1) + min));
      }

      let picked = [];
      for (let i = 0; i < 6; i++) {
        picked.push(cats[codes[i]]);
      }
      this.setState({cats: picked});
    }
  },

  renderExplore() {
    const { cats } = this.state;

    if (cats.length) {
      return (
        cats.map(function (item, idx) {
          // clear every three item

          return (
            <Column size="3" clear={ idx % 3 === 0 } key={`main-explore-${idx}`}>
              <div className="si-item-box">
                <Link to={`/tag/${item.slug}`}>
                  <div className="img" style={{backgroundImage:`url(${item.main_tag.image})`}}></div>
                </Link>
                <Link className="subtitle" to={`/tag/${item.slug}`}>{item.name}</Link>
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
