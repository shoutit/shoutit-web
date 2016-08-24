import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { FormattedMessage } from 'react-intl';

import PropTypes, { PaginationPropTypes } from '../utils/PropTypes';

import { getPagesByUsername, getPaginationState } from '../reducers/paginated/pagesByUsername';
import { loadPages } from '../actions/users';

import Modal, { Header, Footer, Body } from '../modals';
import Button from '../forms/Button';
import Progress from '../widgets/Progress';
import List from '../layout/List';

import ScrollablePagination from '../widgets/ScrollablePagination';
import ProfileListItem from '../users/ProfileListItem';

export class SwitchToPageModal extends Component {

  static propTypes = {
    pages: PropTypes.array.isRequired,
    loadPages: PropTypes.func.isRequired,
    pagination: PropTypes.shape(PaginationPropTypes),
  }

  constructor(props) {
    super(props);
    this.handlePageClick = this.handlePageClick.bind(this);
  }

  modal = null

  handlePageClick(e) {
    e.preventDefault();
    this.modal.hide();
  }

  render() {
    const { pages, pagination, loadPages, ...modalProps } = this.props;
    return (
      <ScrollablePagination
        { ...pagination }
        scrollElement={ () => {
          console.log('this.modal', this.modal.getBodyNode().scrollHeight);
          return this.modal.getBodyNode();
        } }
        loadData={ endpoint => loadPages(endpoint) }>
        <Modal
          { ...modalProps }
          ref={ el => this.modal = el }
          loading={ !pages }
          size="small" >
          <Header closeButton>
            Use Shoutit as page
          </Header>
          <Body style={ { padding: 0 } }>
            { pages &&
              <List>
                { pages.map(page =>
                  <ProfileListItem
                    key={ page.id }
                    popover={ false }
                    size="large"
                    profile={ page }
                    onClick={ this.handlePageClick } />
                )}
              </List>
            }
            { pages && pages.length === 0 &&
              <p>
                You don't have any page.
              </p>
            }
            <Progress animate={ pagination.isFetching && pages && pages.length > 0 } />
          </Body>
          <Footer>
            <Button kind="primary" onClick={ () => this.modal.hide() }>
              Close
            </Button>
          </Footer>
        </Modal>
      </ScrollablePagination>
    );
  }
}

const mapStateToProps = state => ({
  pages: getPagesByUsername(state, 'me'),
  pagination: getPaginationState(state, 'me'),
});

const mapDispatchToProps = dispatch => ({
  loadPages: params => dispatch(loadPages('me', params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SwitchToPageModal);
