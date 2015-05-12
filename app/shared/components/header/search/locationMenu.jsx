import React from 'react';

import {Button} from 'react-bootstrap';
import Icon from '../../helper/icon.jsx';

export default React.createClass({
    displayName: "LocationMenu",

    render() {
        let currentCity = this.props.currentCity;

        return (
            <div className="selectpicker bla bli">
                <Button onClick={this.props.onFocus} key="countrySelect"
                        className="dropdown-toggle">
                    {currentCity || <Icon name="loc"/>}
                </Button>
            </div>
        );
    }
});
