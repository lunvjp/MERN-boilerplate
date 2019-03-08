const mongoose = require('mongoose');

const SocialSchema = new mongoose.Schema({
  // count: {
  //   type: Number,
  //   default: 0
  // }
  // TODO:
  // use this docs to create new Mongo DB
  // https://medium.com/@seunghunsunmoonlee/how-to-social-login-facebook-google-etc-with-realtime-mongodb-database-feathersjs-node-js-4369daf8777e
  userId : {
    type :String
  },

  provider : {
    type : String,
    // values : "facebook", "google"
  },
  updatedAt : {
    type : Date,
    default : Date.now()
  },
  createdAt : {
    type : Date,
  }


});

module.exports = mongoose.model('Social', SocialSchema);
