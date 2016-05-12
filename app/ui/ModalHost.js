import React, { PropTypes, Component } from 'react';
import Modal from 'react-bootstrap/lib/Modal';
import { connect } from 'react-redux';
import { closeModal } from '../actions/ui';

export class ModalHost extends Component {

  static propTypes = {
    body: PropTypes.node,
    dispatch: PropTypes.func.isRequired,
    closeButton: PropTypes.bool,
    title: PropTypes.string,
    show: PropTypes.bool,
    footer: PropTypes.node,
  };

  constructor(props) {
    super(props);
    this.state = props;
  }
  //
  componentWillReceiveProps(nextProps) {
    if (nextProps.show && this.state.show) {
      // Close the previos modal before showing the next one
      this.setState({
        show: false,
        onExited: () =>
          setTimeout(() => this.setState({ ...nextProps, onExited: null }), 100),
      });
    } else {
      this.setState(nextProps);
    }
  }

  render() {
    const { body, dispatch, show, title, footer, closeButton, scrollableBody, ...modalProps } = this.state;
    let bodyClassName = 'modal';
    if (scrollableBody) {
      bodyClassName = 'modal-body scrollable';
    }
    return (
      <div className="ModalHost">
        <Modal {...modalProps} show={ show } onHide={ () => dispatch(closeModal()) }>
          { (closeButton || title) &&
            <Modal.Header closeButton={ closeButton } aria-label="Close">{ title }</Modal.Header>
          }
          <Modal.Body bsClass={ bodyClassName }>
            { body }
          </Modal.Body>
          { footer &&
            <Modal.Footer>{ footer }</Modal.Footer>
          }
        </Modal>
      </div>
    );
  }
}

export default connect(state => state.modals)(ModalHost);
