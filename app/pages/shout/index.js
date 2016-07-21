import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { getShout } from '../../reducers/entities/shouts';

import { routeError } from '../../actions/server';
import { loadShout } from '../../actions/shouts';

import Page, { Body, EndColumn } from '../../layout/Page';
import Card from '../../layout/Card';

import NewlineToBreak from '../../widgets/NewlineToBreak';
import ProfileListItem from '../../users/ProfileListItem';

import { Desktop, Smartphone } from '../../utils/MediaQueries';

import TimeAgo from '../../widgets/TimeAgo';
import Gallery from '../../widgets/Gallery';
import Location from '../../location/Location';

import ShoutCategory from './ShoutCategory';

import './ShoutPage.scss';

const fetchData = (dispatch, state, params) =>
  dispatch(loadShout(params.id))
    .catch(err => dispatch(routeError(err)));

class ShoutPage extends Component {

  static propTypes = {
    shout: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    firstRender: PropTypes.bool,
    params: PropTypes.object,
  }
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

  render() {
    const { shout } = this.props;
    if (!shout) {
      return <p>Loading</p>;
    }
    const showGallery = (shout.images && shout.images.length > 0 || shout.videos && shout.videos.length > 0);
    return (
      <div className="ShoutPage">
        <Page>
          <Body>
            <Card block className="ShoutPage-MainCard">
              <div className="ShoutPage-Header">
                <div className="ShoutPage-Header-profile">
                  <ProfileListItem popover={ false } profile={ shout.profile } />
                </div>
                <div className="ShoutPage-Header-date">
                  <TimeAgo date={ shout.datePublished } />
                </div>
              </div>

              { shout.title &&
                <Smartphone>
                  <h1>{ shout.title }</h1>
                </Smartphone>
              }

              { showGallery &&
                <div className="ShoutPage-Gallery">
                  <Gallery
                    images={ shout.images }
                    videos={ shout.videos }
                  />
                </div>
              }
              { shout.text &&
                <div>
                  <h2>Description</h2>
                  <NewlineToBreak>
                    { shout.text }
                  </NewlineToBreak>
                </div>
              }
              { shout.category &&
                <div>
                  <h2>Details</h2>
                  <ShoutCategory shout={ shout } />
                </div>
              }

              <h2>Location</h2>
              <Location location={ shout.location } />,

            </Card>
          </Body>
          <EndColumn wide>
            <Card block className="ShoutPage-AsideCard">
              { shout.title &&
                <Desktop>
                  <h1>{ shout.title }</h1>
                </Desktop>
              }
            </Card>
          </EndColumn>
        </Page>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  shout: getShout(state, ownProps.params.id),
});

export default connect(mapStateToProps)(ShoutPage);
