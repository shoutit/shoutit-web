import React from 'react';
import {Icon} from '../helper';

export default React.createClass({
    propTypes: {
        tag: React.PropTypes.object.isRequired
    },

    render() {
        let tag = this.props.tag;
        let countStyle = {
            position: "absolute",
            top: "-5px",
            left: "65%",
            zIndex: "1",
            fontSize: "2rem",
            fontWeight: "700",
            color: "#7EBE59"
        }

        return (
            <div className="si-shelf-button">
                <div className="img-holder">
                    <Icon name="listening" />
                    <span style={countStyle}>{tag.listeners_count}</span>
                </div>
                <div className="text-holder">
                    Listeners
                </div>
            </div>
        );
    }
});