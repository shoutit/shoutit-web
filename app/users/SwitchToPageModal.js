/* eslint-env browser */

import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { FormattedMessage } from 'react-intl';

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

  modal = null

  handlePageClick(e, page) {
    e.preventDefault();
    this.props.switchToPage(page);
  }

  render() {
    const { pages, pagination, loadPages, ...modalProps } = this.props;
    return (
      <Modal
        { ...modalProps }
        ref={ el => this.modal = el }
        loading={ !pages }
        size="small" >
        <Header closeButton>
          Use Shoutit as page
        </Header>
        { pages && pages.length === 0 ?
          <Body>
            <p>
              You don't have any page.
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
            Close
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
