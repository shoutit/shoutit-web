import React from 'react';
import {StoreWatchMixin} from 'fluxxor';
import {Icon} from '../helper';
import statuses from '../../consts/statuses.js';

const {LISTEN_BTN_LOADING} = statuses;

if(process.env.BROWSER) {
    require("styles/components/shelf_button.scss");
}

export default React.createClass({
    mixins: [new StoreWatchMixin('users')],
    displayName: "TagListenButton",

    getDefaultProps() {
        return {
            hasTitle: true
        }
    },

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
                    name: nextProps.tag.name,
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
            clickable = true,
            title = "Listen",
            iconName = "listen",
            className = "si-shelf-button";

        // no need to load Listening button if user is not logged in
        if (this.state.loggedIn) {
            let isListening = tag.is_listening;

            if(isListening) {
                title = "Listening";
                iconName = "listening_to";
            }

            if(tag.fluxStatus === LISTEN_BTN_LOADING) {
                title = "[Loading]";
                className = className + " loading";
            }
        } else {
            clickable = false;
            className = className + " disabled";
        }

        return (
            <div className={className} onClick={clickable? this.toggleListen: null}>
                <div className="img-holder">
                    <Icon name={iconName} />
                </div>
                {this.props.hasTitle?
                    <div className="text-holder">
                        {title}
                    </div>
                    :null
                }
            </div>
        );
    },

    toggleListen() {
        const { tag, onStopListenTag, onListenTag } = this.props;

        if (tag.is_listening) {
            onStopListenTag(tag.name);
        } else {
            onListenTag(tag.name);
        }
    }
});
