import React from 'react';
import {Link} from 'react-router';
import {Icon} from '../helper';
import UserImage from '../user/userImage.jsx';
import ProfilePhoto from '../general/profilePhoto.jsx';

export default React.createClass({
	displayName: "ProfileDropdown",

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

	renderMenuDropdown() {
		let markup = (
			<div className="user-menu-dropdown" onMouseDown={this.mouseDownHandle} onMouseUp={this.mouseUpHandle}>
				<Link to=""><Icon name="my-profile" />My Profile</Link>
				<Link to=""><Icon name="edit-profile" />Edit Profile</Link>
				<Link to=""><Icon name="settings" />Settings</Link>
				<Link to=""><Icon name="help" />Help</Link>
				<Link to=""><Icon name="logout" />Logout</Link>
			</div>
			);

		return this.state.menu? markup: null;
	},

	componentDidMount() {
		window.addEventListener('mousedown', this.closeDropdown, false);
	},

	componentWillUnmount() {
		window.removeEventListener('mousedown', this.closeDropdown, false);
	},

	render() {
		let user = this.props.user,
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

/*
<DropdownButton ref="dropdown" title={title} 
		style={{marginTop:'-2px',listStyle:'none'}} noCaret={true} className="profile"
		navItem={true} alt={user.name}>
				<LinkContainer to={`/user/${username}`}>
					<MenuItem>
						Profile
					</MenuItem>
				</LinkContainer>
				<MenuItem onSelect={this.props.onLogoutClicked}>
					Logout
				</MenuItem>
			</DropdownButton>
			*/