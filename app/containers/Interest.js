/* eslint-env browser */

import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

import { PaginationPropTypes } from '../utils/PropTypes';
import Device from '../utils/Device';
import Helmet from '../utils/Helmet';

import { loadTag, loadTagShouts, loadRelatedTags, invalidateTagShouts } from '../actions/tags';
import { routeError } from '../actions/server';

import { getTagBySlug } from '../reducers/entities/tags';
import { getCategory } from '../reducers/categories';
import { getCurrentLocation } from '../reducers/currentLocation';

import { getShoutsByTagSlug, getPaginationState } from '../reducers/paginated/shoutsByTagSlug';

import Page, { Body, StartColumn, EndColumn } from '../layout/Page';
import RelatedTags from '../tags/RelatedTags';
import TagPreview from '../tags/TagPreview';
import SuggestedProfiles from '../users/SuggestedProfiles';
import SuggestedShout from '../shouts/SuggestedShout';
import ShoutsList from '../shouts/ShoutsList';
import Progress from '../widgets/Progress';
import Panel from '../layout/Panel';
import Scrollable from '../layout/Scrollable';

import './Interest.scss';

const fetchData = (dispatch, state, params) =>
  Promise.all([
    dispatch(loadTag(params.slug))
      .then(payload =>
        dispatch(loadRelatedTags({ id: payload.result, slug: params.slug })).catch(() => {}),
        err => dispatch(routeError(err))
      ),
    dispatch(loadTagShouts(params.slug, getCurrentLocation(state))).catch(() => {}),
  ]);

export class Interest extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    currentLocation: PropTypes.object.isRequired,
    firstRender: PropTypes.bool,
    shouts: PropTypes.array,
    tag: PropTypes.object,
    category: PropTypes.object,
    ...PaginationPropTypes,
  };

  static fetchData = fetchData;

  componentDidMount() {
    const { dispatch, firstRender, currentLocation, params } = this.props;
    if (!firstRender) {
      fetchData(dispatch, { currentLocation }, params);
    }
  }

  componentWillUpdate(nextProps) {
    const { dispatch, params: { slug }, currentLocation, tag } = this.props;
    if (nextProps.params.slug !== slug || currentLocation.slug !== nextProps.currentLocation.slug) {
      dispatch(invalidateTagShouts(tag));
      fetchData(dispatch, { currentLocation: nextProps.currentLocation }, nextProps.params);
    }
  }

  render() {
    const { tag, category, shouts, isFetching, nextUrl, dispatch } = this.props;
    return (
      <Scrollable
        triggerOffset={ 400 }
        scrollElement={ () => window }
        onScrollBottom={ () => {
          if (nextUrl && !isFetching) {
            dispatch(loadTagShouts(tag.slug, {}, nextUrl));
          }
        } }>
        <Page>
          { tag && <Helmet title={ category ? category.name : tag.name } images={ [tag.image] } /> }
          <Device type="desktop">
            <StartColumn sticky>
              { tag &&
                <Panel className="Interest-main-card">
                  <TagPreview style={ { width: '100%' } } id={ tag.id } />
                </Panel>
              }
            </StartColumn>
          </Device>
          <Body>
            { !tag && <Progress animate /> }
            { tag &&
              <div className="Interest-shouts">
                { shouts.length > 0 &&
                  <ShoutsList shouts={ shouts } />
                }
                <Progress animate={ isFetching } />
              </div>
            }
          </Body>
          <Device type="desktop">
            <EndColumn footer>
              { tag &&
                <div>
                  <RelatedTags key="related" tag={ tag } />
                  <SuggestedProfiles key="profiles" />
                  <SuggestedShout key="shout" />
                </div>
              }
            </EndColumn>
          </Device>
        </Page>
      </Scrollable>
    );
  }

}

const mapStateToProps = (state, ownProps) => ({
  tag: getTagBySlug(state, ownProps.params.slug),
  category: getCategory(state, ownProps.params.slug),
  shouts: getShoutsByTagSlug(state, ownProps.params.slug),
  currentLocation: getCurrentLocation(state),
  ...getPaginationState(state, ownProps.params.slug),
});

const Wrapped = connect(mapStateToProps)(Interest);

Wrapped.fetchData = Interest.fetchData;

export default Wrapped;
