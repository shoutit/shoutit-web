import React, { Component, PropTypes } from 'react';
import { loadStaticPages } from '../actions/staticPages';

import Card from '../layout/Card';
import Page, { Body } from '../layout/Page';
import Frame from '../layout/Frame';
import Helmet from '../utils/Helmet';

const fetchData = (dispatch, state, params) =>
  dispatch(loadStaticPages(params.id))
      .catch(err => dispatch(routeError(err)));

class StaticPages extends Component {
  
  static propTypes = {
    intl: PropTypes.object,//.isRequired,
  };
  //why the need to declare here?
  static fetchData = fetchData;

  componentDidMount() {
    const { dispatch, firstRender, params } = this.props;
    if (!firstRender) {
      fetchData(dispatch, {}, params);
    }
  }

  componentWillUpdate(nextProps) {
    const { dispatch, params } = this.props;
    if (nextProps.params.id !== params.id) {
      fetchData(dispatch, {}, nextProps.params);
    }
  }

  render () {
      console.log('fetch that data son', fetchData);

    const { tos } = this.props;
    return (
	<Page>
	<Body>
	<Card block className="ShoutPage-MainCard">
	<div><span>let see what happens</span></div>
	</Card>
	</Body>
	</Page>
    );
  }
}
//I have removed injectIntl decorator because I think we will use a different strategy for localization please let me know.
export default StaticPages;
