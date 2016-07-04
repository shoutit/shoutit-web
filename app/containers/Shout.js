import React, { Component, PropTypes } from 'react';
import capitalize from 'lodash/capitalize';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';

import { Link } from 'react-router';

import { getCurrentLocale } from '../reducers/i18n';
import { loadShout, loadRelatedShouts, startShoutReply } from '../actions/shouts';
import { openConversation } from '../actions/conversations';
import { routeError } from '../actions/server';

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
import ShoutPrice from '../shouts/ShoutPrice';
import ShoutsList from '../shouts/ShoutsList';
import ShoutType from '../shouts/ShoutType';
import UpdateShoutButton from '../shouts/UpdateShoutButton';

import Button from '../forms/Button';
import Card, { CardList, CardTitle } from '../layout/Card';
import Gallery from '../widgets/Gallery';
import Icon from '../widgets/Icon';
import ListItem from '../layout/ListItem';
import NewlineToBreak from '../widgets/NewlineToBreak';
import Progress from '../widgets/Progress';
import Share from '../widgets/Share';
import TimeAgo from '../widgets/TimeAgo';

import LocationListItem from '../location/LocationListItem';

import { denormalize } from '../schemas';
import { getLoggedUser } from '../reducers/session';

import './Shout.scss';

const fetchData = (dispatch, state, params) =>
  dispatch(loadShout(params.id))
    .catch(err => dispatch(routeError(err)));

function ShoutActions({ shout, onReplyClick }) {
  const buttonStyle = {
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
      <ShoutPrice shout={ shout } />
      { shout.profile.isOwner ?
        <div>
          <UpdateShoutButton style={ buttonStyle } block shoutId={ shout.id } />
          { callButton }
        </div> :
        <div>
          <RequiresLogin event="onClick" loginAction={ REPLY_SHOUT }>
            <Button style={ buttonStyle } block onClick={ onReplyClick } kind="primary" icon="balloon-dots">
              <FormattedMessage id="shoutActions.reply" defaultMessage="Reply to this Shout" />
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
    intl: PropTypes.object.isRequired,
    locale: PropTypes.string.isRequired,
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
      <Card key="filters" block style={ { padding: '.5rem' } }>
        <CardList>
          { [
            <Link to={ `/search?category=${shout.category.slug}` }>
              <CategoryListItem category={ shout.category } />
            </Link>,
            ...shout.filters.map((filter) =>
              <FilterListItem
                key={ filter.slug }
                filter={ filter }
                category={ shout.category }
              />
            ),
          ] }
        </CardList>
      </Card>
    );

    const share = (
      <Card size="small" block key="share">
        <CardTitle>
          <FormattedMessage
            id="shout.share"
            defaultMessage="Share this Shout"
          />
        </CardTitle>
        <Share shareUrl={ `/shout/${shout.id}` } title={ shout.title } image={ shout.thumbnail } />
      </Card>
    );

    return [categoryWithFilters, share];
  }

  renderEndColumn() {
    const { shout } = this.props;
    return [
      <ShoutActions key="actions" shout={ shout } onReplyClick={ () => this.startShoutReply() } />,
      <Card block key="profile" style={ { marginTop: '2rem', padding: '.5rem' } }>
        <CardList>
          <ProfileListItem tooltipPlacement="right" profile={ shout.profile } />
          <ListItem start={ <Icon name="clock" active /> }>
            <TimeAgo date={ shout.datePublished } />
          </ListItem>
          <LocationListItem location={ shout.location } />
        </CardList>
      </Card>,
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
        <h2>
          <FormattedMessage
            id="shout.related"
            defaultMessage="Related Shouts"
          />
        </h2>
        <ShoutsList shouts={ relatedShouts } />
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
            { shout.text &&
              <NewlineToBreak>
                { shout.text }
              </NewlineToBreak>
            }
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { shout, locale } = this.props;
    const { formatNumber } = this.props.intl;
    const price = shout.price ?
      formatNumber(shout.price / 100, {
        style: 'currency',
        currencyDisplay: 'symbol',
        currency: shout.currency,
      }) : 0;
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
                { property: 'og:type', content: `ogPrefix:${shout.type}` },
                { property: 'ogPrefix:price', content: price },
                { property: 'ogPrefix:username', content: shout.profile.username },
                { name: 'twitter:card', content: 'product' },
                { name: 'twitter:label1', content: capitalize(shout.type) },
                { name: 'twitter:data1', content: price },
                { name: 'twitter:label2', content: 'Location' },
                { name: 'twitter:data2', content: formatLocation(shout.location, { locale }) },
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
  loggedUser: getLoggedUser(state),
  locale: getCurrentLocale(state),
  shout: state.entities.shouts[ownProps.params.id] ?
    denormalize(state.entities.shouts[ownProps.params.id], state.entities, 'SHOUT') :
    undefined,
  relatedShouts: state.paginated.relatedShoutsByShout[ownProps.params.id] ?
    state.paginated.relatedShoutsByShout[ownProps.params.id].ids.map(id => denormalize(state.entities.shouts[id], state.entities, 'SHOUT')) :
    undefined,
});

const WrappedShout = connect(mapStateToProps)(injectIntl(Shout));
WrappedShout.fetchData = Shout.fetchData;
export default WrappedShout;
