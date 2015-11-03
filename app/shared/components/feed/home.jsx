import {RouteHandler} from 'react-router';
import React from 'react';
import Header from '../header/header.jsx';
import {FluxMixin} from 'fluxxor';

export default React.createClass({
    displayName: "Home",
    mixins: [new FluxMixin(React)],

    render() {
        return (
            <div>
                <Header flux={this.getFlux()} />
                <RouteHandler {...this.props}/>
            </div>
        );
    }
});
