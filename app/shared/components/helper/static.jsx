import React from 'react';
import {State} from 'react-router';
import StaticFrame from './static/iFrame.jsx';
import DocumentTitle from 'react-document-title';

export default React.createClass({
  displayName: "Static",
  mixins: [State],

  render(){
    let name = this.getPathname()
      .replace('\/', '');

    return (
      <DocumentTitle title={name.charAt(0).toUpperCase() + name.slice(1) + " - Shoutit"}>
        <StaticFrame staticName={name}/>
      </DocumentTitle>
    );
  }
});
