import React from "react";
import SVGIcon from "../helper/SVGIcon";

if (process.env.BROWSER) {
  require("styles/components/Notification.scss");
}

export default class Notification extends React.Component {

  static propTypes = {
    dismissNotification: React.PropTypes.func,
    icon: React.PropTypes.element,
    showDismissButton: React.PropTypes.bool,
    buttons: React.PropTypes.array
  };

  static defaultProps = {
    showDismissButton: true,
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

  componentDidUpdate(prevProps) {
    if (prevProps.children !== this.props.children || prevProps.message !== this.props.message) {
      const style = this.getStyle();
      this.refs.wrapper.scrollTop = 0;
      this.setState({ style });
    }

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
    const { icon, children, dismissNotification, showDismissButton, buttons } = this.props;
    const { style } = this.state;
    return (
      <div className="Notification-wrapper" style={ style } ref="wrapper">
        <div ref="content" className="Notification">
          <div className="Notification-content">
            { icon }

            <span className="Notification-message">
              { children }
            </span>

            { showDismissButton &&
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
