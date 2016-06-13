import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import CardWithList from '../ui/CardWithList';
import TagListItem from '../tags/TagListItem';
import { getRelatedTags } from '../reducers/paginated/relatedTagsByTag';

export function RelatedTags({ tags }) {
  if (tags.length === 0) {
    return null;
  }
  return (
    <CardWithList
      title={ <FormattedMessage id="relatedTags.title" defaultMessage="Related interests" /> }>
      { tags.map((tag, i) => <TagListItem key={ i } tag={ tag } />) }
    </CardWithList>
  );
}

RelatedTags.propTypes = {
  tags: PropTypes.array.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  tags: getRelatedTags(state, ownProps.tag.id),
});
export default connect(mapStateToProps)(RelatedTags);
