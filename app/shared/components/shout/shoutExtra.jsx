import React from 'react';
import {Link} from 'react-router';
import {ItemProp, ItemScope} from '../helper/microdata';
import currency from '../../consts/currencies';
import {Column, Grid, ReactVisible, Image, Progress} from '../helper';
import GridShout from '../feed/feed/gridShout/gridShoutItem.jsx';

export default React.createClass({
  displayName: "ShoutExtra",

  renderUserShouts() {
    const {extra} = this.props;

    if (extra.more && extra.more.offers) {
      const moreShouts = extra.more.offers;

      if (extra.more && extra.more.loading) {
        return (<Progress />);
      } else if (!moreShouts.length) {
        return null;
      } else {
        return (
          <Grid fluid={true}>
            <h3 className="extra-title">more shouts by this user</h3>
            {moreShouts.map((shout, idx) => (
              <GridShout shout={shout}
                         creator={this.props.creator}
                         index={idx}
                         key={'grid-' + idx}/>
            ))}
          </Grid>
        );
      }
    }
  },

  renderRelatedShouts() {
    const {extra} = this.props;

    if (extra.related && extra.related.res) {
      const relatedShouts = extra.related.res;

      if (extra.more && extra.more.loading) {
        return (<Progress />);
      } else if (!relatedShouts.length) {
        return null;
      } else {
        return (
          <Grid fluid={true}>
            <h3 className="extra-title">related shouts</h3>
            {relatedShouts.map((shout, idx) => (
              <GridShout shout={shout}
                         creator={shout.user}
                         index={idx}
                         key={'grid-' + idx}/>
            ))}
          </Grid>
        );
      }
    }
  },

  render() {
    return (
      <div className="shout-extra">
        {this.renderUserShouts()}
        {this.renderRelatedShouts()}
      </div>
    );

  }
});
