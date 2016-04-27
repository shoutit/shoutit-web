import React, { PropTypes, Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { connect } from 'react-redux';
import { closeModal } from '../actions/ui';
import { preventBodyScroll } from '../utils/DOMUtils';

if (process.env.BROWSER) {
  require('./ModalHost.scss');
}

export class ModalHost extends Component {

  static propTypes = {
    modals: PropTypes.array,
    closeModal: PropTypes.func.isRequired,
  };

  static defaultProps = {
    modals: [],
  };

  componentDidMount() {
    if (this.props.modals.length > 0) {
      preventBodyScroll().on();
    }
  }

  componentDidUpdate() {
    if (this.props.modals.length > 0) {
      preventBodyScroll(this.refs.wrapper).on();
    } else {
      preventBodyScroll(this.refs.wrapper).off();
    }
  }

  componentWillUnmount() {
    preventBodyScroll(this.refs.wrapper).off();
  }

  render() {
    const { modals, closeModal } = this.props;
    return (
      <ReactCSSTransitionGroup transitionName="modal" transitionEnterTimeout={ 250 } transitionLeaveTimeout={ 150 }>
        { modals.map((modal, i) => {
          const close = () => closeModal(modal);
          return (
            <div
              key={ i }
              onClick={ modal.props.rootClose ? close : null }
              className="ModalHost-wrapper"
              ref="wrapper"
            >
              { React.cloneElement(modal, { close }) }
            </div>
            );
        })
        }
      </ReactCSSTransitionGroup>
    );
  }
}

const mapStateToProps = state => ({
  modals: state.modals,
});

const mapDispatchToProps = dispatch => ({
  closeModal: modal => dispatch(closeModal(modal)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ModalHost);
