import React from 'react';
import {Col} from 'react-bootstrap';

export default React.createClass({

    getInitialState(){
        return {
            pictures: []
        };
    },

    render() {
        return (
            <Col xs={12} md={12}>
                <button type="button" className="btn btn-default btn-submit submit">Upload a
                    picture
                </button>
            </Col>
        );
    }
});
