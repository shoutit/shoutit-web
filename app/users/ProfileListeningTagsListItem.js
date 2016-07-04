import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import Icon from '../widgets/Icon';
import ListItem from '../layout/ListItem';
import ListeningTagsModal from '../users/ListeningTagsModal';

import { openModal } from '../actions/ui';

export function ProfileListeningTagsListItem({ profile, onClick, size = 'small' }) {
  const count = profile.listeningCount.tags;
  if (!count) {
    return null;
  }
  return (
    <ListItem
      className="ProfileListeningTagsListItem"
      size={ size }
      nowrap
      onClick={ count > 0 ? onClick : undefined }
      start={ <Icon name="tag" size={ size } active={ count > 0 } /> }>
      <FormattedMessage id="profile.ListeningTagsListItem"
        defaultMessage="{count, plural,
          one {# interest}
          other {# interests}
        }"
        values={ { count } }
      />
    </ListItem>
  );
}

ProfileListeningTagsListItem.propTypes = {
  profile: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
  size: PropTypes.oneOf(['small', 'medium']),
};

const mapDispatchToProps = (dispatch, { profile }) => ({
  onClick: () => dispatch(openModal(
    <ListeningTagsModal profile={ profile } />
  )),
});
export default connect(null, mapDispatchToProps)(ProfileListeningTagsListItem);
