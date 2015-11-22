import React from 'react';
import {StoreWatchMixin} from 'fluxxor';
import {Link} from 'react-router';
import UserImage from '../../../user/userImage.jsx';
import {Input} from 'react-bootstrap';
import {Icon} from '../../../helper';

export default React.createClass({
    displayName: "ShoutFooter",
    mixins: [StoreWatchMixin('users')],

    getStateFromFlux() {
        let flux = this.props.flux;
        return {
            user: flux.store('users').getState().user,
            users: flux.store('users').getState().users
        }
    },

    renderFooter() {
        let userImage;
        let footer = [];

        if(this.state.user) {
            let img = this.state.users[this.state.user].image;
            userImage = <UserImage image={img} type="square" height={36} width={36}/>;
            footer = (
                <div className="shout-footer">
                    {userImage}
                    <Input ref='pass' type='text' placeholder='Send a Message...'/>
                    <Icon name='send' className='shout-send' />
                </div>
                );
        }
        return footer;
    },

    render() {
        return (
            <div>
                {this.renderFooter()}
            </div>
        );
    }
});
