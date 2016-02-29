import React from "react";
import SVGIcon from "../helper/SVGIcon";

if (process.env.BROWSER) {
  require("styles/components/Notification.scss");
}

export default class Notification extends React.Component {

  state = {
    style: {
      opacity: 0,
      visibility: "hidden"
    }
  }

  componentDidMount() {
    const style = {
      visibility: "visible",
      overflow: "hidden",
      opacity: 1,
      height: this.refs.content.offsetHeight
    };
    this.setState({ style });
  }

  render() {
    const { notification, onDismissClick } = this.props;
    const { style } = this.state;

    return (
      <div className="Notification-wrapper" style={ style }>
        <div ref="content" className="Notification">
          { notification.message }
          <span className="Notification-closeButton">
            <SVGIcon size="small" name="close" onClick={ () => onDismissClick(notification.id) } />
          </span>
        </div>
      </div>
    );
  }
}
