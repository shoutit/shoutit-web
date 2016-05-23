import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import capitalize from 'lodash/capitalize';
import { Link } from 'react-router';
import { loadShout, loadRelatedShouts, startShoutReply } from '../actions/shouts';
import { openConversation } from '../actions/conversations';
import { routeError } from '../actions/server';

import { formatPrice } from '../utils/CurrencyUtils';
import { formatLocation } from '../utils/LocationUtils';

import Helmet from '../utils/Helmet';

import RequiresLogin from '../auth/RequiresLogin';
import { REPLY_SHOUT } from '../auth/loginActions';

import Page from '../layout/Page';
import ProfileListItem from '../users/ProfileListItem';

import CategoryListItem from '../shouts/CategoryListItem';
import FilterListItem from '../shouts/FilterListItem';
import Location from '../location/Location';
import ShoutCallButton from '../shouts/ShoutCallButton';
import ShoutPreview from '../shouts/ShoutPreview';
import ShoutPrice from '../shouts/ShoutPrice';
import ShoutType from '../shouts/ShoutType';
import UpdateShoutButton from '../shouts/UpdateShoutButton';

import Button from '../ui/Button';
import CardWithList from '../ui/CardWithList';
import Gallery from '../ui/Gallery';
import Icon from '../ui/Icon';
import ListItem from '../ui/ListItem';
import NewlineToBreak from '../ui/NewlineToBreak';
import Progress from '../ui/Progress';
import Share from '../ui/Share';
import TimeAgo from '../ui/TimeAgo';

import LocationListItem from '../location/LocationListItem';

import { denormalize } from '../schemas';

if (process.env.BROWSER) {
  require('./Shout.scss');
}

const fetchData = (dispatch, state, params) =>
  dispatch(loadShout(params.id)).catch(err => dispatch(routeError(err)));

function ShoutActions({ shout, onReplyClick }) {
  const buttonStyle = {
    width: '80%',
    margin: '0 auto',
    marginTop: '.5rem',
    textAlign: 'center',
  };
  let callButton;
  if (shout.isMobileSet) {
    callButton = <ShoutCallButton shout={ shout } style={ buttonStyle } block />;
  }
  return (
    <div className="ShoutActions">
      { shout.type === 'request' && <ShoutType shout={ shout } layout="plain" /> }
      <ShoutPrice shout={ shout } layout="plain" />
      { shout.profile.isOwner ?
        <div>
          <UpdateShoutButton style={ buttonStyle } block shoutId={ shout.id } />
          { callButton }
        </div> :
        <div>
          <RequiresLogin event="onClick" loginAction={ REPLY_SHOUT }>
            <Button style={ buttonStyle } block onClick={ onReplyClick } size="small" action="primary" icon="balloon-dots">
              Reply to this Shout
            </Button>
          </RequiresLogin>
          { callButton }
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
    dispatch(loadRelatedShouts(params.id, { page_size: 8 })).catch(() => {});
  }

  componentWillUpdate(nextProps) {
    const { dispatch, params } = this.props;
    if (nextProps.params.id !== params.id) {
      fetchData(dispatch, {}, nextProps.params);
      dispatch(loadRelatedShouts(nextProps.params.id, { page_size: 8 })).catch(() => {});
    }
  }

  startShoutReply() {
    const { loggedUser, shout, dispatch } = this.props;
    if (shout.conversations && shout.conversations.length > 0) {
      dispatch(openConversation(shout.conversations[0]));
    } else {
      dispatch(startShoutReply(loggedUser, shout));
    }
  }

  renderStartColumn() {
    const { shout } = this.props;

    const categoryWithFilters = (
      <CardWithList key="filters" block style={ { padding: '.5rem' } }>
        <Link to={ `/search?category=${shout.category.slug}` }><CategoryListItem category={ shout.category } /></Link>
        { shout.filters.map((filter) => <FilterListItem key={ filter.slug } filter={ filter } category={ shout.category } />) }
      </CardWithList>
    );

    const share = (
      <CardWithList title="Share this shout" block key="share" style={ { padding: '.5rem' } }>
        <Share shareUrl={ `/shout/${shout.id}` } title={ shout.title } image={ shout.thumbnail } />
      </CardWithList>
    );

    return [categoryWithFilters, share];
  }

  renderEndColumn() {
    const { shout } = this.props;
    return [
      <ShoutActions key="actions" shout={ shout } onReplyClick={ () => this.startShoutReply() } />,
      <CardWithList block key="profile" style={ { marginTop: '2rem', padding: '.5rem' } } >
        <ProfileListItem tooltipPlacement="right" profile={ shout.profile } />
        <ListItem start={ <Icon name="clock" active /> }>
          <TimeAgo date={ shout.datePublished } />
        </ListItem>
        <LocationListItem location={ shout.location } />
      </CardWithList>,
      <Location key="location" style={ { marginTop: '1rem' } } location={ shout.location } />,
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
          { relatedShouts.map(shout => <ShoutPreview key={ shout.id } shout={ shout } />) }
        </div>
      </div>
    );
  }

  renderShout() {
    const { shout } = this.props;
    return (
      <div className="Shout">
        { shout.title &&
          <div className="Shout-title">
            <h1>{ shout.title }</h1>
          </div>
        }

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
        <Page
          className="ShoutPage"
          miniFooter={ false }
          startColumn={ this.renderStartColumn() }
          endColumn={ this.renderEndColumn() }>

          { shout &&
            <Helmet
              title={ shout.title }
              description={ shout.text }
              images={ shout.images }
              meta={ [
                { property: 'og:type', content: `shoutitcom:${shout.type}` },
                { property: 'shoutitcom:price', content: formatPrice(shout.price, shout.currency) },
                { property: 'shoutitcom:username', content: shout.profile.username },
                { name: 'twitter:card', content: 'product' },
                { name: 'twitter:label1', content: capitalize(shout.type) },
                { name: 'twitter:data1', content: formatPrice(shout.price, shout.currency) },
                { name: 'twitter:label2', content: 'Location' },
                { name: 'twitter:data2', content: formatLocation(shout.location) },
              ] }
            />
          }
          { !shout && <Progress animate /> }
          { shout && this.renderShout() }
        </Page>
        { shout && this.renderRelatedShouts() }
      </div>
    );
  }

}

const mapStateToProps = (state, ownProps) => ({
  loggedUser: state.entities.users[state.session.user],
  shout: state.entities.shouts[ownProps.params.id] ?
    denormalize(state.entities.shouts[ownProps.params.id], state.entities, 'SHOUT') :
    undefined,
  relatedShouts: state.paginated.relatedShoutsByShout[ownProps.params.id] ?
    state.paginated.relatedShoutsByShout[ownProps.params.id].ids.map(id => denormalize(state.entities.shouts[id], state.entities, 'SHOUT')) :
    undefined,
});

export default connect(mapStateToProps)(Shout);
