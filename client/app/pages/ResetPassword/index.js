import React from 'react';
import queryString from 'query-string';
import {
  Redirect, Link
} from "react-router-dom";
// import { BrowserRouter as Router, Route, Link } from "react-router-dom";

class ResetPassword extends React.Component {
  state = {
    email : '',
    password : '',
    confirmPassword : '',
    token : '',
    redirectToForgetPassword : false,
    message : '',
    success : false,
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
  checkComparedPassword = () => {
    const { password, confirmPassword } = this.state;
    return password === confirmPassword;
  }
  onFindAccount = () => {
    const {token} = this.state;
    // Do something with it now as well.
    // Get the token from URL.
    console.log(token)
    console.log(this.checkComparedPassword())

    if (!token)
      this.getToken();

    if (!this.checkComparedPassword())
      return;

    const {
      email,
      password
    } = this.state;

    fetch('/api/resetPassword', {
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
        console.log(res)
        if (res.success) {
          this.setState({
            success : true
          });
        }

        this.setMessage(res.message);
      })
      .catch(err => {
        console.log(err)
        this.setMessage('Server Error');
      });

  }
  getToken = () => {
    const { location } = this.props;
    const parsed = queryString.parse(location.search);
    const { token } = parsed;
    if (!token)
      return;

    let query = queryString.stringify({
      token
    })
    fetch('/api/checkPasswordToken?' + query, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(res => {
        if (!res.success) {
          this.setState({
            redirectToForgetPassword : true
          });
        } else {
          const {email} = res.message;

          this.setState({
            email,
            token
          })
        }
      })
      .catch(e => {
        console.log(e)
        // Redirect to Forget password page.
        this.setState({
          redirectToForgetPassword : true
        });
      });
      //

  }
  componentDidMount () {
    this.getToken();

    // Render "not found" template if password has been expired.
  }
  render() {
    const {email, token, redirectToForgetPassword, message, success} = this.state;

    if (redirectToForgetPassword)
      return <Redirect to='/forget-password' />;

    return (
      <div>
        <p>{message}</p>
        {
          success ? (
            <Link to="/">Go to homepage</Link>
          ) : (
            <form>
              <div>
                <label>Password</label>
                <input name="password" onChange={this.onChange} type="password"/>
              </div>
              <div>
                <label>Confirm Password</label>
                <input name="confirmPassword" onChange={this.onChange} type="password" />
              </div>
              <button onClick={this.onFindAccount} type="button">Submit</button>
            </form>
          )
        }
      </div>
    )
  }
}

export default ResetPassword;
