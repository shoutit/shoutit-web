import React from 'react';
import {Grid} from '../../helper';
import UserImage from '../../user/userImage.jsx';

export default React.createClass({
    displayName: "ProfileLeftBar",

    propTypes: {
        user: React.PropTypes.object.isRequired
    },

    render() {
        let user = this.props.user,
            imageStyle = {
                position: "relative",
                margin: "-63px auto 0",
                border: "2px solid white",
                boxShadow: "0 0px 6px rgba(0, 0, 0, 0.3)"
            };

        return (
            <Grid fluid={true}>
                <UserImage image={user.image}
                           size="126"
                           type="rounded2x"
                           style={imageStyle} />
                <h2 className="si-name">{user.name}</h2>
            </Grid>
        );
    }
});