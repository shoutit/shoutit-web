import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import ShoutPreview from './ShoutPreview';
import { denormalize } from '../schemas/index';

if (process.env.BROWSER) {
  require('./SuggestedShout.scss');
}

export function SuggestedShout({ shout }) {
  if (!shout) {
    return <div />;
  }
  return (
    <div className="SuggestedShout">
      <h3>Suggested shout</h3>
      <ShoutPreview shout={ shout } />
    </div>
  );
}

SuggestedShout.propTypes = {
  shout: PropTypes.object,
};

const mapStateToProps = state => ({
  shout: state.suggestions.shout ? denormalize(state.entities.shouts[state.suggestions.shout], state.entities, 'SHOUT') : null,
});

export default connect(mapStateToProps)(SuggestedShout);
