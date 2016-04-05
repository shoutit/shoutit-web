import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import ShoutPreview from './ShoutPreview';
import { denormalize } from '../schemas/index';

if (process.env.BROWSER) {
  require('./SuggestedShout.scss');
}

export function SuggestedShout({ shout }) {
  return (
    <div className="SuggestedShout">
      <h3>Suggested shout</h3>
      <ShoutPreview shout={ shout } />
    </div>
  );
}

SuggestedShout.propTypes = {
  shout: PropTypes.object.isRequired,
};

// It is expected suggestions are already loaded when using this component
const mapStateToProps = state => ({
  shout: denormalize(state.entities.shouts[state.suggestions.shout], state.entities, 'SHOUT'),
});

export default connect(mapStateToProps)(SuggestedShout);
