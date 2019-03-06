const crypto = require('crypto');
const PasswordReset = require('../models/PasswordReset');

const createResetPasswordToken = (user) => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(20, (err, buf) => {
      if (err)
        reject(err)

      /**
       * Save to Password Reset model
       */
      let token = buf.toString('hex');
      // let passwordReset = new PasswordReset({
      //   email,
      //   token
      // });
      // passwordReset.save((err, passwordReset) => {
      //   if (err)
      //     reject(err)
      //
      //   resolve(token)
      // })

      /*Find ID inside an update about  */
      PasswordReset.findByIdAndUpdate({
        _id : user._id
      }, {
        email : user.email,
        token,
        updatedAt : Date.now()
      }, {
        new : true,
        upsert : true
      }, (err, passwordReset) => {
        if (err)
          reject(err)

        resolve(token)
      })

    });
  });
}



module.exports = {
  createResetPasswordToken
}
