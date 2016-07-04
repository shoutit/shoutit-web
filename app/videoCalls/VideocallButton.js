import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Button from '../forms/Button';

import { startVideocall } from '../actions/videocalls';

export function VideocallButton({ onVideocallClick, enabled = false, user }) {
  if (!enabled) {
    return null;
  }
  return (
    <Button
      kind="primary"
      onClick={ () => onVideocallClick(user) }
      icon="video">
        Video call
    </Button>
  );
}

VideocallButton.propTypes = {
  onVideocallClick: PropTypes.func.isRequired,
  enabled: PropTypes.bool,
  user: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  const { videocalls: { enabled } } = state;
  return { enabled };
};

const mapDispatchToProps = dispatch => ({
  onVideocallClick: user => dispatch(startVideocall(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(VideocallButton);
