import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import ShoutPreview from './ShoutPreview';
import { denormalize } from '../schemas/index';
import Card, { CardTitle } from '../ui/Card';

export function SuggestedShout({ shout }) {
  if (!shout) {
    return null;
  }
  return (
    <Card size="small" block>
      <CardTitle>
        <FormattedMessage id="suggestedShout.title" defaultMessage="Suggested shout" />
      </CardTitle>
      <ShoutPreview block shout={ shout } />
    </Card>
  );
}

SuggestedShout.propTypes = {
  shout: PropTypes.object,
};

const mapStateToProps = state => ({
  shout: state.suggestions.shout ? denormalize(state.entities.shouts[state.suggestions.shout], state.entities, 'SHOUT') : null,
});

export default connect(mapStateToProps)(SuggestedShout);
