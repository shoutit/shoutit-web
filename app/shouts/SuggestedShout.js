import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import ShoutPreview from './ShoutPreview';
import { denormalize } from '../schemas/index';
import Panel, { PanelTitle } from '../layout/Panel';

export function SuggestedShout({ shout }) {
  if (!shout) {
    return null;
  }
  return (
    <Panel size="small" block>
      <PanelTitle>
        <FormattedMessage id="suggestedShout.title" defaultMessage="Suggested shout" />
      </PanelTitle>
      <ShoutPreview shout={ shout } />
    </Panel>
  );
}

SuggestedShout.propTypes = {
  shout: PropTypes.object,
};

const mapStateToProps = state => ({
  shout: state.suggestions.shout ? denormalize(state.entities.shouts[state.suggestions.shout], state.entities, 'SHOUT') : null,
});

export default connect(mapStateToProps)(SuggestedShout);
