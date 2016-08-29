/* eslint-env browser */
import React, { PropTypes, Component } from 'react';
import Button from '../forms/Button';
import Modal, { Header, Footer, Body } from '../modals';

const ButtonPropType = PropTypes.shape({

  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
  ]).isRequired,

  action: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
  ]),

  focused: PropTypes.bool,
});

export default class Dialog extends Component {

  static propTypes = {
    buttons: PropTypes.arrayOf(ButtonPropType),
    title: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.node,
    ]),
    children: PropTypes.any,
    size: PropTypes.string,
  }

  static defaultProps = {
    size: 'x-small',
  }

  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
    this.hide = this.hide.bind(this);
  }

  state = {
    isSubmitting: false,
  }

  componentDidMount() {
    if (this.focusedButton) {
      this.focusedButton.focus();
    }
  }

  submit() {
    this.setState({ isSubmitting: true });
  }

  hide() {
    this.modal.hide();
  }

  focusedButton = null
  modal = null

  handleButtonClick(button) {
    if (!button.action || button.action === 'cancel') {
      this.modal.hide();
      return;
    }
    button.action(this);
  }

  renderButtons(button, i) {
    const { label, focused, ...props } = button;
    return (
      <Button
        { ...props }
        key={ i }
        onClick={ this.handleButtonClick.bind(this, button) }
        ref={ focused ? el => this.focusedButton = el : null }>
        { label }
      </Button>
    );
  }
  render() {
    const { children, buttons, title, size, ...props } = this.props;

    return (
      <Modal
        { ...props }
        isSubmitting={ this.state.isSubmitting }
        autoSize={ false }
        ref={ el => this.modal = el }
        size={ size }>
        { title && <Header closeButton>{ title }</Header> }
        <Body>
          { children }
        </Body>
        { buttons &&
          <Footer>
            { buttons.map(this.renderButtons.bind(this)) }
          </Footer>
        }
      </Modal>
    );
  }
}
