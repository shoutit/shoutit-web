import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import find from 'lodash/collection/find';

import { denormalize } from '../schemas';
import { loadTagIfNeeded, loadTagShouts, loadRelatedTags } from '../actions/tags';
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

  const searchParams = state.currentLocation;

  return Promise.all([
    dispatch(loadTagIfNeeded({ name: params.name }, properties))
      .then(payload =>
        dispatch(loadRelatedTags({ id: payload.result, name: params.name })).catch(() => {}),
        err => dispatch(routeError(err))
      ),
    dispatch(loadTagShouts(params.name, searchParams)).catch(() => {}),
  ]);
}
;
export class Interest extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    firstRender: PropTypes.bool,
    isFetchingShouts: PropTypes.bool,
    nextShoutsUrl: PropTypes.string,
    shouts: PropTypes.array,
    shoutsCount: PropTypes.number,
    tag: PropTypes.object,
  };

  static fetchData = fetchData;

  componentDidMount() {
    const { dispatch, firstRender, params } = this.props;
    if (!firstRender) {
      fetchData(dispatch, {}, params);
    }
  }

  componentWillUpdate(nextProps) {
    const { dispatch, params: { name } } = this.props;
    if (nextProps.params.name !== name) {
      fetchData(dispatch, {}, nextProps.params);
    }
  }

  render() {
    const { tag, shouts, isFetchingShouts, nextShoutsUrl, dispatch } = this.props;
    return (
      <Scrollable
        triggerOffset={ 400 }
        scrollElement={ () => window }
        onScrollBottom={ () => {
          if (nextShoutsUrl && !isFetchingShouts) {
            dispatch(loadTagShouts(tag.name, {}, nextShoutsUrl));
          }
        }}
      >
        <Page title="Tag"
          stickyStartColumn
          startColumn={ [
            <Card>
              <TagPreview style={{ width: '100%' }} id={ tag.id } />
            </Card>,
          ]}
          endColumn={ [
            <RelatedTags key="related" tag={ tag } />,
            <SuggestedProfiles key="profiles" />,
            <SuggestedShout key="shout" />,
          ] }
        >
          { !tag && <Progress animate /> }

          { tag &&
            <div className="Interest-shouts">
              { shouts.length > 0 &&
                <ShoutsList shouts={ shouts } showCategory={ false } />
              }
              <Progress
                animate={ isFetchingShouts }
                label={ shouts.length === 0 ? 'Loading shouts…' : 'Loading more shouts…'} />
            </div>
          }
        </Page>
      </Scrollable>
    );
  }

}

const mapStateToProps = (state, ownProps) => {
  const { params: { name } } = ownProps;
  const { paginated, entities } = state;
  const tag = find(entities.tags, { name });
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
    shouts,
    shoutsCount,
    isFetchingShouts,
    nextShoutsUrl,
  };
};

export default connect(mapStateToProps)(Interest);
