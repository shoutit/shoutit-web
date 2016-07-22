/* eslint-env browser */

import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

import { PaginationPropTypes } from '../utils/PropTypes';
import { Desktop } from '../utils/MediaQueries';
import Helmet from '../utils/Helmet';

import { loadTag, loadTagShouts, loadRelatedTags, invalidateTagShouts } from '../actions/tags';
import { routeError } from '../actions/server';

import { getTagByName } from '../reducers/entities/tags';
import { getCategory } from '../reducers/categories';
import { getCurrentLocation } from '../reducers/currentLocation';

import { getShoutsByTagname, getPaginationState } from '../reducers/paginated/shoutsByTagname';

import Page, { Body, StartColumn, EndColumn } from '../layout/Page';
import RelatedTags from '../tags/RelatedTags';
import TagPreview from '../tags/TagPreview';
import SuggestedProfiles from '../users/SuggestedProfiles';
import SuggestedShout from '../shouts/SuggestedShout';
import ShoutsList from '../shouts/ShoutsList';
import Progress from '../widgets/Progress';
import Card from '../layout/Card';
import Scrollable from '../layout/Scrollable';

import './Interest.scss';

const fetchData = (dispatch, state, params) =>
  Promise.all([
    dispatch(loadTag(params.name))
      .then(payload =>
        dispatch(loadRelatedTags({ id: payload.result, name: params.name })).catch(() => {}),
        err => dispatch(routeError(err))
      ),
    dispatch(loadTagShouts(params.name, getCurrentLocation(state))).catch(() => {}),
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
    const { dispatch, params: { name }, currentLocation, tag } = this.props;
    if (nextProps.params.name !== name || currentLocation.slug !== nextProps.currentLocation.slug) {
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
            dispatch(loadTagShouts(tag.name, {}, nextUrl));
          }
        } }>
        <Page>
          { tag && <Helmet title={ category ? category.name : tag.name } images={ [tag.image] } /> }
          <Desktop>
            <StartColumn sticky>
              {
                tag &&
                  <Card className="Interest-main-card" block style={ { width: '100%' } }>
                    <TagPreview style={ { width: '100%' } } id={ tag.id } />
                  </Card>
              }
            </StartColumn>
          </Desktop>
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
          <Desktop>
            <EndColumn footer>
              { tag &&
                <div>
                  <RelatedTags key="related" tag={ tag } />
                  <SuggestedProfiles key="profiles" />
                  <SuggestedShout key="shout" />
                </div>
              }
            </EndColumn>
          </Desktop>
        </Page>
      </Scrollable>
    );
  }

}

const mapStateToProps = (state, ownProps) => {
  const tagName = ownProps.params.name;
  const tag = getTagByName(state, tagName);
  return {
    tag,
    category: getCategory(state, tagName),
    shouts: getShoutsByTagname(state, tagName),
    currentLocation: getCurrentLocation(state),
    ...getPaginationState(state, tagName),
  };
};

const Wrapped = connect(mapStateToProps)(Interest);
Wrapped.fetchData = Interest.fetchData;

export default Wrapped;
