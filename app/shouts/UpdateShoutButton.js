import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import Button from '../ui/Button';

import UpdateShoutModal from './UpdateShoutModal';

import { openModal } from '../actions/ui';

export function UpdateShoutButton({ onClick, ...props }) {
  return (
    <Button onClick={ onClick } size="small" action="primary" icon="pencil" { ...props }>
      { props.children || <FormattedMessage id="UpdateShoutButton.label" defaultMessage="Edit Shout" /> }
    </Button>
  );
}

UpdateShoutButton.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func.isRequired,
  shoutId: PropTypes.string.isRequired,
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  onClick: () => dispatch(openModal(<UpdateShoutModal shoutId={ ownProps.shoutId } />)),
});

export default connect(null, mapDispatchToProps)(UpdateShoutButton);
