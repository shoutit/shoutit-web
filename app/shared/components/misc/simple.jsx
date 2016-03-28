import React from "react";
import Progress from "../helper/Progress.jsx";
import DocumentTitle from "../../../ui/DocumentTitle";

export default React.createClass({
  displayName: "Simple",

  title: "Not implemented yet",

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
