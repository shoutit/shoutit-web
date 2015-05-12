import React from 'react';
import {Grid, Row} from 'react-bootstrap';
import SearchBar from '../header/searchBar.jsx';

export default React.createClass({
    displayName: "TopBar",

    render() {
        return (
            <Row id="row-logo">
                <Grid>
                    <SearchBar flux={this.props.flux}/>
                </Grid>
            </Row>
        );
    }
});
