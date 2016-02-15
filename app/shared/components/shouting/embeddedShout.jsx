import React from 'react';
import {StoreWatchMixin} from 'fluxxor';
import {Icon, Column} from '../helper';
import ShoutForm from './form/shoutForm.jsx';

export default React.createClass({
    displayName: "EmbeddedShout",
    mixins: [new StoreWatchMixin('shouts')],

    contextTypes: {
        flux: React.PropTypes.object
    },

    propTypes: {
        collapsed: React.PropTypes.bool
    },

    getInitialState() {
        return {
            collapsed: this.props.collapsed
        }
    },

    getStateFromFlux() {
        let flux = this.context.flux,
            shouts = flux.store('shouts').getState(),
            loc = flux.store('locations').getState().current,
            users = flux.store('users').getState(),
            user = users.user? users.users[users.user]: null;
        return {
            currencies: shouts.currencies,
            categories: shouts.categories,
            draft: shouts.draft,
            current: loc,
            status:shouts.status,
            waiting: shouts.waiting,
            user: user
        };
    },

    onFocus(ev) {
        if(ev.focused) {
            this.setState({collapsed: false});
        } else {
            this.setState({collapsed: true});
        }
    },

    render() {
        let user = this.state.user;
        let view;
        // stop rendering element if user is not logged in
        view = user? <ShoutForm {...this.state}
                                collapsed={this.state.collapsed}
                                onUserFocus={this.onFocus}
                                flux={this.context.flux}/>
                                : null;

        return (
            <Column size="9" clear={true}>
                {view}
            </Column>
        );
    }
});
/*
<ShoutForm {...this.state}
    flux={this.context.flux}/>
 */