/*
* This component is created only for popup shout
* For embedded shout use embeddedShout.jsx
* github/p0o
*/
import React from 'react';
import {Dialog} from 'material-ui';
import {StoreWatchMixin} from 'fluxxor';
import ShoutForm from './form/shoutForm.jsx';

export default React.createClass({
    displayName: 'NewShoutButton',
    mixins: [new StoreWatchMixin('shouts')],

    getInitialState() {
        return {
            popup: false
        }
    },

    getStateFromFlux() {
        let flux = this.props.flux,
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

    renderPopup() {
        let user = this.state.user;
        let view;
        // stop rendering element if user is not logged in
        view = user? <ShoutForm {...this.state}
                                collapsed={false}
                                onShoutSent={this.onShoutSent}
                                flux={this.props.flux}/>
                                : null;
        return (
            <Dialog open={this.state.popup}
                    onRequestClose={this.popupCloseHandle}
                    autoDetectWindowHeight={true}
                    autoScrollBodyContent={true}
                    bodyStyle={{borderRadius: '5px'}}
                    contentClassName="new-shout-popup"
                    >
                {view}
            </Dialog>
            );
    },

    clickHandle() {
        this.setState({popup: true});
    },

    popupCloseHandle() {
        this.setState({popup: false});
    },

    onShoutSent(check) {
        if(check) {
            this.setState({popup: false});
        }
    },

    render() {
        
        return (
            <div>
                <span className="new-shout-button" onClick={this.clickHandle}>Create Shout</span>
                {this.renderPopup()}
            </div>
        );
    }
});