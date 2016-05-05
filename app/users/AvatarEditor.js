import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

export function AvatarEditor({ profile }) {
  return (
    <div>
      Avatar editor { profile.name }
    </div>
  );
}

AvatarEditor.propTypes = {
  profile: PropTypes.object.isRequired,
};

export default connect()(AvatarEditor);
