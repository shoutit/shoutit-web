import React from 'react';
import {Link} from 'react-router';
import {Grid, Column} from '../../helper';
import Separator from '../../general/separator.jsx';

export default React.createClass({
    propTypes: {
        user: React.PropTypes.object.isRequired
    },

    renderButton() {
        let button = null;

        if(this.props.user.is_owner) {
            button = (
                <Grid fluid={true}>
                    <span className="page-button">Create Page</span>
                </Grid>
                );
        }

        return button;
    },

    renderPages() {
        const pages = this.props.user.pages;
        return pages.map((item, idx) => {
            // mock image data
            item.image = 'http://goo.gl/4PvVWL';
            return (
                <Grid fluid={true} key={"page-card-" + idx}>
                    <Column fluid={true} clear={true} size="3" className="card-list-img">
                        {/*
                          Use a component for displaying pages images here (if needed)
                          <UserImage type="circle" size="26" className="pull-left" image={item.image} />*/}
                    </Column>
                    <Column fluid={true} size="12" className="card-list-item">
                        <Link to={`/page/${item.username}`}>{item.name}</Link>
                    </Column>
                </Grid>
                );
        });
    },

    render() {
        const {is_owner, first_name, pages} = this.props.user;

        if(pages.length > 0 || is_owner) {
            return (
                <Grid className="si-card">
                    <div className="card-header">
                        <h3>{is_owner? "my pages": first_name + " pages"}</h3>
                    </div>
                    {this.renderPages()}
                    {this.renderButton()}
                </Grid>
            );
        } else {
            return null;
        }
    }
});
