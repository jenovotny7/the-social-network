const { Schema, model, Types } = require('mongoose');
const moment = require('moment');


//Setup for Insomnia entries
const UserInsomnia = new Schema
(
  {
    username: {
      type: String,
      unique: [true, 'username must not match one already created'],
      required: 'must enter a valid username',
      trim: true
    },
    email: {
      type: String,
      unique: [true, 'email needs to match'], 
      required: [ true, 'email required' ],
      
     //Regex
      validate: {
        validator: (email) => {
          return /[a-zA-z0-9]+@.+\..+/i.test(email);
        },
        message: props => `${props.value}  email not valid`
      }
    },
    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Thought'
      }
    ],
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    memberSince: {
      type: Date,
      default: Date.now,
      get: membership => moment(membership).format('MMM DD YYYY')
    }
  },
  {
    toJSON: {
      virtuals: true,
      getters: true
    },
    id: false
  }
);





UserInsomnia.virtual('friendsCounter')
.get(function() {
  return this.friends.length;
});


UserInsomnia.virtual('thoughtsCounter')
.get(function() {
  return this.thoughts.length;
});






const User = model('User', UserInsomnia);

module.exports = User;

