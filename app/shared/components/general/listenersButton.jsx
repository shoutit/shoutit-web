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
            <div className="si-shelf-button not-clickable">
                <div className="img-holder">
                    <Icon name="listening" />
                    <span style={countStyle}>{user.listeners_count}</span>
                </div>
                <div className="text-holder">
                    Listeners
                </div>
            </div>
        );
    }
});