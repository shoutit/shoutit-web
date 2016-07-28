/* eslint-env browser */

import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

import { PaginationPropTypes } from '../utils/PropTypes';

import { loadStaticResource } from '../actions/staticPages';
import { routeError } from '../actions/server';

import Page, { Body } from '../layout/Page';
import Progress from '../widgets/Progress';

const fetchData = (dispatch, state, params) => {
  Promise.all([
    dispatch(loadStaticResource(params.resource_path)),
  ]).catch(error => dispatch(routeError(error)));
};

export class Static extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    firstRender: PropTypes.bool,
    staticPages: PropTypes.object.isRequired,
    ...PaginationPropTypes,
  };

  static fetchData = fetchData;

  componentDidMount() {
    const { dispatch, firstRender, params } = this.props;
    if (!firstRender) {
      fetchData(dispatch, {}, params);
    }
  }

  componentWillUpdate(nextProps) {
    const { dispatch, params: { resource_path } } = this.props;
    if (nextProps.params.resource_path !== resource_path) {
      fetchData(dispatch, {}, nextProps.params);
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
  staticPages: state.staticPages,
});

const Wrapped = connect(mapStateToProps)(Static);

Wrapped.fetchData = Static.fetchData;

export default Wrapped;
