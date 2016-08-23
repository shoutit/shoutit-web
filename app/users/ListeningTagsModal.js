
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import PropTypes, { PaginationPropTypes } from '../utils/PropTypes';

import { getListeningTags, getPaginationState } from '../reducers/paginated/tagListeningByUser';

import { loadListeningTags } from '../actions/users';

import Modal, { Header, Footer, Body } from '../modals';
import Button from '../forms/Button';
import Progress from '../widgets/Progress';
import ScrollablePagination from '../widgets/ScrollablePagination';
import TagListItem from '../tags/TagListItem';

export class ListeningTagsModal extends Component {

  static propTypes = {
    tags: PropTypes.array.isRequired,
    profile: PropTypes.object.isRequired,
    loadTags: PropTypes.func.isRequired,
    pagination: PropTypes.shape(PaginationPropTypes),
  }

  modal = null
  body = null

  render() {
    const { tags, pagination, loadTags, ...modalProps } = this.props;
    return (
      <ScrollablePagination
        { ...pagination }
        scrollElement={ () => this.modal.getBodyNode() }
        loadData={ loadTags }>
        <Modal
          { ...modalProps }
          ref={ el => { this.modal = el; } }
          loading={ !tags }
          size="small" >
          <Header closeButton>
            <FormattedMessage
              id="users.ListeningTagsModal.title"
              defaultMessage="{name}’s interests"
              values={ this.props.profile }
            />
          </Header>
          <Body ref={ el => { this.body = el; } }>
            { tags && tags.map(tag =>
              <TagListItem
                key={ tag.id }
                popover={ false }
                tag={ tag } />
            )}
            <Progress animate={ pagination.isFetching } />
          </Body>
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
      </ScrollablePagination>
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
