import React from "react";
import { Input } from "react-bootstrap";
import Button from "../../components/helper/Button";

export default React.createClass({
  displayName: "RecoverPasswordForm",

  getInitialState() {
    return {
      loading: false
    };
  },

  componentDidUpdate() {
    if (this.props.res) {
      this.setState({ loading: false });
    }
  },

  handleSubmit(e) {
    e.preventDefault();
    this.setState({
      loading:true
    });
    e.target.email.blur();
    this.props.flux.actions.forgetPass(e.target.email.value);
  },

  render() {
    const { loading } = this.state;
    return(
      <form onSubmit={this.handleSubmit}>
        <p>{this.props.res}</p>
        <Input
          name="email"
          type="text"
          placeholder="Email or Username"
          className="input-email" />

        <Button
          type="submit" primary block disabled={ loading }
          label={loading ? "Sending request...": "Request password reset"}
          />
      </form>
      );
  }

});
