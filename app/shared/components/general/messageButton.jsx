import React from 'react';
import {Icon} from '../helper';

export default React.createClass({
    displayName: 'MessageButton',

    render() {
        let CompProps = {
           className: 'si-shelf-button'
        };

        if(this.props.style) {
           CompProps.style = this.props.style;
        }
        
        return (
            <div {...CompProps} >
                <div className="img-holder">
                    <Icon name="message" />
                </div>
                <div className="text-holder">
                    Message
                </div>
            </div>
        );
    }
});


