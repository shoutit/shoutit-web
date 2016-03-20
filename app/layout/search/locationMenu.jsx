import React from 'react';

import {Button} from 'react-bootstrap';
import Icon from '../shared/components/helper/icon.jsx';

export default React.createClass({
    displayName: "LocationMenu",

    render() {
        let currentCity = this.props.current.city;

        return (
            <div className="selectpicker">
                <Button onClick={this.props.onFocus} key="countrySelect"
                        className="dropdown-toggle">
                    {currentCity || <Icon name="loc"/>}
                </Button>
            </div>
        );
    }
});
