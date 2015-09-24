import React from 'react';
import {NavItem, OverlayMixin, Button} from 'react-bootstrap';
import Icon from '../../helper/icon.jsx';
import ShoutModal from '../../shouting/shoutModal.jsx';

export default React.createClass({
    displayName: "ShoutModalTrigger",

    mixins: [OverlayMixin],

    getInitialState() {
        return {
            isModalOpen: false
        };
    },

    toggle() {
        this.setState({
            isModalOpen: !this.state.isModalOpen
        });
    },

    show() {
        this.setState({isModalOpen: true});
    },

    close() {
        this.setState({isModalOpen: false});
    },

    render() {
        return (
            <NavItem onSelect={this.show}>
                <Button className="shout-btn">
                    + Create Shout
                </Button>
            </NavItem>
        );
    },

    renderOverlay() {
        if (!this.state.isModalOpen) {
            return <span/>;
        }

        return (
            <ShoutModal flux={this.props.flux} onRequestHide={this.close}/>
        );
    }
});
