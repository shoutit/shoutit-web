import React from 'react';
import {FluxMixin, StoreWatchMixin} from 'fluxxor';
import TopBar from './topBar.jsx';
import MainMenu from './mainMenu.jsx';

export default React.createClass({
    displayName: "Header",
    mixins: [ new FluxMixin(React), new StoreWatchMixin("users", "locations")],

    getStateFromFlux() {
        let flux = this.getFlux();
        return {
            users: flux.store("users").getState(),
            locations: flux.store("locations").getState()
        };
    },

    render() {
        return (
            <header>
                <TopBar {...this.state.users} flux={this.getFlux()} onLogoutClicked={this.onLogoutClicked}/>
                <MainMenu {...this.state.locations} />
            </header>
        );
    },

    onLogoutClicked() {
        this.getFlux().actions.logout();
    }
});
