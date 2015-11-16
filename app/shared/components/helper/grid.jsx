import React from 'react';

export default React.createClass({
    displayName: "Grid",
    render() {
        let className = "si-container" + " " + (this.props.className || "");
        return (
            <div className={className}>
                {this.props.children}
            </div>
        )
    }
});