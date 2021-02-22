const { User, Thought } = require('../models');

const thoughtCtrl = {
  
  GAT(req, res) {
    Thought.find()
    .select('-__v')
    .then(dbThought => res.status(200).json(dbThought))
    .catch(e => { console.log(e); res.status(555).json(e); });
  },
  GTBI(req, res) {
    console.log(req.params);
    Thought.findOne
    (
      {
        _id: req.params.id
      }
    )
    .select('-__v')
    .then(dbThought => {
      if (!dbThought) {
        return res.status(404).json({message: `thought not found`})
      }
      res.status(200).json(dbThought);
    })
    .catch(e => { console.log(e); res.status(500).json(e); });
  },
  

  newThought(req, res) {
    
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
        res.status(404).json({message: `no user found`});
      }
      res.status(200).json(user); 
    })
    .catch(e => { console.log(e); res.status(500).json(e); });
  },


  //delete  thought
  removeThought(req, res) {
    
    console.log(req.params);
    
    Thought.findOneAndDelete
    (
      {
        _id: req.params.id
      }
    )
    .then(thought => {
     
      if (!thought) {
        return res.status(404).json({message: `no thought found`});
      }
      
      return User.findOneAndUpdate
      (
        { _id: req.params.userId },
        { $pull: {thoughts: req.params.id} },
        { new: true }
      );
    })
    .then(Data => {
      if (!Data) {
        res.status(404).json({message: `error`});
      }
      res.status(200).json({message: `ok`});
    })
    .catch(e => { console.log(e); res.status(510).json(e); });
  },


//update Thought
  putThought: async (req, res) => {
   
    try {
      const thawt = await Thought.findOneAndUpdate
      (
        { _id: req.params.id },
        req.body,
        { new: true }
      );
      
      if (!thawt) {
        res.status(404).json({message: `thought id not found`})
      }
      res.status(200).json(that);
    } catch (error) {
      
      res.status(500).json(error);
    }
  },


  //create a reaction
  newReaction(req, res) {
    
    console.log(req.params);
    console.log(req.body);
    Thought.findOneAndUpdate
    (
      { _id: req.params.id },
      { $push: { reactions: req.body } },
      { new: true }
    )
    .then(dbThought => {
      console.log(dbThought);
      if (!dbThought) {
        return res.status(404).json({message: `no thought found with the id of ${req.params.thoughtId}`});
      }
      res.status(200).json(dbThought);
    })
    .catch(e => { console.log(e); res.json(500).json(e); });
  },


  //delete a reaction 
  removeReaction(req, res) {
    
    console.log(req.params);
    Thought.findOneAndUpdate
    (
      { _id: req.params.id },
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { new: true }
    )
    .then(dbThought => {
      console.log(dbThought);
      if (!dbThought) {
        return res.status(404).json({message: `no thought found `})
      }
      res.status(200).json(dbThought);
    })
    .catch(e => { console.log(e); res.status(500).json(e); });
  },


  putReaction: async (req, res) => {
   
    console.log(req.params);
    console.log(req.body);
    //find the thought and delete the old reaction on this thought
    try {
      const removedReaction = await Thought.findOneAndUpdate
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
      console.log(removedReaction);
      if (!removedReaction) {
        res.status(404).json({message: `no thought found with the id of ${req.params.id} or no reaction found with the id of ${req.params.reactionId}`});
      }
      //update the thought with the new reaction
      const updatedReaction = await Thought.findOneAndUpdate
      (
        { _id: req.params.id },
        {
          $push: {
            reactions: req.body
          }
        },
        { new: true }
      );
      console.log(updatedReaction);
      res.status(200).json(updatedReaction);
    } catch (error) {
      console.log(error); res.status(500).json(error);
    }
  }
};

module.exports = thoughtCtrl;