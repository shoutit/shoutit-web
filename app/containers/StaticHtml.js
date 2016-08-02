/* eslint-env browser */

import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

import { getStaticHtml } from '../reducers/staticHtml';

import { loadStaticHtml } from '../actions/staticHtml';
import { routeError } from '../actions/server';

import Page, { Body } from '../layout/Page';
import Progress from '../widgets/Progress';

const fetchData = (dispatch, state, params) => {
  if (getStaticHtml(state, params.pageName)) {
    return Promise.resolve();
  }

  return dispatch(loadStaticHtml(params.pageName))
    .catch(error => dispatch(routeError(error)));
};

export class StaticHtml extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    firstRender: PropTypes.bool,
    staticHtml: PropTypes.object,
  };

  static fetchData = fetchData;

  componentDidMount() {
    const { dispatch, firstRender, params } = this.props;
    if (!firstRender) {
      fetchData(dispatch, {}, params);
    }
  }

  componentWillUpdate(nextProps) {
    const { dispatch, params: { pageName } } = this.props;
    if (nextProps.params.pageName !== pageName) {
      fetchData(dispatch, {}, nextProps.params);
    }
  }

  render() {
    const { staticHtml = {} } = this.props;

    return (
      <Page>
        <Body>
          { staticHtml.isFetching &&
            <Progress animate={ staticHtml.isFetching } />
          }
          { !staticHtml.isFetching && staticHtml.content &&
            <div dangerouslySetInnerHTML={ { __html: staticHtml.content } }></div>
          }
        </Body>
      </Page>
    );
  }

}

const mapStateToProps = (state, ownProps) => ({
  staticHtml: getStaticHtml(state, ownProps.params.pageName),
});

const Wrapped = connect(mapStateToProps)(StaticHtml);

Wrapped.fetchData = StaticHtml.fetchData;

export default Wrapped;
