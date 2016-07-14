import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import Card, { CardList, CardTitle } from '../layout/Card';
import TagListItem from '../tags/TagListItem';

export function SuggestedTags({ tags }) {
  return (
    <Card size="small" block>
      <CardTitle>
        <FormattedMessage id="suggestedTags.title" defaultMessage="Suggested interests" />
      </CardTitle>
      <CardList>
        { tags.map((tag, i) => <TagListItem key={ i } tag={ tag } />) }
      </CardList>
    </Card>
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
