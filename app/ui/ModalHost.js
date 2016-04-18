import React, { PropTypes } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { connect } from 'react-redux';
import { closeModal } from '../actions/ui';

if (process.env.BROWSER) {
  require('./ModalHost.scss');
}

export function ModalHost({ modals = [], closeModal }) {
  return (
    <ReactCSSTransitionGroup transitionName="modal" transitionEnterTimeout={250} transitionLeaveTimeout={150}>
      { modals.map((modal, i) => {
        const close = () => closeModal(modal);
        return (
          <div
            key={i}
            onClick={ modal.props.rootClose ? close : null }
            className="ModalHost-wrapper"
          >
            { React.cloneElement(modal, { close }) }
          </div>
          );
      })
      }
      </ReactCSSTransitionGroup>
  );
}

ModalHost.propTypes = {
  modals: PropTypes.array,
  closeModal: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  modals: state.modals,
});

const mapDispatchToProps = dispatch => ({
  closeModal: modal => dispatch(closeModal(modal)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ModalHost);
