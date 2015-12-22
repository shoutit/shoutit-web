import React from 'react';
import {Link} from 'react-router';
import {Grid, Column, Icon} from '../../helper';
import Separator from '../../general/separator.jsx';
import UserImage from '../../user/userImage.jsx';

export default React.createClass({
    displayName: "PageAdminsCard",

    propTypes: {
        user: React.PropTypes.object.isRequired
    },

    renderAdminsList() {
        return this.props.user.admins.map((item, idx) => {
            return (
                <Grid fluid={true} key={'page-admin-' + idx}>
                    <Column fluid={true} clear={true} size="3" className="card-list-img">
                        <UserImage type="circle"
                                   user={item}
                                   size="26"
                                   className="pull-left"
                                   />
                    </Column>
                    <Column fluid={true} size="9" className="card-list-item">
                        <Link to={`/user/${item.username}`}>
                            {item.name}
                        </Link>
                    </Column>
                    <Column fluid={true} size="3" >
                        <Icon name="listen" className="card-listen-btn"/>
                    </Column>
                </Grid>
                );
        });
    },

    render() {
        return (
            <Grid fluid={true} className="si-card">
                <div className="card-header">
                    <h3>admins</h3>
                </div>
                {this.renderAdminsList()}
            </Grid>
        );
    }
});