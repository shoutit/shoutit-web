import React from 'react';
import {Icon} from '../helper';

export default React.createClass({
    propTypes: {
        user: React.PropTypes.object.isRequired
    },

    render() {
        let user = this.props.user;
        let countStyle = {
            position: "absolute",
            top: "-5px",
            left: "60%",
            zIndex: "1",
            fontSize: "2rem",
            fontWeight: "700",
            color: "#7EBE59"
        }

        return (
            <div className="si-shelf-button">
                <div className="img-holder">
                    <Icon name="tag" />
                    <span style={countStyle}>{user.listening_count.tags}</span>
                </div>
                <div className="text-holder">
                    Tags
                </div>
            </div>
        );
    }
});