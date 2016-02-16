import React from "react";
import UserAvatar from "../../../user/UserAvatar.jsx";

export default React.createClass({
  displayName: "ShoutHeader",

  render() {

    // let isSmall = (this.props.listType === "small");
    // let subimage = !isSmall ?
    //  (<p className="show-day">{this.props.agoText}</p>) : null;

    return (
      <div className="shout-header">
        <UserAvatar user={ this.props.creator } linkToUserPage />
        <h3 className="user">{this.props.creator.name}</h3>
        <span className="time">{this.props.agoText}</span>

      </div>
    );
  }
});
