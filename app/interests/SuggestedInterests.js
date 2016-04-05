import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import CardWithList from '../ui/CardWithList';
import InterestListItem from './InterestListItem';

export function SuggestedInterests({ tags }) {
  return (
    <CardWithList title="Interests">
      { tags.map((tag, i) => <InterestListItem key={ i } tag={ tag } />)}
    </CardWithList>
  );
}

SuggestedInterests.PropTypes = {
  tags: PropTypes.array.isRequired,
};

const mapStateToProps = state => {
  const tags = state.suggestions.tags.map(id => state.entities.tags[id]);
  return {
    tags,
  };
};
export default connect(mapStateToProps)(SuggestedInterests);
