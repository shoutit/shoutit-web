import React, { PropTypes } from 'react';

if (process.env.BROWSER) {
  require('./Modal.scss');
}

export default class Modal extends React.Component {

  static propTypes = {
    rootClose: PropTypes.bool,
    children: PropTypes.node,
    title: PropTypes.string,
    size: PropTypes.oneOf(['small', 'medium', 'large']),
  };

  static defaultProps = {
    rootClose: true,
    size: 'medium',
  };

  componentDidMount() {
    document.body.style.overflow = 'hidden';
  }

  componentWillUnmount() {
    document.body.style.overflow = null;
  }

  render() {
    const { rootClose, children, title, size } = this.props;

    return (
      <div
        ref="modal"
        className={`Modal size-${size}`}
        onClick={ rootClose ? e => e.stopPropagation() : () => {} } // Prevent closing modal when clicking on it
      >
        { title && <h1 className="Modal-title">{ title }</h1> }
        <div className="Modal-body">
          { children }
        </div>
      </div>
    );
  }
}
