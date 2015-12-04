import React from 'react';

export default React.createClass({
    displayName: "Column",

    getDefaultProps() {
        return {
            fluid: false,
            clear: false,
            offset: 0,
            style: {}
        }
    },

    render() {
        let className = this.props.fluid? "fluid-grid-" + this.props.size: "grid-" + this.props.size;
        this.props.className? className += " " + this.props.className: undefined;
        this.props.offset? className += " offset-" + this.props.offset: undefined;
        this.props.clear? className += " clear": undefined;

        return (
            <div className={className} style={this.props.style}>
                {this.props.children}
            </div>
        )
    }
});