import {RouteHandler} from 'react-router';
import React from 'react';

export default React.createClass({
    displayName: "Root",

    render() {
        return (
            <RouteHandler flux={this.props.flux}/>
        );
    }
});
