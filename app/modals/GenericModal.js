/* eslint-env browser */
import map from 'lodash/map';
import omit from 'lodash/omit';
import React, { PropTypes, Component } from 'react';
import Button from '../forms/Button';
import Modal, { Header, Footer, Body } from '../modals';

export default class GenericModal extends Component {

  static propTypes = {
    actions: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string,
      onClick: PropTypes.func,
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

  render() {
    const { children, actions, header, size, ...rest } = this.props;

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
        { actions &&
          <Footer>
            {
              map(actions, (action, index) => {
                const onClick = () => {
                  action.onClick && action.onClick();
                  this.hide();
                };
                return (
                  <Button { ...omit(action, 'label', 'isClose') } key={ index } onClick={ onClick }>
                    { action.label }
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
