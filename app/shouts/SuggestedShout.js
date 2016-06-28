import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import ShoutPreview from './ShoutPreview';
import { denormalize } from '../schemas/index';

import './SuggestedShout.scss';

export function SuggestedShout({ shout }) {
  if (!shout) {
    return <div />;
  }
  return (
    <div className="SuggestedShout">
      <h3>
        <FormattedMessage id="suggestedShout.title" defaultMessage="Suggested shout" />
      </h3>
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
