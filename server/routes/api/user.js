const User = require('../../models/User');

module.exports = (app) => {
  app.post('/api/signup', async (req, res, next) => {
    const {body} = req;

    const { password } = body;
    let {
      email
    } = body;

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

    // - Save if there are no any duplicated emails
    const createNewUser = async () => {
      /*Generate password by "bcrypt"*/
      let hashPassword = await User.generatePassword(password);

      let newUser = new User({
        email : email,
        password : hashPassword
      });

      newUser.save(function (err, user) {
        if (err)
          return res.send({
            success : false,
            message : 'Server Error'
          })

        return res.send({
          success : true,
          message : 'User has been created!',
          user : user,
        })
      });
    }

    // - Check other emails
    User.find({
      email : email
    }, function (err, users) {
      if (err)
        return res.send({
          success : false,
          message : 'Server Error'
        })

      if (users.length)
        return res.send({
          success : false,
          message : 'This email is taken. Try another.'
        })

      createNewUser();

    });

  });
}