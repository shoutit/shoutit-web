import React from 'react';
import {State} from 'react-router';
import StaticFrame from './static/iFrame.jsx';
import DocumentTitle from "../../../ui/DocumentTitle";

export default React.createClass({
  displayName: "Static",
  mixins: [State],

  render(){
    let name = this.getPathname()
      .replace('\/', '');

    return (
      <DocumentTitle title={name.charAt(0).toUpperCase() + name.slice(1) + ""}>
        <StaticFrame staticName={name}/>
      </DocumentTitle>
    );
  }
});
