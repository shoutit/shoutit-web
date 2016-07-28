import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import Panel, { PanelList, PanelTitle } from '../layout/Panel';
import TagListItem from '../tags/TagListItem';

export function SuggestedTags({ tags }) {
  return (
    <Panel>
      <PanelTitle>
        <FormattedMessage id="suggestedTags.title" defaultMessage="Suggested interests" />
      </PanelTitle>
      <PanelList>
        { tags.map((tag, i) => <TagListItem key={ i } tag={ tag } />) }
      </PanelList>
    </Panel>
  );
}

SuggestedTags.propTypes = {
  tags: PropTypes.array.isRequired,
};

const mapStateToProps = state => {
  const tags = state.suggestions.tags.map(id => state.entities.tags[id]);
  return {
    tags,
  };
};
export default connect(mapStateToProps)(SuggestedTags);
