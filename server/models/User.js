const mongoose = require('mongoose'); // Create Data schema
const bcrypt = require('bcrypt'); // Create password

const UserSchema = new mongoose.Schema({
  email : {
    type : String,
    default : ''
  },
  name : {
    type : String,
    default : ''
  },
  password : {
    type : String,
    // TODO: Create function inside this Schema
    default : 'default password'
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

UserSchema.methods.generatePassword = (password) => {
  bcrypt.hash(password, 10, (err, hash) => {
    return hash;
  })
  // return bcrypt.hash(password , 10);
}

module.exports = mongoose.model('User', UserSchema);


