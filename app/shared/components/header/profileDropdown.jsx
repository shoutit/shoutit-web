import React from 'react';
import {Link, History} from 'react-router';
import {Icon} from '../helper';
import UserImage from '../user/userImage.jsx';
import ProfilePhoto from '../general/profilePhoto.jsx';

export default React.createClass({
	displayName: "ProfileDropdown",
    mixins: [History],

    contextTypes: {
        flux: React.PropTypes.object
    },

	getInitialState(){
		return {
			menu: false,
			downOnMenu: false // for recognizing clicks outside the component
		}
	},

	toggleDropdown() {
		this.setState({menu: !this.state.menu});
	},

	closeDropdown() {
		if(this.state.downOnMenu) { return;} 

		this.setState({menu: false});
	},

	mouseDownHandle() {
		this.setState({downOnMenu: true});
	},

	mouseUpHandle() {
		this.setState({downOnMenu: false});
	},

	onLogoutClick() {
        this.context.flux.actions.logout();
        // Making sure the user is logged out
        setTimeout(() => this.history.pushState(null, '/'), 300);

    },

	renderMenuDropdown() {
        const user = this.props.user,
            username = encodeURIComponent(user.username);

		return this.state.menu? (
			<div className="user-menu-dropdown" onMouseDown={this.mouseDownHandle} onMouseUp={this.mouseUpHandle}>
				<Link to={`/user/${username}`}><Icon name="my-profile" />My Profile</Link>
				<span className="item" onClick={() => this.history.pushState(null, `/user/${username}`, {_edit: 1})}>
                    <Icon name="edit-profile" />Edit Profile
                </span>
				<Link to={`/user/${username}`}><Icon name="settings" />Settings</Link>
				<Link to=""><Icon name="help" />Help</Link>
				<span className="item" onClick={this.onLogoutClick}><Icon name="logout" />Logout</span>
			</div>
			): null;
	},

	componentDidMount() {
		window.addEventListener('mousedown', this.closeDropdown, false);
	},

	componentWillUnmount() {
		window.removeEventListener('mousedown', this.closeDropdown, false);
	},

	render() {
		const user = this.props.user,
			username = encodeURIComponent(user.username);

		return (
			<div className="profile-menu">
				<ProfilePhoto onUserClick={this.toggleDropdown}
							  onUserMouseDown={this.mouseDownHandle}
							  onUserMouseUp={this.mouseUpHandle}
							  image={user.image}/>
				{this.renderMenuDropdown()}
			</div>
		);
	}
});