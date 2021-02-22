const { Schema, model, Types } = require('mongoose');
const moment = require('moment');

//Schema to format insomnia entries in JSON
const ReactionInsomnia = new Schema
(
  {
    reactionId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId()
    },
    reactionBody: {
      type: String,
      required: [true, 'reaction body required'],
      maxlength: 100
    },
    username: {
      type: String,
      required: [true, 'username required']
    },  
    userId: {
      type: String,
      required: 'userId required'
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: calendar => moment(calendar).format('MMM DD YYYY [at] hh:mm a')
    }
  },
  {
    toJSON: {
      getters: true
    },
    id: false
  }
)

const ThoughtInsomnia = new Schema
(
  {
    thoughtText: {
      type: String,
      required: [true, 'thoughtText required'],
      minlength: 1,
      maxlength: 100
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (calendar) => moment(calendar).format('MMM DD, YYYY [at] hh:mm a')
    },
    reactions: [ReactionInsomnia],
    username: {
      type: String,
      required: 'yada'
    },
    userId: {
      type: String,
      required: [true, 'yada']
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



// Thoughts counter
ThoughtInsomnia.virtual('reactionCounter')
.get(function() {
  return this.reactions.length;
});





const Thought = model('Thought', ThoughtInsomnia);

module.exports = Thought;
