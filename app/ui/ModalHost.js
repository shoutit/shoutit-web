import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { connect } from 'react-redux';
import { closeModal } from '../actions/ui';

if (process.env.BROWSER) {
  require('./ModalHost.scss');
}

export function ModalHost({ modals = [], dispatch }) {
  return (
    <ReactCSSTransitionGroup transitionName="modal" transitionEnterTimeout={250} transitionLeaveTimeout={150}>
      { modals.map((modal, i) => {
        const close = () => dispatch(closeModal(modal));
        return (
          <div
            key={i}
            onClick={ modal.props.rootClose ? close : () => {} }
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

const mapStateToProps = state => ({
  modals: state.modals,
});

export default connect(mapStateToProps)(ModalHost);
