import React from 'react';
import {Link} from 'react-router';
import {Grid, Col} from 'react-bootstrap';

export default React.createClass({
    displayName: "Footer",

    render() {
        return (
            <footer>
                <Grid>
                    <Col xs={12} md={5} className="foo-left">
                        <p>
                            <span>Shoutit &copy; 2015</span>
                            |
                            <Link to="rules"> Marketplace Rules </Link>
                            |
                            <Link to="tos"> Terms of Service </Link>
                            |
                            <Link to="policy"> Privacy </Link>
                        </p>
                    </Col>

                    <Col xs={12} md={3} className="foo-center">
                        <p>Shouit Apps</p>
                        <ul>
                        </ul>
                    </Col>
                    <Col xs={12} md={4} className="foo-right">
                        <ul>
                        </ul>
                    </Col>
                </Grid>
            </footer>
        );
    }
});
