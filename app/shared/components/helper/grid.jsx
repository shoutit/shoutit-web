import React from 'react';

export default React.createClass({
    displayName: "Grid",

    getDefaultProps() {
        return {
            fluid: false,
            style: {}
        }
    },

    render() {
        let className = this.props.fluid?
                "si-fluid-container" + " " + (this.props.className || ""):
                "si-container" + " " + (this.props.className || "");
        return (
            <div className={className} style={this.props.style}>
                {this.props.children}
            </div>
        )
    }
});