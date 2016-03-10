import React from "react";
import {Link} from "react-router";
import {History} from "react-router";
import {Image, Column} from "../helper";
import {ItemProp} from "../helper/microdata";
import currency from "../../consts/currencies";
export default React.createClass({
  displayName: "GridDicsover",
  mixins: [History],

  getDefaultProps() {
    return {
      className: "",
      index: 1,
      clearOn: 4
    };
  },

  renderThumbnail(thumbnail) {
    thumbnail = thumbnail;
    return thumbnail ?
            <div className="img"
                 style={{backgroundImage:`url(${thumbnail.replace(/\.jpg$/i, "_medium.jpg")})`}}></div>
            : <div className="img"></div>;
  },

  onItemClick() {
    const {discover, country} = this.props;
    this.history.pushState(null, `/discover/${country}/${discover.id}`);
  },

  render() {
    const {discover, country} = this.props;
    const className = this.props.className || "";

    return (
            <Column size="3" clear={this.props.index % this.props.clearOn === 0}>
                <div onClick={this.onItemClick} className={className + " si-shout-grid"}>
                    {this.renderThumbnail(discover.image)}
                    <ItemProp property="name">
                        <h3><Link to={`/discover/${country}/${discover.id}`} >{discover.title}</Link></h3>
                    </ItemProp>
                </div>
            </Column>
        );
  }
});
