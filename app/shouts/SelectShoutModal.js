import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import PropTypes, { PaginationPropTypes } from '../utils/PropTypes';

import { getShoutsByUsername, getPaginationState } from '../reducers/paginated/shoutsByUsername';
import { loadShoutsByUsername } from '../actions/users';

import Modal, { Header, Footer, BodyPaginated } from '../modals';
import Button from '../forms/Button';
import ShoutListItem from '../shouts/ShoutListItem';


export class SelectShoutModal extends Component {

  static propTypes = {
    profile: PropTypes.object.isRequired,
    shouts: PropTypes.array,
    title: PropTypes.node.isRequired,
    loadShouts: PropTypes.func.isRequired,
    pagination: PropTypes.shape(PaginationPropTypes),
    onSelect: PropTypes.func,
  }

  static defaultProps = {
    title: 'Your Shouts',
  }

  constructor(props) {
    super(props);
    this.handleShoutClick = this.handleShoutClick.bind(this);
  }

  handleShoutClick(shout) {
    if (!this.props.onSelect) {
      return;
    }
    this.modal.hide();
    this.props.onSelect(shout);
  }

  render() {
    const { title, pagination, loadShouts, shouts, ...modalProps } = this.props;
    return (
      <Modal { ...modalProps }
        size="small"
        ref={ el => this.modal = el }
        isFetchingContent={ !shouts }>
        <Header closeButton>
          { title || <FormattedMessage id="SelectShoutModal.title" defaultMessage="Shouts" /> }
        </Header>
        <BodyPaginated
          pagination={ pagination }
          loadData={ loadShouts }
          showProgress={ pagination.isFetching }
        >
          { shouts && shouts.map(shout =>
            <div key={ shout.id }>
              <ShoutListItem
                shout={ shout }
                link={ false }
                onClick={ () => this.handleShoutClick(shout) }
              />
            </div>
            )}
        </BodyPaginated>
        <Footer>
          <Button kind="primary" onClick={ () => this.modal.hide() }>
            <FormattedMessage id="SelectShoutModal.closeButton" defaultMessage="Close" />
          </Button>
        </Footer>
      </Modal>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  shouts: getShoutsByUsername(state, ownProps.profile.username),
  pagination: getPaginationState(state, ownProps.profile.username),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  loadShouts: params => dispatch(loadShoutsByUsername(ownProps.profile.username, params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SelectShoutModal);

