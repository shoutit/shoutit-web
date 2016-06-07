import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import find from 'lodash/find';
import Helmet from '../utils/Helmet';

import { denormalize } from '../schemas';
import { loadTagIfNeeded, loadTagShouts, loadRelatedTags, invalidateTagShouts } from '../actions/tags';
import { routeError } from '../actions/server';

import Page from '../layout/Page';
import RelatedTags from '../tags/RelatedTags';
import TagPreview from '../tags/TagPreview';
import SuggestedProfiles from '../users/SuggestedProfiles';
import SuggestedShout from '../shouts/SuggestedShout';
import ShoutsList from '../shouts/ShoutsList';
import Progress from '../ui/Progress';
import Card from '../ui/Card';
import Scrollable from '../ui/Scrollable';

if (process.env.BROWSER) {
  require('./Interest.scss');
}

const properties = ['listenersCount', 'isListening'];

const fetchData = (dispatch, state, params) => {
  return Promise.all([
    dispatch(loadTagIfNeeded({ name: params.name }, properties))
      .then(payload =>
        dispatch(loadRelatedTags({ id: payload.result, name: params.name })).catch(() => {}),
        err => dispatch(routeError(err))
      ),
    dispatch(loadTagShouts(params.name, state.currentLocation)).catch(() => {}),
  ]);
}
;
export class Interest extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    currentLocation: PropTypes.object.isRequired,
    firstRender: PropTypes.bool,
    isFetchingShouts: PropTypes.bool,
    nextShoutsUrl: PropTypes.string,
    shouts: PropTypes.array,
    shoutsCount: PropTypes.number,
    tag: PropTypes.object,
    category: PropTypes.object,
  };

  static fetchData = fetchData;

  componentDidMount() {
    const { dispatch, firstRender, currentLocation, params } = this.props;
    if (!firstRender) {
      fetchData(dispatch, { currentLocation }, params);
    }
  }

  componentWillUpdate(nextProps) {
    const { dispatch, params: { name }, currentLocation, tag } = this.props;
    if (nextProps.params.name !== name || currentLocation.slug !== nextProps.currentLocation.slug) {
      dispatch(invalidateTagShouts(tag));
      fetchData(dispatch, { currentLocation: nextProps.currentLocation }, nextProps.params);
    }
  }

  render() {
    const { tag, category, shouts, isFetchingShouts, nextShoutsUrl, dispatch } = this.props;
    return (
      <Scrollable
        triggerOffset={ 400 }
        scrollElement={ () => window }
        onScrollBottom={ () => {
          if (nextShoutsUrl && !isFetchingShouts) {
            dispatch(loadTagShouts(tag.name, {}, nextShoutsUrl));
          }
        } }
      >
        <Page
          stickyStartColumn
          startColumn={ [
            tag && <Card className="Interest-main-card" block style={ { width: '100%' } }>
              <TagPreview style={ { width: '100%' } } id={ tag.id } />
            </Card>,
          ] }
          endColumn={ [
            <RelatedTags key="related" tag={ tag } />,
            <SuggestedProfiles key="profiles" />,
            <SuggestedShout key="shout" />,
          ] }
        >
          { tag && <Helmet title={ category ? category.name : tag.name } images={ [tag.image] } /> }

          { !tag && <Progress animate /> }

          { tag &&
            <div className="Interest-shouts">
              { shouts.length > 0 &&
                <ShoutsList shouts={ shouts } />
              }
              <Progress animate={ isFetchingShouts } />
            </div>
          }
        </Page>
      </Scrollable>
    );
  }

}

const mapStateToProps = (state, ownProps) => {
  const { params: { name } } = ownProps;
  const { paginated, entities, currentLocation } = state;
  const tag = find(entities.tags, { name });
  const category = entities.categories[tag.name];
  let shouts = [];
  let isFetchingShouts = false;
  let shoutsCount = 0;
  let nextShoutsUrl;
  const shoutsByTagname = paginated.shoutsByTagname[name];
  if (shoutsByTagname) {
    isFetchingShouts = shoutsByTagname.isFetching;
    shoutsCount = shoutsByTagname.count;
    nextShoutsUrl = shoutsByTagname.nextUrl;
    shouts = shoutsByTagname.ids.map(id => denormalize(entities.shouts[id], entities, 'SHOUT'));
  }
  return {
    tag,
    category,
    shouts,
    shoutsCount,
    currentLocation,
    isFetchingShouts,
    nextShoutsUrl,
  };
};

export default connect(mapStateToProps)(Interest);
