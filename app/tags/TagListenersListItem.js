import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import Icon from '../ui/Icon';
import ListItem from '../ui/ListItem';
import TagListenersScrollableList from '../tags/TagListenersScrollableList';

import { openModal } from '../actions/ui';

export function TagListenersListItem({ tag, onClick, size = 'small' }) {
  const { listenersCount } = tag;
  return (
    <ListItem
      className="TagListenersListItem"
      size={ size }
      nowrap
      onClick={ listenersCount > 0 ? onClick : undefined }
      start={ <Icon name="listeners" size={ size } active={ listenersCount > 0 } /> }>
      { listenersCount === 0 ? 'No ' : listenersCount } listener{ listenersCount > 1 }s
    </ListItem>
  );
}

TagListenersListItem.propTypes = {
  tag: PropTypes.object.isRequired,
  category: PropTypes.object,
  size: PropTypes.oneOf(['small', 'medium']),
  onClick: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  onClick: () =>
    dispatch(openModal(
      <TagListenersScrollableList tag={ ownProps.tag } />,
      { title: `Listening to ${ownProps.category ? ownProps.category.name : ownProps.tag.name}`, scrollableBody: true, bsSize: 'small' }
    )),
});

export default connect(null, mapDispatchToProps)(TagListenersListItem);
