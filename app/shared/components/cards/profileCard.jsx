import React from 'react';
import {StoreWatchMixin} from 'fluxxor';
import {Link, History} from 'react-router';
import {Icon, Grid, Column} from '../helper';
import UserImage from '../user/userImage.jsx';

export default React.createClass({
    displayName: "ProfileCard",
    mixins: [StoreWatchMixin('users'), History],

    contextTypes: {
        flux: React.PropTypes.object,
        params: React.PropTypes.object
    },

    getStateFromFlux() {
        let flux = this.context.flux;

        return {
            users: flux.store('users').getState().users,
            user: flux.store('users').getState().user
        }
    },

    render() {
        let isNotShoutPage = !this.context.params.shoutId;
        let isNotSearchPage = !this.context.params.shouttype;
        let isNotTagProfile = !this.context.params.tagName;
        let isLoggedIn = this.state.user;

        if( isLoggedIn && isNotShoutPage && isNotSearchPage && isNotTagProfile) {
            let img = this.state.users[this.state.user].image,
                name = this.state.users[this.state.user].name,
                userImage = <UserImage image={img} type="circle" height={25} width={25}/>;
            return (
                <section className="si-card gray-card">
                    <Grid fluid={true}>
                        <Column fluid={true} clear={true} size="3" className="card-list-img">
                            {userImage}
                        </Column>
                        <Column fluid={true} size="12" className="card-list-item">
                            <Link to={`/user/${this.state.user}`}>{name}</Link>
                        </Column>
                        <Column fluid={true} clear={true} size="3" className="card-list-img">
                            <Icon name="edit" />
                        </Column>
                        <Column fluid={true} size="12" className="card-list-item">
                            <span onClick={() => this.history.pushState(null, `/user/${this.state.user}`, {_edit: 1})}>
                                Edit Profile
                            </span>
                        </Column>
                        <Column fluid={true} clear={true} size="3" className="card-list-img">
                            <Icon name="message" style={{transform:'scale(0.7)', margin:'5px 15px 0 -5px'}}/>
                        </Column>
                        <Column fluid={true} size="12" className="card-list-item">
                            <Link to="/messages">Messages</Link>
                        </Column>
                        <Column fluid={true} clear={true} size="3" className="card-list-img">
                            <Icon name="browse" />
                        </Column>
                        <Column fluid={true} size="12" className="card-list-item">
                            <Link to="/home">Browse</Link>
                        </Column>
                    </Grid>
                </section>
            );
        }

        return null;
    }
});
