import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import CardWithList from '../ui/CardWithList';
import TagListItem from '../tags/TagListItem';


export function SuggestedTags({ tags }) {
  return (
    <CardWithList title={ <FormattedMessage id="suggestedTags.title" defaultMessage="Suggested interests" /> }>
      { tags.map((tag, i) => <TagListItem key={ i } tag={ tag } />) }
    </CardWithList>
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
