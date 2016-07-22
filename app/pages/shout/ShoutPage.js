import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import { getShout } from '../../reducers/entities/shouts';

import { routeError } from '../../actions/server';
import { loadShout } from '../../actions/shouts';

import Page, { Body, EndColumn } from '../../layout/Page';
import Card from '../../layout/Card';

import { Desktop, Smartphone } from '../../utils/MediaQueries';

import Gallery from '../../widgets/Gallery';
import NewlineToBreak from '../../widgets/NewlineToBreak';
import Share from '../../widgets/Share';

import ShoutPageCategory from './ShoutPageCategory';
import ShoutPageHeader from './ShoutPageHeader';
import ShoutPagePrice from './ShoutPagePrice';
import ShoutPageActions from './ShoutPageActions';
import ShoutPageLocation from './ShoutPageLocation';

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
          <Smartphone>
            <ShoutPageHeader shout={ shout } />
          </Smartphone>
          <Body>
            <Card block className="ShoutPage-MainCard">

              <Desktop>
                <ShoutPageHeader shout={ shout } />
              </Desktop>

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

              <Smartphone>
                <ShoutPagePrice shout={ this.props.shout } />
              </Smartphone>

              { shout.text &&
                <NewlineToBreak>
                  { shout.text }
                </NewlineToBreak>
              }
              { shout.category &&
                <ShoutPageCategory shout={ shout } />
              }
              <ShoutPageLocation shout={ shout } />
              <div className="ShoutPage-Share">
                <h2>
                  <FormattedMessage id="shout.share" defaultMessage="Share this Shout" />
                </h2>
                <Share shareUrl={ `/shout/${shout.id}` } title={ shout.title } image={ shout.thumbnail } />
              </div>
            </Card>
          </Body>
          <EndColumn sticky wide>
            <Card block className="ShoutPage-AsideCard">
              { shout.title &&
                <Desktop>
                  <h1>{ shout.title }</h1>
                  <ShoutPagePrice shout={ shout } />
                </Desktop>
              }
              <ShoutPageActions shout={ shout } />
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
