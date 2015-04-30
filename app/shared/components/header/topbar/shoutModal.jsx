"use strict";

var React = require('react'),
    NavItem = require('react-bootstrap').NavItem,
    OverlayMixin = require('react-bootstrap').OverlayMixin;

var Icon = require('../../helper/icon.jsx');

var ShoutModal = require('../../shouting/shoutModal.jsx');

module.exports = React.createClass({
    displayName: "ShoutModalTrigger",

    mixins: [OverlayMixin],

    getInitialState: function () {
        return {
            isModalOpen: false
        };
    },

    toggle: function () {
        this.setState({
            isModalOpen: !this.state.isModalOpen
        });
    },

    show: function () {
        this.setState({isModalOpen: true});
    },

    close: function () {
        this.setState({isModalOpen: false});
    },

    render: function () {
        return (
            <NavItem onSelect={this.show}>
                <Icon name="plug-icon"/>
            </NavItem>
        );
    },

    renderOverlay: function () {
        if (!this.state.isModalOpen) {
            return <span/>;
        }

        return (
            <ShoutModal onRequestHide={this.close}/>
        );
    }
});
