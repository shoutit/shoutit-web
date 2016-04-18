import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import CardWithList from '../ui/CardWithList';
import TagListItem from '../tags/TagListItem';

export function SuggestedTags({ tags }) {
  return (
    <CardWithList title="Suggested Interests">
      { tags.map((tag, i) => <TagListItem key={ i } tag={ tag } />)}
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
