import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { loadShout, loadRelatedShouts } from '../actions/shouts';
import { startyShoutReply } from '../actions/chat';
import { routeError } from '../actions/server';

import Page from '../layout/Page';
import Footer from '../layout/Footer';
import ProfileListItem from '../users/ProfileListItem';
import ProfileOverlay from '../users/ProfileOverlay';

import CategoryListItem from '../shouts/CategoryListItem';
import ShoutPrice from '../shouts/ShoutPrice';
import ShoutPreview from '../shouts/ShoutPreview';

import Button from '../ui/Button';
import Card from '../ui/Card';
import Gallery from '../ui/Gallery';
import ListItem from '../ui/ListItem';
import NewlineToBreak from '../ui/NewlineToBreak';
import Progress from '../ui/Progress';
import SVGIcon from '../ui/SVGIcon';
import TimeAgo from '../ui/TimeAgo';

import { denormalize } from '../schemas';

if (process.env.BROWSER) {
  require('./Shout.scss');
}

const fetchData = (dispatch, state, params) =>
  Promise.all([
    dispatch(loadShout(params.id)).catch(err => dispatch(routeError(err))),
    dispatch(loadRelatedShouts(params.id, { page_size: 6 })),
  ]);

function ShoutBuy({ shout, onReplyClick }) {
  return (
    <div className="ShoutBuy">
      <ShoutPrice shout={ shout } layout="plain" />
      <Button onClick={ onReplyClick } size="small" primary leftIcon = { <SVGIcon fill name="balloon-dots" /> } label="Reply to this shout" />

      <p className="htmlAncillary">
        Start chatting with { shout.profile.firstName } if you are interested on this.
      </p>
    </div>
  );
}

ShoutBuy.propTypes = {
  shout: PropTypes.object.isRequired,
  onReplyClick: PropTypes.object.isRequired,
};

export class Shout extends Component {

  static propTypes = {
    shout: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    firstRender: PropTypes.bool,
    relatedShouts: PropTypes.array,
    params: PropTypes.object,
    loggedUser: PropTypes.object,
  };

  static fetchData = fetchData;

  componentDidMount() {
    const { dispatch, firstRender, params } = this.props;
    if (!firstRender) {
      fetchData(dispatch, {}, params);
    }
  }

  componentWillUpdate(nextProps) {
    const { dispatch, params: { id } } = this.props;
    if (nextProps.params.id !== id) {
      fetchData(dispatch, {}, nextProps.params);
    }
  }

  startyShoutReply() {
    const { loggedUser, shout, dispatch } = this.props;
    dispatch(startyShoutReply(loggedUser, shout));
  }

  renderEndColumn() {
    const { shout } = this.props;

    return [
      <ShoutBuy shout={ shout } onReplyClick={ () => this.startyShoutReply() } />,
      <Card block key="profile">
        <ProfileOverlay style={{ width: '100%' }} id={ shout.profile.id } />
      </Card>,
    ];
  }

  renderRelatedShouts() {
    const { relatedShouts } = this.props;
    if (!relatedShouts || relatedShouts.length === 0) {
      return null;
    }

    return (
      <div className="Shouts-related">
        <h2>Related shouts</h2>
        <div className="Shouts-related-wrapper">
          { relatedShouts.map(shout => <ShoutPreview shout={ shout } />) }
        </div>
      </div>
    );
  }

  renderShout() {
    const { shout } = this.props;
    return (
      <div className="Shout">

        <div className="Shout-title">
          <h1>{ shout.title || shout.text }</h1>
          <div className="Shout-header">
            <ProfileListItem tooltipPlacement="bottom" profile={ shout.profile } />
            <ListItem size="small" start={ <SVGIcon name="clock" size="small" /> }>
              <TimeAgo date={ shout.datePublished } />
            </ListItem>
            <ListItem size="small" start={ <SVGIcon size="small" name="location" /> }>
              { shout.location.city || shout.location.state || shout.location.country }
            </ListItem>
            <CategoryListItem size="small" category={ shout.category } />
          </div>
        </div>

        { (shout.images || shout.videos) &&
          <div className="Shout-gallery">
            <Gallery images={ shout.images || undefined } videos={ shout.videos || undefined } />
          </div>
        }

        <div className="Shout-body">
          <div className="Shout-text">
            <p>
              <NewlineToBreak>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </NewlineToBreak>
            </p>
          </div>
          <div className="Shout-card">
            <ListItem start={ <SVGIcon name="clock" /> }>
              <TimeAgo date={ shout.datePublished } />
            </ListItem>

            <CategoryListItem size="medium" category={ shout.category } />
            <ListItem start={ <SVGIcon name="location" /> }>
              { shout.location.city || shout.location.state || shout.location.country }
            </ListItem>

            <ShoutBuy shout={ shout } onReplyClick={ () => this.startyShoutReply() } />

          </div>
        </div>
      </div>
    );
  }

  render() {
    const { shout } = this.props;

    return (
      <div>
      <Page title="Shout"
        className="ShoutPage"
        miniFooter={ false }
        stickyEndColumn
        endColumn={ this.renderEndColumn() }>

        { !shout && <Progress animate /> }

        { shout && this.renderShout() }
      </Page>

      { shout && this.renderRelatedShouts() }

      <Footer />
      </div>
    );
  }

}

const mapStateToProps = (state, ownProps) => ({
  loggedUser: state.session.user,
  shout: state.entities.shouts[ownProps.params.id] ?
    denormalize(state.entities.shouts[ownProps.params.id], state.entities, 'SHOUT') :
    undefined,
  relatedShouts: state.paginated.relatedShoutsByShout[ownProps.params.id] ?
    state.paginated.relatedShoutsByShout[ownProps.params.id].ids.map(id => denormalize(state.entities.shouts[id], state.entities, 'SHOUT')) :
    undefined,
});

export default connect(mapStateToProps)(Shout);
