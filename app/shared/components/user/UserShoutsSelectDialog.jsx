import React, { PropTypes, Component } from "react";
import Dialog from "material-ui/lib/dialog";
import FlatButton from "material-ui/lib/flat-button";
import Progress from "../helper/Progress";
import ShoutItem from "../shout/ShoutItem";

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
      })
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
      loading: state.loading,
      shouts: state.shouts[user.username] ? state.shouts[user.username].offers : []
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
    const actions = [
      <FlatButton key="cancel" secondary label="Cancel" onTouchTap={ onRequestClose } />,
      <FlatButton key="submit" primary disabled={ selected.length === 0 }
          label={ buttonLabel }
          onTouchTap={ () => onSelectionConfirm(selected) }
      />
    ];
    return (
      <Dialog modal={ false }
        onRequestClose={ onRequestClose }
        title="Attach a shout"
        open={ open }
        actions={ actions }>

        <form>
        { shouts.map(shout =>
          <div key={shout.id}>
            <input
              onChange={ e => this.handleSelectionChange(e.target.checked, shout) }
              type="checkbox"
              id={`UserShoutsSelectDialog${shout.id}`}
              value={ shout.id }
              name="shoutIds"
            />
            <label htmlFor={`UserShoutsSelectDialog${shout.id}`}>
              <ShoutItem { ...shout} />
            </label>
          </div>
        )}
        </form>

        { loading && shouts.length === 0 && <Progress /> }

      </Dialog>
    );
  }
}
