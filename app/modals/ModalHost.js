import React, { PropTypes, PureComponent } from 'react';
import { connect } from 'react-redux';
import { closeModal } from '../actions/ui';
import { getModal, isAlreadyVisible } from '../reducers/modals';

export class ModalHost extends PureComponent {

  static propTypes = {
    modal: PropTypes.element,
    isAlreadyVisible: PropTypes.bool,
    onHide: PropTypes.func.isRequired,
  };

  render() {
    return (
      <div className="ModalHost">
        { this.props.modal &&
          React.cloneElement(this.props.modal, {
            onHide: this.props.onHide,
            enterAnimation: !this.props.isAlreadyVisible,
          })
        }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  modal: getModal(state),
  isAlreadyVisible: isAlreadyVisible(state),
});

const mapDispatchToProps = dispatch => ({
  onHide: () => dispatch(closeModal()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ModalHost);
