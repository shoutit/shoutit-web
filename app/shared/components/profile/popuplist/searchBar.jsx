import React from 'react';
import {Input} from 'react-bootstrap';
import {Icon, Grid} from '../../helper';

export default React.createClass({
    displayName: "SearchBar",

    onChangeSearch() {

    },

    render() {
        const searchIcon = <Icon className="popuplist-searchbar-icon" name="search" />;

        return(
            <Grid fluid={true} className="popuplist-searchbar">
                <Input
                    placeholder="Search"
                    type="text"
                    onChange={this.onChangeSearch}
                    buttonAfter={searchIcon}
                    tabIndex={1}
                    />
                
            </Grid>
            );
    }
});