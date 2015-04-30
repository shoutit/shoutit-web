var React = require('react'),
    DropdownButton = require('react-bootstrap').DropdownButton,
    Col = require('react-bootstrap').Col,
    MenuItem = require('react-bootstrap').MenuItem;

var Icon = require('../../helper/icon.jsx'),
    DropdownHeader = require('./messages/dropdownHeader.jsx');
//MessagePreview = require('./messages/messagePreview.jsx');


module.exports = React.createClass({
    displayName: "MessagePopup",

    render: function () {
        var title = (<div>
            <Icon name="message-icon"/>
            <span className="small-circle">3</span>
        </div>);

        return (
            <DropdownButton title={title} className="messages" navItem={true} noCaret={true}>
                <DropdownHeader unread={0}/>

                <MenuItem className="see-all">
                    <span>See all messages</span>
                </MenuItem>
            </DropdownButton>
        );
    }
});

