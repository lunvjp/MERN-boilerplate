const User = require('../../models/User');
const PasswordReset = require('../../models/PasswordReset');
const bcrypt = require('bcrypt');
const Email = require('email-templates');
const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');
const path = require('path');
const crypto = require('crypto');
const url = require('url');
const async = require("async");
const queryString = require("query-string");
const keys = require('../../configs/keys');
const tokens = require('../../utils/tokens');

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

  app.post('/api/login', (req, res, next) => {
    const { body } = req;

    const {
      email,
      password
    } = body;

    User.find({
      email : email
    }, function (err, users) {
      if (err)
        return res.send({
          success : false,
          message : 'Server Error'
        })

      if (!users.length)
        return res.send({
          success : false,
          message : "Couldn't find your account"
        })

      var user = users[0];
      bcrypt.compare(password, user.password, function(err, check) {
        if (err)
          return res.send({
            success : false,
            message : 'Server Error'
          })

        if (!check)
          return res.send({
            success : false,
            message : 'Wrong password. Try again or click Forgot password to reset it.'
          })

        return res.send({
          success : true,
          message : 'Logged in'
        })

      })

    })

  })

  app.post('/api/forgetPassword', async (req, res, next) => {
    const {
      body
    } = req;
    const {
      email
    } = body;

    // Steps1
    // - A route for the forget password
    // - Check real email before Checking password

    /*How to find users inside this project here.*/
    User.find({
      email : email
    }, (err, users) => {
      if (err)
        return res.send({
          success : false,
          message : 'Server Error'
        })

      if (!users.length)
        return res.send({
          success : false,
          message : "Couldn't find your Account"
        })

      let user = users[0];
      mailToUser(user);

    })

    // - Create a Page to reset confirmation password
    // - Create Front-end page to reset password
    // This method will search for the existence of the username/email in the database. If the user exists, a reset password link with a token will be sent to the user's email.

    const getSiteURL = () => {
      let protocol = req.protocol;
      let hostname = req.headers.host;
      return protocol + "://" + hostname ;
    }

    // - Config nodemailer to send email template
    // - Send mail to user.
    const mailToUser = async (user) => {

      let token = '';

      try {
        token = await tokens.createResetPasswordToken(user);
      } catch (e) {
        return res.status(500).json({
          message : e
        })
      }

      // Mail to user want to reset their password
      const transport = nodemailer.createTransport(sgTransport({
        auth: {
          api_key: keys.SENDGRID_API_KEY
        }
      }));

      const sendEmail = new Email({
        message : {
          from : "YouTalk <noreply@youtalk.com>"
        },
        send : true,
        transport
      });

      sendEmail
        .send({
          template: path.join(__dirname, '../..','templates/emails/forget-password'),
          message: {
            to: user.email
          },
          locals: {
            user : user,
            resetPasswordUrl : getSiteURL() + '/reset-password?' + queryString.stringify({
              token : token
            })
          },
        })
        .then((result) => {
          return res.send({
            success : true,
            message : result
          });
        })
        .catch(err => {
          return res.send({
            success : false,
            message : err
          })
        })
    }

  })

  app.post('/api/resetPassword', async (req, res, next) => {
    // Reset password new password of users
    const { body } = req;
    const { email, password } = body;

    async.waterfall([
      // - Create Hash password now.
      (done) => {
        User.generatePassword(password)
          .then(hashPassword => {
            console.log(hashPassword);
            done(null, hashPassword)
          })
          .catch(e => {
            done(e)
          });
      },
      // - Update password for that users.
      (password, done) => {
        User.findOneAndUpdate({
          email,
        }, {
          password
        }, {
          new : true,
          upsert : true
        }, (err, user) => {
          if (err)
            done('Server Error')

          if (!user)
            done("Couldn't find your Account")

          done(err, user);

        });
      },
      // - Delete item in Password reset table
      (user, done) => {
        PasswordReset.findByIdAndRemove(user._id, {}, (err, deletePass) => {
          if (err)
            done('Server Error');

          done(err, user);
          return res.send({
            success : true,
            message : 'Your password has been changed successfully'
          });
        });
      },
      // - Mail to user about Updating password.
      (user, done) => {
        // Mail to user about Updating password successfully!
        const transport = nodemailer.createTransport(sgTransport({
          auth: {
            api_key: keys.SENDGRID_API_KEY
          }
        }));

        const sendEmail = new Email({
          message : {
            from : "YouTalk <noreply@youtalk.com>"
          },
          send : true,
          transport
        });

        sendEmail
          .send({
            template: path.join(__dirname, '../..','templates/emails/reset-password'),
            message: {
              to: user.email
            },
            locals: {
              user : user,
            }
          })
          .then((result) => {
            // Log function here.
          })
          .catch(err => {
            done(err);
          })
      }

    ], (err) => {
      return res.send({
        success : false,
        message : err
      });
    });
    // END

  })

  app.get('/api/check', (req, res) => {
    let message = '';

    PasswordReset.findByIdAndRemove('fake_id', {}, (err, deletePass) => {
      // if (err)
      //   done('Server Error');

      console.log('ACTION: Check delete items.')
      console.log(deletePass);
      // How to create something for the big market.
    });

    return res.send({
      message : 'good'
    });
  });

  app.get('/api/checkPasswordToken', (req, res, next) => {

    const { query } = url.parse(req.url, true);
    const { token } = query;

    PasswordReset.findOne({
      token
    }, (err, passwordReset) => {
      if (err) {
        return res.status(500).json({
          message : 'Server Error'
        });
      }

      if (!passwordReset)
        return res.send({
          success : false,
          message : 'Not Found'
        });

      // Check Expired days here.
      // Get current days.
      let updatedAt = passwordReset.updatedAt; // milliseconds
      const currentDay = Date.now();
      if (currentDay - 24*60*60*1000 > updatedAt) {
        return res.send({
          success : false,
          message : 'Token is expired'
        })
      }

      return res.send({
        success : true,
        message : passwordReset,
      });

    });

  });

}
