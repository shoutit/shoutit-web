
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

import PropTypes, { PaginationPropTypes } from '../utils/PropTypes';

import Modal, { Header, Footer, BodyPaginated } from '../modals';
import Button from '../forms/Button';
import ProfileListItem from '../users/ProfileListItem';

/**
 * A paginated modal displaying a list of profiles
 *
 * @export
 * @class ProfilesListModal
 * @extends {Component}
 */
export default class ProfilesListModal extends Component {

  static propTypes = {
    profiles: PropTypes.array,
    title: PropTypes.node.isRequired,
    loadProfiles: PropTypes.func.isRequired,
    pagination: PropTypes.shape(PaginationPropTypes),
  }

  modal = null

  render() {
    const { title, profiles, pagination, loadProfiles, ...modalProps } = this.props;
    return (
      <Modal
        { ...modalProps }
        ref={ el => this.modal = el }
        isFetchingContent={ !profiles }
        size="small" >
        <Header closeButton>
          { title }
        </Header>
        <BodyPaginated
          pagination={ pagination }
          loadData={ loadProfiles }
          showProgress={ pagination.isFetching }>
          { profiles && profiles.map(profile =>
            <ProfileListItem
              key={ profile.id }
              popover={ false }
              size="large"
              profile={ profile } />
          )}
        </BodyPaginated>
        <Footer>
          <Button
            kind="primary"
            onClick={ () => this.modal.hide() }>
            <FormattedMessage
              id="users.ProfilesListModal.close"
              defaultMessage="Close"
            />
          </Button>
        </Footer>
      </Modal>
    );
  }
}
