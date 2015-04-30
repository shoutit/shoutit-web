import React from 'react';
import {Grid, Row} from 'react-bootstrap';
import HeaderLogo from '../header/headerLogo.jsx';

export default React.createClass({
    displayName: "TopBar",

    render() {
        return (
            <Row id="row-logo">
                <Grid>
                    <HeaderLogo flux={this.props.flux}/>
                </Grid>
            </Row>
        );
    }
});
