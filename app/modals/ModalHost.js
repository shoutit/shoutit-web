import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { closeModal } from '../actions/ui';
import { getModal, isAlreadyVisible } from '../reducers/modals';
import { getDevice } from '../reducers/browser';

export class ModalHost extends Component {

  static propTypes = {
    modal: PropTypes.element,
    isAlreadyVisible: PropTypes.bool,
    device: PropTypes.oneOf(['smartphone', 'tablet', 'desktop']),
    onHide: PropTypes.func.isRequired,
  };

  render() {
    return (
      <div className="ModalHost">
        { this.props.modal &&
          React.cloneElement(this.props.modal, {
            onHide: this.props.onHide,
            autoSize: this.props.device === 'desktop',
            enterAnimation: !this.props.isAlreadyVisible,
          })
        }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  modal: getModal(state),
  device: getDevice(state),
  isAlreadyVisible: isAlreadyVisible(state),
});

const mapDispatchToProps = dispatch => ({
  onHide: () => dispatch(closeModal()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ModalHost);
