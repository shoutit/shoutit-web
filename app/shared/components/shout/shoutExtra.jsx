import React from 'react';
import {Link} from 'react-router';
import {Image, Progress} from '../helper';
import {ItemProp, ItemScope} from '../helper/microdata';
import currency from '../../consts/currencies';
import {Column, Grid, ReactVisible} from '../helper';
import GridShout from '../feed/feed/gridShout/gridShoutItem.jsx';

export default React.createClass({
    displayName: "ShoutExtra",

    renderUserShouts() {
        let extra = this.props.extra;
        let moreShouts = extra.more? extra.more.offers: [];

        try {
            if(extra.more.loading) {
                return (<Progress />);
            } else {
                if(moreShouts.length) {
                    return (
                        <div>
                            <h3 className="extra-title">more shouts by this user</h3>
                            {moreShouts.map((shout, idx) => (
                                <GridShout shout={shout}
                                           creator={this.props.creator}
                                           index={idx}
                                           key={'grid-' + idx}/>
                            ))}
                        </div>
                    );
                }
            }
        } catch(e) {
            console.log(e);
        }
    },

    renderRelatedShouts() {
        let extra = this.props.extra;
        let relatedShouts = extra.related? extra.related.res: [];

        try {
            if(extra.more.loading) {
                return (<Progress />);
            } else {
                if(relatedShouts.length) {
                    return (
                        <div>
                            <h3 className="extra-title">related shouts</h3>
                            {relatedShouts.map((shout, idx) => (
                                <GridShout shout={shout}
                                           creator={shout.user}
                                           index={idx}
                                           key={'grid-' + idx}/>
                            ))}
                        </div>
                    );
                }
            }
        } catch(e) {
            console.log(e);
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
