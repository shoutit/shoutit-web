/* eslint-env browser */

import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

import { getStaticPage } from '../reducers/staticPages';

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
    staticPage: PropTypes.object.isRequired,
  };

  static fetchData = fetchData;

  componentDidMount() {
    const { dispatch, firstRender, params, staticPage } = this.props;
    if (!firstRender) {
      fetchData(dispatch, { staticPage }, params);
    }
  }

  componentWillUpdate(nextProps) {
    const { dispatch, params: { resource_path } } = this.props;
    if (nextProps.params.resource_path !== resource_path) {
      fetchData(dispatch, { staticPage: nextProps.staticPage }, nextProps.params);
    }
  }

  render() {
    const { staticPage: { isFetching, content } } = this.props;

    return (
      <Page>
        <Body>
          <Progress animate={ isFetching } />
          { !isFetching && content &&
            <div dangerouslySetInnerHTML={ { __html: content } }></div>
          }
        </Body>
      </Page>
    );
  }

}

const mapStateToProps = state => ({
  staticPage: getStaticPage(state),
});

const Wrapped = connect(mapStateToProps)(Static);

Wrapped.fetchData = Static.fetchData;

export default Wrapped;
