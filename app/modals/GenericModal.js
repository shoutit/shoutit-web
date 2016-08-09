/* eslint-env browser */
import map from 'lodash/map';
import React, { PropTypes, Component } from 'react';
import Button from '../forms/Button';
import Modal, { Header, Footer, Body } from '../modals';

export default class GenericModal extends Component {

  static propTypes = {
    buttons: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string,
      onClick: PropTypes.func,
      focused: PropTypes.bool,
    })),
    header: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element,
    ]),
    children: PropTypes.any,
    size: PropTypes.string,
  }

  static defaultProps = {
    size: 'x-small',
  }

  constructor(props) {
    super(props);
    this.hide = this.hide.bind(this);
  }

  hide() {
    this.refs.modal.hide();
  }

  focus(ref) {
    ref && ref.focus();
  }

  render() {
    const { children, buttons, header, size, ...rest } = this.props;

    return (
      <Modal { ...rest } ref="modal" size={ size }>
        { header &&
          <Header closeButton>
            { header }
          </Header>
        }
        <Body>
          { children }
        </Body>
        { buttons &&
          <Footer>
            {
              map(buttons, (button, index) => {
                const { label, focused, ...props } = button;

                const onClick = () => {
                  button.onClick && button.onClick();
                  this.hide();
                };

                return (
                  <Button { ...props } key={ index } onClick={ onClick } ref={ ref => focused && this.focus(ref) }>
                    { label }
                  </Button>
                );
              })
            }
          </Footer>
        }
      </Modal>
    );
  }
}
