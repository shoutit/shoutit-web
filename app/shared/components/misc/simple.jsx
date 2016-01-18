import React from "react";
import DocumentTitle from "react-document-title";
import Progress from "../helper/Progress.jsx";

export default React.createClass({
  displayName: "Simple",

  title: "Not implemented yet - Shoutit",

  render() {
    return (
      <DocumentTitle title={this.title}>
          <div>
              <Progress/>
          </div>
      </DocumentTitle>
    );
  }
});
