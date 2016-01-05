import React from 'react';
import { StoreWatchMixin} from 'fluxxor';
import {Icon} from '../helper';
import statuses from '../../consts/statuses';

const {LISTEN_BTN_LOADING} = statuses;

export default React.createClass({
    mixins: [ new StoreWatchMixin('users')],
    displayName: "listenButton",

    propTypes: {
        flux: React.PropTypes.object.isRequired,
        username: React.PropTypes.string.isRequired,
        onChange: React.PropTypes.func,
        hasTitle: React.PropTypes.bool
    },

    getDefaultProps() {
        return {
            hasTitle: true
        }
    },

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
                    isListening: nextState.user.is_listening,
                    username: nextState.user.username,
                    name: nextState.user.name
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
            clickable = true,
            title = "Listen",
            iconName = "listen",
            className = "si-shelf-button";

        // disable Listening button if user is not logged in
        if (this.state.loggedUser) {
            let isListening = user.is_listening;

            if(isListening) {
                title = "Listening";
                iconName = "listening_to";
            }

            if(user.fluxStatus === LISTEN_BTN_LOADING) {
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
                    <Icon name={iconName} style={{margin: '0 auto'}}/>
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
        let user = this.state.user;

        if (user.is_listening) {
            this.props.flux.actions.stopListen(user.username);
        } else {
            this.props.flux.actions.listen(user.username);
        }
    }
});
