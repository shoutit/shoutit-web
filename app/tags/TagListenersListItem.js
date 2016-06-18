import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import Icon from '../ui/Icon';
import ListItem from '../ui/ListItem';
import TagListenersModal from '../tags/TagListenersModal';

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
      <FormattedMessage
        id="tagListeners.count"
        defaultMessage="{listenersCount, plural,
            zero {No listeners}
            one {# listener}
            two {# listeners}
            other {# listeners}
        }"
        values={ { listenersCount } }
      />
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
  onClick: () => dispatch(openModal(
    <TagListenersModal tag={ ownProps.tag } category={ ownProps.category } />
  )),
});

export default connect(null, mapDispatchToProps)(TagListenersListItem);
