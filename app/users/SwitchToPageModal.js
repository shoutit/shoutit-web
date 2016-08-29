/* eslint-env browser */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import PropTypes, { PaginationPropTypes } from '../utils/PropTypes';

import { getPagesByUsername, getPaginationState } from '../reducers/paginated/pagesByUsername';
import { loadPages } from '../actions/users';
import { authenticateAs } from '../actions/session';

import Modal, { Header, Footer, Body, BodyPaginated } from '../modals';
import Button from '../forms/Button';

import ProfileListItem from '../users/ProfileListItem';

export class SwitchToPageModal extends Component {

  static propTypes = {
    pages: PropTypes.array,
    loadPages: PropTypes.func.isRequired,
    switchToPage: PropTypes.func.isRequired,
    pagination: PropTypes.shape(PaginationPropTypes),
  }

  constructor(props) {
    super(props);
    this.handlePageClick = this.handlePageClick.bind(this);
  }

  state = {
    loading: false,
  }

  modal = null

  handlePageClick(e, page) {
    e.preventDefault();
    this.setState({
      loading: true,
    });
    this.props.switchToPage(page);
  }

  render() {
    const { pages, pagination, loadPages, ...modalProps } = this.props;
    return (
      <Modal
        { ...modalProps }
        ref={ el => this.modal = el }
        isFetchingContent={ !pages }
        isLoading={ this.state.loading }
        size="small" >
        <Header closeButton>
          <FormattedMessage
            id="users.SwitchToPageModal.title"
            defaultMessage="Use Shoutit as page"
          />
        </Header>
        { pages && pages.length === 0 ?
          <Body>
            <p>
              <FormattedMessage
                id="users.SwitchToPageModal.noPages"
                defaultMessage="You don't have any page."
              />
            </p>
          </Body> :
          <BodyPaginated
            pagination={ pagination }
            loadData={ loadPages }
            showProgress={ pagination.isFetching && pages && pages.length > 0 }>
            { pages && pages.map(page =>
              <ProfileListItem
                key={ page.id }
                popover={ false }
                size="large"
                profile={ page }
                onClick={ e => this.handlePageClick(e, page) } />
            )}
          </BodyPaginated>
        }
        <Footer>
          <Button kind="primary" onClick={ () => this.modal.hide() }>
            <FormattedMessage
              id="users.SwitchToPageModal.closeButton"
              defaultMessage="Close"
            />
          </Button>
        </Footer>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  pages: getPagesByUsername(state, 'me'),
  pagination: getPaginationState(state, 'me'),
});

const mapDispatchToProps = dispatch => ({
  loadPages: params => dispatch(loadPages('me', params)),
  switchToPage: page =>
    dispatch(authenticateAs(page))
      .then(() => window.location = '/'),
});

export default connect(mapStateToProps, mapDispatchToProps)(SwitchToPageModal);
