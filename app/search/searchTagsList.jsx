import React from 'react';
import {History, Link} from 'react-router';
import {Column, Grid} from '../shared/components/helper';

export default React.createClass({
    mixins: [History],
    displayName: "SearchTagsList",

    render() {
        return (
            <Grid fluid={true} className="search-page-tags si-card">
                <div className="card-header">
                    <h3>related search for "{this.props.term}"</h3>
                </div>
                <Grid fluid={true} style={{padding: '0 20px'}}>
                    <Link to="">HP Computer</Link>
                    <Link to="">HP Desktops</Link>
                    <Link to="">HP Laptops</Link>
                    <Link to="">HP Printer</Link>
                </Grid>
            </Grid>
            );
    }
});
