import React from 'react';

class ForgetPassword extends React.Component {

  state = {
    email : '',
    message : ''
  }
  setMessage = (message) => {
    this.setState({
      message
    });
  }
  onChangeInput = (e) => {
    this.setState({
      [e.target.name] : e.target.value
    })
  }
  onFindAccount = () => {
    const {email} = this.state;

    fetch('/api/forgetPassword', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email
      })
    })
      .then(res => res.json())
      .then((res) => {
        // console.log(res)
        if (res.success) {
          this.setMessage('Check your email for a confirmation link.')
        } else
          this.setMessage(res.message)
      })
      .catch(e => {
        console.log(e)
        this.setMessage('Server Error')
      })
  }
  render() {
    const {email, message} = this.state;
    return (
      <div>
        <p>{message}</p>
        <form method="post">
          <input onChange={this.onChangeInput} value={email} name="email"/>
          <button type="button" onClick={this.onFindAccount}>Find account</button>
        </form>
      </div>
    )
  }
}

export default ForgetPassword;
