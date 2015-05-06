import React from 'react';
import {FluxMixin, StoreWatchMixin} from 'fluxxor';
import TopBar from './topBar.jsx';
import MainMenu from './mainMenu.jsx';

module.exports = React.createClass({
    displayName: "Header",
    mixins: [FluxMixin(React), StoreWatchMixin("users")],

    getStateFromFlux() {
        return this.getFlux().store("users").getState();
    },

    render() {
        return (
            <header>
                <TopBar {...this.state} onLogoutClicked={this.onLogoutClicked}/>
                <MainMenu {...this.state} />
            </header>
        );
    },

    onLogoutClicked() {
        this.getFlux().actions.logout();
    }
});
