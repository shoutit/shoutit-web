import React from 'react';
import {Input,Button} from 'react-bootstrap';

export default React.createClass({
  displayName: "ForgetPass",

  getInitialState() {
    return {
      waiting: false
    }
  },

  render() {

    return(
      <form onSubmit={this.onForgetSubmit}>
        <p>{this.props.res}</p>
        <Input ref='email' type='text' placeholder='Email or username' 
          className='input-email' />
        <Button style={{marginBottom: '20px'}} bsSize='large' type='submit' block 
          className={this.state.waiting? 'btn-signin btn-signin-disabled':'btn-signin'}>
          {this.state.waiting? 'Sending request...': 'Request password'}
        </Button>
      </form>
      );
  },

  componentDidUpdate() {
    if(this.props.res)
      this.setState({waiting: false});
  },

  onForgetSubmit(e) {
    e.preventDefault();

    this.setState({waiting:true});
    this.props.res = null;

    let flux = this.props.flux;
    let email = this.refs.email.children[0].value;

    flux.actions.forgetPass(email);
  }

});