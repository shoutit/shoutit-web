import React from 'react';
import {StoreWatchMixin} from 'fluxxor';
import {Link} from 'react-router';
import {Icon} from '../helper';
import UserImage from '../user/userImage.jsx';

export default React.createClass({
    displayName: "ProfileCard",
    mixins: [StoreWatchMixin('users')],

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
                    <ul className="profile">
                        <li style={{height:'33px'}}>
                            {userImage}
                            <Link to="" style={{verticalAlign:'sub',marginLeft:'-7px'}}>{name}</Link>
                        </li>
                        <li>
                            <Icon name="edit" />
                            <Link to="">Edit Profile</Link>
                        </li>
                        <li>
                            <Icon name="message" style={{transform:'scale(0.7)', margin:'5px 15px 0 -5px'}}/>
                            <Link to="/chat">Messages</Link>
                        </li>
                        <li>
                            <Icon name="browse" />
                            <Link to="">Browse</Link>
                        </li>
                    </ul>
                </section>
            );
        }

        return null;
    }
});
