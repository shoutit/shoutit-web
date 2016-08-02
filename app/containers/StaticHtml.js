/* eslint-env browser */

import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

import { getStaticHtml, getStaticContent } from '../reducers/staticHtml';

import { loadStaticHtml } from '../actions/staticHtml';
import { routeError } from '../actions/server';

import Page, { Body } from '../layout/Page';
import Progress from '../widgets/Progress';

const fetchData = (dispatch, state, params) => {
  const content = getStaticContent(state.staticHtml);

  if (content) {
    return;
  }

  Promise.all([
    dispatch(loadStaticHtml(params.pageName)),
  ]).catch(error => dispatch(routeError(error)));
};

export class StaticHtml extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    firstRender: PropTypes.bool,
    staticHtml: PropTypes.object.isRequired,
  };

  static fetchData = fetchData;

  componentDidMount() {
    const { dispatch, firstRender, params, staticHtml } = this.props;
    if (!firstRender) {
      fetchData(dispatch, { staticHtml }, params);
    }
  }

  componentWillUpdate(nextProps) {
    const { dispatch, params: { pageName } } = this.props;
    if (nextProps.params.pageName !== pageName) {
      fetchData(dispatch, { staticHtml: nextProps.staticHtml }, nextProps.params);
    }
  }

  render() {
    const { staticHtml: { isFetching, content } } = this.props;

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
  staticHtml: getStaticHtml(state),
});

const Wrapped = connect(mapStateToProps)(StaticHtml);

Wrapped.fetchData = StaticHtml.fetchData;

export default Wrapped;
