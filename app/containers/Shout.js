import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { loadShout, loadRelatedShouts } from '../actions/shouts';
import { startShoutReply } from '../actions/chat';
import { routeError } from '../actions/server';

import Page from '../layout/Page';
import ProfileListItem from '../users/ProfileListItem';

import CategoryListItem from '../shouts/CategoryListItem';
import EditShoutButton from '../shouts/EditShoutButton';
import ShoutPrice from '../shouts/ShoutPrice';
import ShoutPreview from '../shouts/ShoutPreview';
import FilterListItem from '../shouts/FilterListItem';
import ShoutCallButton from '../shouts/ShoutCallButton';
import Location from '../location/Location';

import Button from '../ui/Button';
import CardWithList from '../ui/CardWithList';
import Gallery from '../ui/Gallery';
import ListItem from '../ui/ListItem';
import NewlineToBreak from '../ui/NewlineToBreak';
import Progress from '../ui/Progress';
import Icon from '../ui/Icon';
import TimeAgo from '../ui/TimeAgo';
import LocationListItem from '../location/LocationListItem';

import { denormalize } from '../schemas';

if (process.env.BROWSER) {
  require('./Shout.scss');
}

const fetchData = (dispatch, state, params) =>
  Promise.all([
    dispatch(loadShout(params.id)).catch(err => dispatch(routeError(err))),
    dispatch(loadRelatedShouts(params.id, { page_size: 8 })),
  ]);

function ShoutActions({ shout, onReplyClick }) {
  const buttonStyle = {
    width: '80%',
    margin: '0 auto',
    marginBottom: '.5rem',
    textAlign: 'center',
  };
  return (
    <div className="ShoutActions">
      <ShoutPrice shout={ shout } layout="plain" />

      { shout.profile.isOwner ?
        <div>
          <EditShoutButton shoutId={ shout.id } />
        </div> :
        <div>
          <Button style={ buttonStyle } block onClick={ onReplyClick } size="small" primary leftIcon = { <Icon fill name="balloon-dots" /> } label="Reply to this Shout" />
          { shout.isMobileSet && <ShoutCallButton shout={ shout } style={ buttonStyle } block /> }
        </div>
      }

    </div>
  );
}

ShoutActions.propTypes = {
  shout: PropTypes.object.isRequired,
  onReplyClick: PropTypes.func.isRequired,
};

export class Shout extends Component {

  static propTypes = {
    shout: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    firstRender: PropTypes.bool,
    relatedShouts: PropTypes.array,
    params: PropTypes.object,
    loggedUser: PropTypes.object,
  };

  static fetchData = fetchData;

  componentDidMount() {
    const { dispatch, firstRender, params } = this.props;
    if (!firstRender) {
      fetchData(dispatch, {}, params);
    }
  }

  componentWillUpdate(nextProps) {
    const { dispatch, params: { id } } = this.props;
    if (nextProps.params.id !== id) {
      fetchData(dispatch, {}, nextProps.params);
    }
  }

  startShoutReply() {
    const { loggedUser, shout, dispatch } = this.props;
    dispatch(startShoutReply(loggedUser, shout));
  }

  renderStartColumn() {
    const { shout } = this.props;

    const categoryWithFilters = (
        <CardWithList block style={{ padding: '.5rem', backgroundColor: 'white' }}>
          <CategoryListItem category={ shout.category } />
          { shout.filters.map((filter) => <FilterListItem key={ filter.slug } filter={ filter } category={ shout.category } />) }
        </CardWithList>
      );

    return [
      categoryWithFilters,
    ];
  }

  renderEndColumn() {
    const { shout } = this.props;
    return [
      <ShoutActions shout={ shout } onReplyClick={ () => this.startShoutReply() } />,
      <CardWithList block key="profile" style={{ marginTop: '2rem', padding: '.5rem' }} >
        <ProfileListItem tooltipPlacement="right" profile={ shout.profile } />
        <ListItem start={ <Icon name="clock" active /> }>
          <TimeAgo date={ shout.datePublished } />
        </ListItem>
        <LocationListItem location={ shout.location } />
      </CardWithList>,
      <Location style={{ marginTop: '1rem' }} location={ shout.location } />,
    ];
  }

  renderRelatedShouts() {
    const { relatedShouts } = this.props;
    if (!relatedShouts || relatedShouts.length === 0) {
      return null;
    }

    return (
      <div className="Shouts-related">
        <h2>Related shouts</h2>
        <div className="Shouts-related-wrapper">
          { relatedShouts.map(shout => <ShoutPreview shout={ shout } />) }
        </div>
      </div>
    );
  }

  renderShout() {
    const { shout } = this.props;
    return (
      <div className="Shout">

        <div className="Shout-title">
          <h1>{ shout.title || shout.text }</h1>
        </div>

        { (shout.images && shout.images.length > 0 || shout.videos && shout.videos.length > 0) &&
          <div className="Shout-gallery">
            <Gallery images={ shout.images || undefined } videos={ shout.videos || undefined } />
          </div>
        }

        <div className="Shout-body">
          <div className="Shout-text">
            { shout.text && <p>
              <NewlineToBreak>
                { shout.text }
              </NewlineToBreak>
            </p>
            }
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { shout } = this.props;

    return (
      <div>
        <Page title={ shout ? shout.title : null }
          className="ShoutPage"
          miniFooter={ false }
          startColumn={ this.renderStartColumn() }
          endColumn={ this.renderEndColumn() }>
          { !shout && <Progress animate /> }
          { shout && this.renderShout() }
        </Page>
        { shout && this.renderRelatedShouts() }
      </div>
    );
  }

}

const mapStateToProps = (state, ownProps) => ({
  loggedUser: state.session.user,
  shout: state.entities.shouts[ownProps.params.id] ?
    denormalize(state.entities.shouts[ownProps.params.id], state.entities, 'SHOUT') :
    undefined,
  relatedShouts: state.paginated.relatedShoutsByShout[ownProps.params.id] ?
    state.paginated.relatedShoutsByShout[ownProps.params.id].ids.map(id => denormalize(state.entities.shouts[id], state.entities, 'SHOUT')) :
    undefined,
});

export default connect(mapStateToProps)(Shout);
