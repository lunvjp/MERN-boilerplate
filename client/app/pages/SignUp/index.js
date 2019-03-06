import React from 'react';
import { Redirect } from 'react-router-dom';

class SignUp extends React.Component {
  state = {
    email : '',
    password : '',
    message : '',
    redirectToLoginPage : false,
  }
  setMessage = (message) => {
    this.setState({
      message
    });
  }
  onChange = (e) => {
    this.setState({
      [e.target.name] : e.target.value
    })
  }
  signUpSubmit = () => {
    const {email, password} = this.state;
    fetch('/api/signup', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password
      }),
      headers:{
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          this.setState({
            redirectToLoginPage : true
          });
        } else
          this.setMessage(res.message)
      })
      .catch(err => {
        this.setMessage('Server Error')
      });

  }
  render() {
    const {message, redirectToLoginPage} = this.state;

    if (redirectToLoginPage)
      return <Redirect to='/login' />;

    return (
      <div>
        <p>{message}</p>
        <form>
          <div>
            <label>Email</label>
            <input name="email" type="text" onChange={this.onChange}/>
          </div>
          <div>
            <label>Password</label>
            <input name="password" type="password" onChange={this.onChange}/>
          </div>
          <button type="button" onClick={this.signUpSubmit}>Submit</button>
        </form>
      </div>
    );
  }
}

export default SignUp;
