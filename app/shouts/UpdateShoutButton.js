import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import Button from '../ui/Button';

import UpdateShout from './UpdateShout';

import { openModal, closeModal } from '../actions/ui';

export function UpdateShoutButton({ onClick, ...props }) {
  return (
    <Button onClick={ onClick } size="small" action="primary" icon="pencil" {...props}>
      { props.children || 'Edit Shout' }
    </Button>
  );
}

UpdateShoutButton.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func.isRequired,
  shoutId: PropTypes.string.isRequired,
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  onClick: () => dispatch(openModal(
    <UpdateShout shoutId={ ownProps.shoutId } onCancel={ () => dispatch(closeModal()) } onSuccess={ () => dispatch(closeModal()) } />,
    { title: 'Edit this Shout' }
  )),
});

export default connect(null, mapDispatchToProps)(UpdateShoutButton);
