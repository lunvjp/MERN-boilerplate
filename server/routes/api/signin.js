const User = require('../../models/User');

module.exports = (app) => {
  app.post('/api/signin', (req, res, next) => {
    // Custom new message
    let message = {};
    const {body} = req;
    message = body;
    // email
    // password
    let {
      email, password
    } = body;
    // Steps
    // - Validate Email
    if (!email) {
      return res.send({
        success : false,
        message : 'Email is not blank!'
      });
    }
    // - Validate Password
    if (!password) {
      return res.send({
        success : false,
        message : 'Password is not blank!'
      });
    }
    // - Format Email
    email = email.toLowerCase();
    email = email.trim();
    // + Trim
    // + Convert text to lowercase
    // - Verify this email
    // - Let me save first to make a Test.

    // - Save if there are no any duplicated emails

    // - Check other emails
    // let user = User.find({
    //   email : email
    // });

    // let newUser = new User({
    //   email : 'lunvjp@gmai.com',
    //   name : 'jack',
    //   password : 'lunvjp'
    // });

    // + Create password by "bcrypt"
    return res.send({
      body : message,
      // newUser : newUser
    });

    // return res.send({
    //   success : false,
    //   message : 'Server Error',
    // })
  });
}
