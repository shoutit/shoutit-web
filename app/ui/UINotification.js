import React from 'react';
import SVGIcon from '../shared/components/helper/SVGIcon';

if (process.env.BROWSER) {
  require('./UINotification.scss');
}

export default class UINotification extends React.Component {

  static propTypes = {
    dismissUINotification: React.PropTypes.func,
    icon: React.PropTypes.element,
    showDismissButton: React.PropTypes.bool,
    buttons: React.PropTypes.array,
    type: React.PropTypes.oneOf(['message']),
  };

  static defaultProps = {
    showDismissButton: true,
    buttons: [],
    type: 'message',
  };

  state = {
    style: {
      opacity: 0,
      visibility: 'hidden',
    },
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
      visibility: 'visible',
      overflow: 'hidden',
      opacity: 1,
      height: this.refs.body.offsetHeight,
    };
    return style;
  }

  render() {
    const { icon, children, dismissUINotification, showDismissButton, buttons, type } = this.props;
    const { style } = this.state;
    const className = `UINotification type-${type}`;

    return (
      <div className={ className } style={ style } ref="wrapper">
        <div ref="body">
          <div className="UINotification-content">
            { icon }

            <span className="UINotification-message">
              { children }
            </span>

            { showDismissButton &&
              <span className="UINotification-dismiss">
                <SVGIcon size="small" name="close" onClick={ () => dismissUINotification() } />
              </span>
            }

          </div>
          { buttons.length > 0 && <div className="UINotification-buttons">
            { buttons }
          </div>
          }
        </div>
      </div>
    );
  }
}
