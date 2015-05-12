import React from 'react';
import {ButtonLink} from 'react-router-bootstrap';
import {Grid, Col, Row} from 'react-bootstrap';
import SearchBar from './searchBar.jsx';
import TopBarActions from './topbarActions.jsx';
import Logo from './logo.jsx';

export default React.createClass({
    displayName: "TopBar",

    render() {
        var loggedUser = this.props.user ? this.props.users[this.props.user] : null;

        return (
            <Row className="topBar">
                <Grid>
                    <Col className="logo" xs={6} md={3}>
                        <Logo/>
                    </Col>
                    <Col xs={6} md={3} mdPush={6}>
                        {this.props.user ?
                            <TopBarActions user={loggedUser} onLogoutClicked={this.props.onLogoutClicked}/> :
                            <ButtonLink className="pull-right" to="login" id="loginButton">
                                <span>Login</span>
                            </ButtonLink>
                        }
                    </Col>
                    <Col xs={12} md={6} mdPull={3}>
                        <SearchBar/>
                    </Col>
                </Grid>
            </Row>
        );
    }
});
