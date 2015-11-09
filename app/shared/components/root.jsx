import React from 'react';

export default React.createClass({
    displayName: "Root",

    render() {
        return (
            <div>{this.props.children}</div>
        );
    }
});
