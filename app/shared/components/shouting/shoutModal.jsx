import React from 'react';
import {Modal, Row, Col, Button, Input} from 'react-bootstrap';
import TagsInput from 'react-tagsinput';

import Clearfix from '../helper/clearFix.jsx';
import Icon from '../helper/icon.jsx';

export default React.createClass({
    displayName: "ShoutModal",

    renderHeader() {
        return (
            <div className="modal-header">
                <button onClick={this.props.onRequestHide} type="button" className="close" data-dismiss="modal"
                        aria-label="Close">
                    <Icon name="nhan"/>
                </button>
            </div>
        );
    },

    renderLogo() {
        return (
            <div className="modal-logo">
                <div className="logo">
                    <img src="img/logo2.png"/>
                </div>
                <div className="slogun">
                    <p>Shout an Offer</p>
                </div>
            </div>
        );
    },

    renderTitleInput() {
        return (
            <Input type="text" placeholder="What are you shouting about?"/>
        );
    },

    renderPriceInput() {
        return (
            <Input type="number" className="price" placeholder="1.000"/>
        );
    },

    renderCurrencySelect() {
        return (
            <Input type='select' defaultValue="0">
                <option value="0">AED</option>
                <option value="1">AED2</option>
                <option value="2">AED3</option>
            </Input>
        );
    },

    renderDescTextArea() {
        return (
            <Input type='textarea' rows="3" placeholder="Description"/>
        );
    },

    renderTypeSelect () {
        return (
            <Input type="select">
                <option value="1">Offers</option>
                <option value="2">Requests</option>
                <option value="2">Experience</option>
            </Input>
        );
    },

    renderTagInput() {
        return (
            <div className="keyword">
                <TagsInput ref='tags' placeholder="Add a key word"/>
            </div>
        );
    },

    renderPictureInput() {
        return (
            <button type="button" className="btn btn-default btn-submit submit">Upload a
                picture
            </button>
        );
    },

    renderLocationInput() {
        return (
            <form id="form2">
                <div className="form-group">
                    <input type="text" className="form-control" placeholder="Enter a location"/>
                </div>

                <div className="map">
                    <img src="img/map.png"/>
                </div>

                <div className="row-submit">
                    <button type="button" className="btn btn-default btn-submit submit">
                        Shout it!
                    </button>
                </div>
            </form>
        );
    },

    renderForm() {
        return (
            <div className="modal-form">
                <form>
                    <Row>
                        <Col sm={7} md={7}>
                            {this.renderTitleInput()}
                        </Col>
                        <Col sm={3} md={3}>
                            {this.renderPriceInput()}
                        </Col>
                        <Col sm={2} md={2}>
                            {this.renderCurrencySelect()}
                        </Col>
                    </Row>
                    <Clearfix/>
                    <Row>
                        <Col sm={12} md={12}>
                            {this.renderDescTextArea()}
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={3} md={3}>
                            {this.renderTypeSelect()}
                        </Col>
                        <Col sm={9} md={9}>
                            {this.renderTagInput()}
                        </Col>
                    </Row>
                    <Row>
                        {this.renderPictureInput()}
                    </Row>
                    <Row>
                        <Button className="btn-submit submit">
                            Shout it!
                        </Button>
                    </Row>
                </form>
            </div>
        );
    },

    renderBody() {
        return (
            <div className="modal-body">
                {this.renderLogo()}
                {this.renderForm()}
            </div>
        );
    },


    render() {
        return (
            <Modal {...this.props} bsSize="large">
                {this.renderHeader()}
                {this.renderBody()}
            </Modal>
        );
    }
});
