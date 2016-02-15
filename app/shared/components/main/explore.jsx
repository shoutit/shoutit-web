import React from 'react';

export default React.createClass({
  displayName: 'explore',

  pickCategories() {
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
      return picked;
    } else {
      return [];
    }
  },

  renderExplore() {
    let picked = this.pickCategories();

    if (picked.length) {
      return (
        picked.map(function (item, idx) {
          // clear every three item
          let className = idx % 3 === 0 ? 'clear grid-3' : 'grid-3';
          return (
            <div key={idx} className={className}>
              <div className="si-item-box">
                <div className="img" style={{backgroundImage:`url(${item.main_tag.image})`}}></div>
                <h3>{item.name}</h3>
              </div>
            </div>
          );
        })
      );
    } else {
      <div>Loading</div>
    }
  },


  render() {

    return (
      <div className="grid-9 offset-3">
        <h2>Explore Shouts</h2>
        {this.renderExplore()}
      </div>
    );
  }
});
