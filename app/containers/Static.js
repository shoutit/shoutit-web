/* eslint-env browser */

import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

import { PaginationPropTypes } from '../utils/PropTypes';

import { loadStaticResource } from '../actions/staticPages';

import { getCurrentLocation } from '../reducers/currentLocation';

import Page, { Body } from '../layout/Page';
import Progress from '../widgets/Progress';

const fetchData = (dispatch, state, params) => {
  Promise.all([
    dispatch(loadStaticResource(params.resource_path)),
  ]); // TODO implement catch and redirect to 404?
};

export class Static extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    currentLocation: PropTypes.object.isRequired,
    firstRender: PropTypes.bool,
    staticPages: PropTypes.object.isRequired,
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
    const { dispatch, params: { resource_path }, currentLocation } = this.props;
    if (nextProps.params.resource_path !== resource_path || currentLocation.resource_path !== nextProps.currentLocation.resource_path) {
      fetchData(dispatch, { currentLocation: nextProps.currentLocation }, nextProps.params);
    }
  }

  render() {
    const { isFetching, staticPages: { data } } = this.props;
    return (
      <Page>
        <Body>
          <Progress animate={ isFetching } />
          <div dangerouslySetInnerHTML={ { __html: data } }></div>
        </Body>
      </Page>
    );
  }

}

const mapStateToProps = state => ({
  currentLocation: getCurrentLocation(state),
  staticPages: state.staticPages,
});

const Wrapped = connect(mapStateToProps)(Static);

Wrapped.fetchData = Static.fetchData;

export default Wrapped;
