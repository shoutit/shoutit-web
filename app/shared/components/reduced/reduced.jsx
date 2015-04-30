import {RouteHandler} from 'react-router';
import React from 'react';
import {Grid} from 'react-bootstrap';
import Header from './header.jsx';

export default React.createClass({
    displayName: "Reduced",

    render() {
        return (
            <div>
                <Header flux={this.props.flux}/>
                <div className="content">
                    <Grid className="padding0">
                        <RouteHandler flux={this.props.flux}/>
                    </Grid>
                </div>
            </div>
        );
    }
});
