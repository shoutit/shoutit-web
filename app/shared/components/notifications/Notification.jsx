import React from "react";
import SVGIcon from "../helper/SVGIcon";

if (process.env.BROWSER) {
  require("styles/components/Notification.scss");
}

export default class Notification extends React.Component {

  static propTypes = {
    dismissNotification: React.PropTypes.func,
    notificationId: React.PropTypes.number,
    icon: React.PropTypes.element,
    dismissable: React.PropTypes.bool,
    message: React.PropTypes.oneOfType([React.PropTypes.element, React.PropTypes.string]),
    buttons: React.PropTypes.array
  };

  static defaultProps = {
    dismissable: true,
    buttons: []
  };

  state = {
    style: {
      opacity: 0,
      visibility: "hidden"
    }
  };

  componentDidMount() {
    this.setState({ style: this.getStyle() });
  }

  getStyle() {
    const style = {
      visibility: "visible",
      overflow: "hidden",
      opacity: 1,
      height: this.refs.content.offsetHeight
    };
    return style;
  }

  render() {
    const { notificationId, icon, message, children, dismissNotification, dismissable, buttons } = this.props;

    const { style } = this.state;
    return (
      <div className="Notification-wrapper" style={ style }>
        <div ref="content" className="Notification">
          <div className="Notification-content">
            { icon }

            <span className="Notification-message">
              { message ? message : React.cloneElement(children, { notificationId, dismissNotification }) }
            </span>

            { dismissable &&
              <span className="Notification-dismiss">
                <SVGIcon size="small" name="close" onClick={ () => dismissNotification() } />
              </span>
            }

          </div>
          { buttons.length > 0 && <div className="Notification-buttons">
            { buttons }
          </div>
          }
        </div>
      </div>
    );
  }
}
