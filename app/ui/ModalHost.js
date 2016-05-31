import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { closeModal } from '../actions/ui';

export class ModalHost extends Component {

  static propTypes = {
    modal: PropTypes.element,
    onHide: PropTypes.func.isRequired,
  };

  render() {
    return (
      <div className="ModalHost">
        { this.props.modal &&
          React.cloneElement(this.props.modal, {
            onHide: this.props.onHide,
          })
        }
      </div>
    );
  }
}

const mapStateToProps = state => state.modals;
const mapDispatchToProps = dispatch => ({ onHide: () => dispatch(closeModal()) });

export default connect(mapStateToProps, mapDispatchToProps)(ModalHost);
