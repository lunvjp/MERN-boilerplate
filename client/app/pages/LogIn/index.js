import React from 'react';
import { Redirect } from 'react-router-dom';

class LogIn extends React.Component {
  state = {
    email : '',
    password : '',
    message : '',
    redirectToHomePage : false,
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
  logInSubmit = () => {
    const { email, password } = this.state;

    fetch('/api/login', {
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
      .then((res) => {

        console.log(res)
        if (res.success)
          this.setState({
            redirectToHomePage : true
          });

        this.setMessage(res.message)
      })
      .catch(err => {
        console.log(err)
        this.setMessage('Server Error')
      });
  }
  render() {
    const {message, redirectToHomePage} = this.state;

    if (redirectToHomePage)
      return <Redirect to='/' />;

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
          <button type="button" onClick={this.logInSubmit}>Submit</button>
        </form>
      </div>
    );
  }
}

export default LogIn;
