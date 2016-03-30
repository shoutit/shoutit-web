import React, { PropTypes } from 'react';

if (process.env.BROWSER) {
  require('./Modal.scss');
}

export default class Modal extends React.Component {

  static propTypes = {
    rootClose: PropTypes.bool,
  };

  static defaultProps = {
    rootClose: true,
  };

  componentDidMount() {
    // this.refs.modal.focus();
  }

  render() {
    const { rootClose, children, title } = this.props;

    return (
      <div
        ref="modal"
        className="Modal"
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
