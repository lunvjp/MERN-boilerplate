const mongoose = require('mongoose');

const PasswordResetSchema = new mongoose.Schema({
  email : {
    type : String,
    required : true,
  },
  token: {
    type: String,
    required : true,
  },
  updatedAt : {
    type : Date,
  },
  createdAt: {
    type: Date,
    default : Date.now(),
  }
})

module.exports = mongoose.model('PasswordReset', PasswordResetSchema);
