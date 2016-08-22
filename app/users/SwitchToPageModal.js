import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
// import { FormattedMessage } from 'react-intl';

import { getPagesByUsername, getPaginationState } from '../reducers/paginated/pagesByUsername';
import { loadPages } from '../actions/users';

import Modal, { Header, Footer, Body } from '../modals';
import Button from '../forms/Button';
import Progress from '../widgets/Progress';
import ScrollablePagination from '../widgets/ScrollablePagination';
import ProfileListItem from '../users/ProfileListItem';

export class SwitchToPageModal extends Component {

  static propTypes = {
    pages: PropTypes.array.isRequired,
    onShoutClick: PropTypes.func.isRequired,
    loadPages: PropTypes.func.isRequired,
    isFetching: PropTypes.func.boolean,
    nextUrl: PropTypes.string,
  }

  constructor(props) {
    super(props);
    this.handlePageClick = this.handlePageClick.bind(this);
    this.hide = this.hide.bind(this);
  }

  modal = null
  closeButton = null
  body = null

  handlePageClick(e) {
    e.preventDefault();
    this.hide();
  }

  hide() {
    this.modal.hide();
  }

  render() {
    const { pages, isFetching, nextUrl, loadPages, ...modalProps } = this.props;
    return (
      <ScrollablePagination
        scrollElement={ () => this.body.getDOMNode() }
        isFetching={ isFetching }
        endpoint={ nextUrl }
        loadData={ endpoint => loadPages(endpoint) }>
        <Modal
          { ...modalProps }
          ref={ el => { this.modal = el; } }
          loading={ !pages || (pages.length === 0 && isFetching) }
          size="small" >
          <Header closeButton>
            Use Shoutit as page
          </Header>
          <Body ref={ el => { this.body = el; } }>
            { pages && pages.map(page =>
              <ProfileListItem
                key={ page.id }
                popover={ false }
                size="large"
                profile={ page }
                onClick={ this.handlePageClick } />
            )}
            { pages && pages.length === 0 && !isFetching &&
              <p>
                You don't have any page.
              </p>
            }
            <Progress animate={ isFetching } />
          </Body>
          <Footer>
            <Button
              ref={ el => { this.closeButton = el; } }
              kind="primary"
              onClick={ this.hide }>
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
  ...getPaginationState(state, 'me'),
});

const mapDispatchToProps = dispatch => ({
  loadPages: nextUrl => {
    dispatch(loadPages('me', nextUrl));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(SwitchToPageModal);
