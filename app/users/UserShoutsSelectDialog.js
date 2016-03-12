import React, { PropTypes, Component } from "react";
import { Modal } from "react-bootstrap";

import Progress from "../shared/components/helper/Progress";
import Button from "../shared/components/helper/Button";
import ShoutItem from "../shared/components/shout/ShoutItem";

if (process.env.BROWSER) {
  require("./UserShoutsSelectDialog.scss");
}

export default class UserShoutsSelectDialog extends Component {

  static propTypes = {
    buttonLabel: PropTypes.string,
    user: PropTypes.object.isRequired,
    open: PropTypes.bool,
    onRequestClose: PropTypes.func,
    flux: PropTypes.object.isRequired,
    onSelectionConfirm: PropTypes.func.isRequired
  };

  static defaultProps = {
    open: false,
    attachments: "Select"
  };

  constructor(props) {
    super(props);
    this.setStateFromStore = this.setStateFromStore.bind(this);
  }

  state = {
    selected: [],
    shouts: []
  }

  componentDidMount() {
    const { flux, user, open } = this.props;
    flux.store("users").on("change", this.setStateFromStore);
    if (open) {
      flux.actions.loadUserShouts(user.username, "offer");
    }
  }

  componentDidUpdate(prevProps) {
    const { flux, user, open } = this.props;
    if (open && !prevProps.open) {
      flux.actions.loadUserShouts(user.username, "offer");
    }
    else if (!open && prevProps.open) {
      this.setState({
        selected: [],
        shouts: user.username !== prevProps.user.username ? [] : this.state.shouts
      });
    }
  }

  componentWillUnmount() {
    const { flux } = this.props;
    flux.store("users").removeListener("change", this.setStateFromStore);
  }

  setStateFromStore() {
    const { flux, user } = this.props;
    const state = flux.store("users").getState();
    this.setState({
      loading: state.shouts[user.username] && state.shouts[user.username].loading,
      shouts: state.shouts[user.username] ? state.shouts[user.username].list : []
    });
  }

  handleSelectionChange(checked, shout) {
    const { selected } = this.state;
    if (checked) {
      this.setState({ selected: [...selected, shout] });
    }
    else {
      const index = selected.indexOf(shout);
      this.setState({
        selected: [...selected.slice(0, index), ...selected.slice(index + 1) ]
      });
    }
  }

  render() {
    const { open, onRequestClose, onSelectionConfirm, buttonLabel } = this.props;
    const { selected, loading, shouts } = this.state;
    return (
      <Modal show={ open } onHide={ onRequestClose }>
        <Modal.Header>
          <Modal.Title>Attach a shout</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>

          { shouts.map(shout => {
            const isChecked = !!selected.find(selectedShout => selectedShout.id === shout.id);
            return (
              <div key={shout.id} className={ `UserShoutsSelectDialog-item${isChecked? " checked" : ""}`}>
                <input
                  onChange={ e => this.handleSelectionChange(e.target.checked, shout) }
                  type="checkbox"
                  id={`UserShoutsSelectDialog.${shout.id}`}
                  value={ shout.id }
                  name="shoutIds"
                />
                <label style={{ display: "block", marginBottom: 0, width: "100%", cursor: "pointer" }} htmlFor={`UserShoutsSelectDialog.${shout.id}`}>
                  <ShoutItem checked={ isChecked } horizontal shout={ shout } showUser={ false } />
                </label>
              </div>
            );
          }

          )}
          </form>

          { !loading && shouts.length === 0 && <p>You don't have any shout, yet.</p> }
          { loading && shouts.length === 0 && <Progress /> }

        </Modal.Body>
        <Modal.Footer>
           <Button label="Cancel" onClick={ onRequestClose}  />
           <Button
              disabled={ selected.length === 0}
              label={ buttonLabel }
              primary
              onClick={() => { selected.length > 0 ? onSelectionConfirm(selected) : null; } } />
        </Modal.Footer>
      </Modal>
    );
  }
}
