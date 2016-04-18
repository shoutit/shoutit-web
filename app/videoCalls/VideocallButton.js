import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Icon from '../ui/Icon';
import Button from '../ui/Button';

import { startVideocall } from '../actions/videocalls';

export function VideocallButton({ onVideocallClick, enabled = false, user }) {
  if (!enabled) {
    return <span />;
  }
  return (
    <Button
      primary
      size="small"
      label="Video call"
      onClick={ () => onVideocallClick(user) }
      leftIcon={ <Icon fill name="video" />
      }
    />
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
