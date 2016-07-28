import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import { getShout } from '../../reducers/entities/shouts';

import { routeError } from '../../actions/server';
import { loadShout } from '../../actions/shouts';

import Page, { Body, EndColumn } from '../../layout/Page';
import Panel from '../../layout/Panel';

import Device from '../../utils/Device';

import Progress from '../../widgets/Progress';
import Gallery from '../../widgets/Gallery';
import NewlineToBreak from '../../widgets/NewlineToBreak';
import Share from '../../widgets/Share';

import ShoutPageHelmet from './ShoutPageHelmet';
import ShoutPageCategory from './ShoutPageCategory';
import ShoutPageHeader from './ShoutPageHeader';
import ShoutPagePrice from './ShoutPagePrice';
import ShoutPageActions from './ShoutPageActions';
import ShoutPageLocation from './ShoutPageLocation';
import ShoutPageRelated from './ShoutPageRelated';

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
      return <Progress animate />;
    }
    const hasImages = !!shout.thumbnail;
    const isLoadingGallery = hasImages && (!shout.images || !shout.videos);
    return (
      <div className="ShoutPage">
        <Page>
          <ShoutPageHelmet shout={ shout } />
          <Device type="tablet,smartphone">
            <ShoutPageHeader shout={ shout } />
          </Device>
          <Body>
            <Panel block className="ShoutPage-MainCard">

              <Device type="desktop">
                <ShoutPageHeader shout={ shout } />
              </Device>

              { shout.title &&
                <Device type="tablet,smartphone">
                  <h1>{ shout.title }</h1>
                </Device>
              }
              { hasImages &&
                <div className="ShoutPage-Gallery">
                  { isLoadingGallery && <Progress animate /> }
                  { !isLoadingGallery &&
                    <Gallery
                      images={ shout.images }
                      videos={ shout.videos }
                    />
                  }
                </div>
              }

              <Device type="tablet,smartphone">
                <ShoutPagePrice shout={ this.props.shout } />
              </Device>

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
            </Panel>
          </Body>
          <EndColumn sticky wide>
            <Panel block className="ShoutPage-AsideCard">
              { shout.title &&
                <Device type="desktop">
                  <h1>{ shout.title }</h1>
                  <ShoutPagePrice shout={ shout } />
                </Device>
              }
              <ShoutPageActions shout={ shout } />
            </Panel>
          </EndColumn>
        </Page>
        <ShoutPageRelated shoutId={ this.props.params.id } />
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  shout: getShout(state, ownProps.params.id),
});

export default connect(mapStateToProps)(ShoutPage);
