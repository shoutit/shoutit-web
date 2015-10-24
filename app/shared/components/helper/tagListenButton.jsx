import React from 'react';
import {StoreWatchMixin} from 'fluxxor';
import statuses from '../../consts/statuses.js';

const {LISTEN_BTN_LOADING} = statuses;

export default React.createClass({
    mixins: [new StoreWatchMixin('users')],
    displayName: "TagListenButton",

    getStateFromFlux() {
        let loggedIn = this.props.flux.store('users').getState().user;
        
        return {
            loggedIn
        }
    },

    shouldComponentUpdate(nextProps) {
        if(nextProps.tag.is_listening !== this.props.tag.is_listening) {
            // call parent for change
            if(nextProps.tag.name === this.props.tag.name && this.props.onChange) {
                this.props.onChange({
                    tag: nextProps.tag.name,
                    isListening: nextProps.tag.is_listening
                });
            }
            return true;
        } else if (nextProps.tag.fluxStatus !== this.props.tag.fluxStatus) {
            return true;
        } else {
            return false;
        }
    },

    render() {
        let tag = this.props.tag,
            btn;

        // no need to load Listening button if user is not logged in
        if (this.state.loggedIn) {
            let isListening = tag.is_listening;

            let title = isListening? "Listening": "Listen";
            let style = isListening? "shoutit-btn listen": "shoutit-btn not-listen";

            if(tag.fluxStatus === LISTEN_BTN_LOADING) {
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
        let tag = this.props.tag;

        if (tag.is_listening) {
            this.props.flux.actions.stopListenTag(tag.name);
        } else {
            this.props.flux.actions.listenTag(tag.name);
        }
    }
});
