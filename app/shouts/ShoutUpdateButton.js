import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import Button from '../forms/Button';

import UpdateShoutModal from './UpdateShoutModal';

import { openModal } from '../actions/ui';

export function ShoutUpdateButton({ onClick, ...props }) {
  return (
    <Button onClick={ onClick } kind="primary" icon="pencil" { ...props }>
      { props.children || <FormattedMessage id="ShoutUpdateButton.label" defaultMessage="Edit Shout" /> }
    </Button>
  );
}

ShoutUpdateButton.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func.isRequired,
  shoutId: PropTypes.string.isRequired,
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  onClick: () => dispatch(openModal(<UpdateShoutModal shoutId={ ownProps.shoutId } />)),
});

export default connect(null, mapDispatchToProps)(ShoutUpdateButton);
