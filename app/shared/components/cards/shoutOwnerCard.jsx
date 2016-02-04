import React from 'react';
import {StoreWatchMixin} from 'fluxxor';
import {Link} from 'react-router';
import {Icon, Column, Flag} from '../helper';
import Separator from '../general/separator.jsx';
import UserImage from '../user/userImage.jsx';

export default React.createClass({
    displayName: "ShoutOwnerCard",
    mixins: [StoreWatchMixin('users', 'shouts')],

    contextTypes: {
        flux: React.PropTypes.object,
        params: React.PropTypes.object
    },

    getStateFromFlux() {
        let flux = this.context.flux,
            shoutStore = flux.store("shouts"),
            shoutObj = this.context.params.shoutId? shoutStore.findShout(this.context.params.shoutId): null;

        return {
            users: flux.store('users').getState().users,
            user: flux.store('users').getState().user,
            shout: shoutObj? shoutObj.shout: null
        }
    },


    render() {
        let shout = this.state.shout;
        let users = this.state.users;

        if(shout) {
            let img = shout.user.image,
                name = shout.user.name,
                ownerUsername = shout.user.username,
                listeners = users[ownerUsername]? users[ownerUsername].listeners_count: null,
                userImage = <UserImage image={img} type="rounded" height={44} width={44}/>,
                country = shout.location.country,
                city = shout.location.city;

            return (
                <section className="si-card shout-owner-card">
                    <Column fluid={true} clear={true} size="4" className="owner-info-left">
                        {userImage}
                    </Column>
                    <Column fluid={true} size="11" className="owner-info-right">
                        <Link to="">{name}</Link>
                        <Flag country={country} size="16" />
                        <span>{city}</span>
                    </Column>
                    <div className="holder">
                        <Separator />
                        <Column fluid={true} clear={true} size="5" className="owner-contact-action">
                            <Icon name="listening" />
                            <span className="listeners-count">{listeners}</span>
                            Listeners
                        </Column>
                        <Column fluid={true} size="5" className="owner-contact-action">
                            <Icon name="message" /> 
                            Message
                        </Column>
                        <Column fluid={true}  size="5" className="owner-contact-action">
                            <Icon name="listen" /> 
                            Listen
                        </Column>
                        <Separator />
                        <ul className="owner-contact-details">
                            <li>
                                <Icon name="date" /> 
                                <span>Joined: 10/13/2015</span>
                            </li>
                            <li>
                                <Icon name="phone" />
                                <span>+13-33252514</span>
                            </li>
                        </ul>
                    </div>
                </section>
            );
        } else {
            return null;
        }
    }
});
