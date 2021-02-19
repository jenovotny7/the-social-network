const { User, Thought } = require('../models');

const thoughtController = {
  //get all thoughts
  getAllThoughts(req, res) {
    Thought.find()
    .select('-__v')
    .then(dbThoughtData => res.status(200).json(dbThoughtData))
    .catch(e => { console.log(e); res.status(500).json(e); });
  },
  getThoughtById(req, res) {
    console.log(req.params);
    Thought.findOne
    (
      {
        _id: req.params.id
      }
    )
    .select('-__v')
    .then(dbThoughtData => {
      if (!dbThoughtData) {
        return res.status(404).json({message: `no thought found with the id of ${req.params.id}`})
      }
      res.status(200).json(dbThoughtData);
    })
    .catch(e => { console.log(e); res.status(500).json(e); });
  },
  

  addThought(req, res) {
    
    let thoughtLocal;
    //find user first to get the username
    Thought.create(
      {
        thoughtText: req.body.thoughtText,
        username: req.body.username,
        userId: req.body.userId
      }
    )
    .then(thought => {
      thoughtLocal = thought;
      
      return User.findOneAndUpdate
      (
        {
          _id: req.body.userId
        },
        { $push: { thoughts: thought._id } },
        {
          new: true,
        }
      )
      .populate(
        {
          path: 'thoughts',
          select: '-__v'
        }
      )
      .select('-__v')
    })
    .then(user => {
      if (!user) {
        res.status(404).json({message: `no user found with the id of ${req.body.userId}`});
      }
      res.status(200).json(user); 
    })
    .catch(e => { console.log(e); res.status(500).json(e); });
  },


  //delete a thought
  deleteThought(req, res) {
    
    console.log(req.params);
    //delete the thought
    Thought.findOneAndDelete
    (
      {
        _id: req.params.id
      }
    )
    .then(thought => {
     
      if (!thought) {
        return res.status(404).json({message: `no thought found with the id of ${req.params.id}`});
      }
      //then delete the thought from the user collection
      return User.findOneAndUpdate
      (
        { _id: req.params.userId },
        { $pull: {thoughts: req.params.id} },
        { new: true }
      );
    })
    .then(userInfo => {
      if (!userInfo) {
        res.status(404).json({message: `no user found with the id of ${req.params.userId}`});
      }
      res.status(200).json({message: `thought id of ${req.params.id} has been deleted from the user with the id of ${req.params.userId}`});
    })
    .catch(e => { console.log(e); res.status(500).json(e); });
  },



  updateThought: async (req, res) => {
   
    try {
      const thoughtInfo = await Thought.findOneAndUpdate
      (
        { _id: req.params.id },
        req.body,
        { new: true }
      );
      
      if (!thoughtInfo) {
        res.status(404).json({message: `no thought found with the id of ${req.params.id}`})
      }
      res.status(200).json(thoughtInfo);
    } catch (error) {
      
      res.status(500).json(error);
    }
  },


  //add reaction to a thought
  // reaction needs a reactionBody and username in post request body
  addReaction(req, res) {
    
    console.log(req.params);
    console.log(req.body);
    Thought.findOneAndUpdate
    (
      { _id: req.params.id },
      { $push: { reactions: req.body } },
      { new: true }
    )
    .then(dbThoughtData => {
      console.log(dbThoughtData);
      if (!dbThoughtData) {
        return res.status(404).json({message: `no thought found with the id of ${req.params.thoughtId}`});
      }
      res.status(200).json(dbThoughtData);
    })
    .catch(e => { console.log(e); res.json(500).json(e); });
  },


  //delete a reaction to a thought
  deleteReaction(req, res) {
    
    console.log(req.params);
    Thought.findOneAndUpdate
    (
      { _id: req.params.id },
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { new: true }
    )
    .then(dbThoughtData => {
      console.log(dbThoughtData);
      if (!dbThoughtData) {
        return res.status(404).json({message: `no thought found with the id of ${req.params.thoughtId} or reaction id of ${req.params.reactionId} `})
      }
      res.status(200).json(dbThoughtData);
    })
    .catch(e => { console.log(e); res.status(500).json(e); });
  },


  updateReaction: async (req, res) => {
   
    console.log(req.params);
    console.log(req.body);
    //find the thought and delete the old reaction on this thought
    try {
      const deletedReaction = await Thought.findOneAndUpdate
      (
        { _id: req.params.id },
        { 
          $pull: {
            reactions: {
              reactionId: req.params.reactionId
            }
          }
        },
        { new: true } 
      );
      console.log(deletedReaction);
      if (!deletedReaction) {
        res.status(404).json({message: `no thought found with the id of ${req.params.id} or no reaction found with the id of ${req.params.reactionId}`});
      }
      //update the thought with the new reaction
      const newReaction = await Thought.findOneAndUpdate
      (
        { _id: req.params.id },
        {
          $push: {
            reactions: req.body
          }
        },
        { new: true }
      );
      console.log(newReaction);
      res.status(200).json(newReaction);
    } catch (error) {
      console.log(error); res.status(500).json(error);
    }
  }
};

module.exports = thoughtController;