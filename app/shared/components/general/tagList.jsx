import React from 'react';
import Tag from './tag.jsx';

export default React.createClass({
  displayName: "TagList",

  getDefaultProps() {
    return {
      tags: []
    };
  },

  render() {
    let children = this.props.tags.map(function (tag) {
      return <Tag key={"tag-" + tag.id} tag={tag}/>;
    });

    return (
      <div className="si-tag-list">
        {children}
      </div>
    );
  }
});
