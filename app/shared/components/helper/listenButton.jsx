import React from 'react';
import { StoreWatchMixin} from 'fluxxor';
import statuses from '../../consts/statuses';

const {LISTEN_BTN_LOADING} = statuses;

export default React.createClass({
    mixins: [ new StoreWatchMixin('users')],
    displayName: "listenButton",

    getStateFromFlux() {
        // cloning objects as a work around to avoid mutation of store objects
        let user = JSON.parse(JSON.stringify(this.props.flux.store('users').getState()
                    .users[this.props.username])),
            loggedUser = this.props.flux.store('users').getState().user;

        return { user: user , loggedUser: loggedUser };
    },

    shouldComponentUpdate(nextProps, nextState) {

        if(nextState.user.is_listening !== this.state.user.is_listening) {
            // call to inform parent for the change
            if(nextState.user.username === this.state.user.username && this.props.onChange) {
                this.props.onChange({
                    username: nextState.user.username,
                    isListening: nextState.user.is_listening
                });
            }
            
            return true;
        } else if(nextState.user.fluxStatus !== this.state.fluxStatus) {
            return true;
        } else {
            return false;
        }
    },

    render() {
        let user = this.state.user,
            btn;

        // no need to load Listening button if user is not logged in or is owner
        if (this.state.loggedUser && user.username !== this.state.loggedUser) {
            let isListening = user.is_listening;

            let title = isListening? "Listening": "Listen";
            let style = isListening? "shoutit-btn listen": "shoutit-btn not-listen";

            if(user.fluxStatus === LISTEN_BTN_LOADING) {
                title = "Loading";
                style = "shoutit-btn loading";
            }

            // The main button of this compnent
            btn = <span className={style} onClick={this.toggleListen}>{title}</span>;
        }

        return (
            <span>{btn}</span>
        );
    },

    toggleListen() {
        let user = this.state.user;

        if (user.is_listening) {
            this.props.flux.actions.stopListen(user.username);
        } else {
            this.props.flux.actions.listen(user.username);
        }
    }
});
