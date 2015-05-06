import React from 'react';
import {ButtonLink} from 'react-router-bootstrap';
import {Grid, Col, Row} from 'react-bootstrap';
import HeaderLogo from './headerLogo.jsx';
import TopBarActions from './topbarActions.jsx';

export default React.createClass({
    displayName: "TopBar",

    render() {
        var loggedUser = this.props.user ? this.props.users[this.props.user] : null;

        return (
            <Row id="row-logo">
                <Grid>
                    <HeaderLogo/>
                    <Col className="header-icon" xs={12} md={4}>
                        {this.props.user ?
                            <TopBarActions user={loggedUser} onLogoutClicked={this.props.onLogoutClicked}/> :
                            <ButtonLink to="login" id="loginButton">
                                <span>Login</span>
                            </ButtonLink>
                        }
                    </Col>
                </Grid>
            </Row>
        );
    }
});
