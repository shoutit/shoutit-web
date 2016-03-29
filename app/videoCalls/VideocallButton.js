import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import SVGIcon from '../shared/components/helper/SVGIcon';
import Button from '../shared/components/helper/Button.jsx';

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
      leftIcon={ <SVGIcon fill name="video" />
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
