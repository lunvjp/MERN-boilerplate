const mongoose = require('mongoose'); // Create Data schema
const bcrypt = require('bcrypt'); // Create password

const UserSchema = new mongoose.Schema ({
  email : {
    type : String,
    default : '',
    required: true
  },
  password : {
    type : String,
    default : '',
    required: true
  },
  name : {
    type : String,
    default : ''
  },
  createdAt : {
    type : Date,
    default : Date.now()
  },
  updatedAt : {
    type : Date,
    default : Date.now()
  }
});

UserSchema.statics.generatePassword = (password) => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err)
        reject(err)

      resolve(hash)
    })
  })
}

module.exports = mongoose.model('User', UserSchema);
