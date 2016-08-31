
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import PropTypes, { PaginationPropTypes } from '../utils/PropTypes';

import { getListeningTags, getPaginationState } from '../reducers/paginated/tagListeningByUser';

import { loadListeningTags } from '../actions/users';

import Modal, { Header, Footer, BodyPaginated } from '../modals';
import Button from '../forms/Button';
import TagListItem from '../tags/TagListItem';

export class ListeningTagsModal extends Component {

  static propTypes = {
    tags: PropTypes.array.isRequired,
    profile: PropTypes.object.isRequired,
    loadTags: PropTypes.func.isRequired,
    pagination: PropTypes.shape(PaginationPropTypes),
  }

  modal = null

  render() {
    const { tags, pagination, loadTags, ...modalProps } = this.props;
    return (
      <Modal
        { ...modalProps }
        ref={ el => this.modal = el }
        isFetchingContent={ !tags }
        size="small" >
        <Header closeButton>
          <FormattedMessage
            id="users.ListeningTagsModal.title"
            defaultMessage="{name}’s interests"
            values={ this.props.profile }
          />
        </Header>
        <BodyPaginated
          pagination={ pagination }
          loadData={ loadTags }
          showProgress={ pagination.isFetching }>
          { tags && tags.map(tag =>
            <TagListItem
              key={ tag.id }
              popover={ false }
              tag={ tag } />
          )}
        </BodyPaginated>
        <Footer>
          <Button
            kind="primary"
            onClick={ () => this.modal.hide() }>
            <FormattedMessage
              id="users.ListeningTagsModal.close"
              defaultMessage="Close"
            />
          </Button>
        </Footer>
      </Modal>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  tags: getListeningTags(state, ownProps.profile),
  pagination: getPaginationState(state, ownProps.profile),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  loadTags: params => dispatch(loadListeningTags(ownProps.profile, params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ListeningTagsModal);
