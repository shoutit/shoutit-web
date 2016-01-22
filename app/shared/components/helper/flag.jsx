import React from 'react';

export default React.createClass({
    displayName: "Flag",

    propTypes: {
        country: React.PropTypes.string,
        size: React.PropTypes.string
    },

    getDefaultProps() {
        return {
            size: "32"
        }
    },

    render() {
        let countryFlag = "http://i.imgur.com/rfZuNla.png";
        let compProps = {
            style: {height: this.props.size + "px"},
            src: countryFlag,
        };

        if(this.props.className) {
            compProps.className = this.props.className;
        }

        return (
            <img {...compProps} />
        );
    }

});