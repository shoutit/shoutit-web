import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { closeModal } from '../actions/ui';
import { getModal } from '../reducers/modals';
import { getDevice } from '../reducers/browser';

export class ModalHost extends Component {

  static propTypes = {
    modal: PropTypes.element,
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
          })
        }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  modal: getModal(state),
  device: getDevice(state),
});

const mapDispatchToProps = dispatch => ({
  onHide: () => dispatch(closeModal()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ModalHost);
