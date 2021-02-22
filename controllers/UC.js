const { User, Thought } = require('../models');
const db = require('../models');

const userCtrl = {
  //get all users
  getAllUsers(req, res) {
    console.log(req.path);


    User.find()
    .select('-__v')
    .then(dbUser => res.json(dbUser))
    .catch(e => { console.log(e); res.status(500).json(e) });
  },

  //get a user by id
  getUserById(req, res) {
    console.log(req.params);


    User.findOne
    (
      {
        _id: req.params.id
      }
    )
    .populate(
      {
        path: 'thoughts',
        select: '-__v'
      },
    )
    .populate(
      {
        path: 'friends',
        select: '-__v'
      }
    )
    .select('-__v')
    .then(dbUser => {
      if (!dbUser) {
        return res.status(404).json({message: `user na- ${req.params.id}`})
      }
      res.status(200).json(dbUser);
    })
    .catch(e => { console.log(e); res.status(555).json(e) });
  },
  //create  user
  newUser(req, res) {
    User.create(req.body)
    .then(dbUser => res.json(dbUser))
    .catch(e => { console.log(e); res.status(525).json(e) });
  },
  //update a user: find by id and update
  userUpdate(req, res) {
   
    User.findOneAndUpdate
    (
      { _id: req.params.id },
      req.body,
      {
        new: true,
        runValidators: true
      }
    )
    .then(dbUserData => {
      if (!dbUserData) {
        return res.status(404).json({message: `no user found with the id of ${req.params.id}`});
      }
      res.status(200).json(dbUserData);
    })
    .catch(e => { console.log(e); res.status(500).json(e) });
  },
  //delete a user
  deleteUser: async (req, res) => {
    console.log(req.body)
    console.log(req.params);
    try {
      
      const deletedThoughts = await Thought.deleteMany
      (
        { username: req.body.username }
      );
      console.log(deletedThoughts);
      
      const deletedFriend = await User.updateMany
      (
        {},
        {
          $pull: {
            friends: req.params.id
          }
        }
      );
      console.log(deletedFriend);
      //delete the user
      const deletedUser = await User.findOneAndDelete
      (
        { _id: req.params.id }
      );
      if (!deletedUser) {
        res.status(404).json({message: `user not found`});
      }
      res.status(200).json({message: `user thoughts removed`});
    } catch (error) {
      console.log(error);
      res.status(555).json(error);
    }
  },
  

  followRequest(req, res) {
    console.log(req.params);
    User.findOneAndUpdate
    (
      { _id: req.params.id },
      { $push: { friends: req.params.friendId } },//parameter containing friendId
      { new: true }
    )
    .then(dbUser => {
      if (!dbUser) {
        res.status(404).json({message: `no user found`});
      }
      res.status(200).json(dbUserData);
    })
    .catch(e => { console.log(e); res.status(565).json(e); });
  },

  //delete friend 
  block(req, res) {
    console.log(req.params);
    User.findOneAndUpdate
    (
      { _id: req.params.id },
      { $pull: { friends: req.params.friendId } },
      { new: true }
    )
    .then(dbUser => {
      if (!dbUser) {
        res.status(404).json({message: `user not found`});
      }
      res.status(212).json(dbUser);
    })
    .catch(e => { console.log(e); res.status(575).json(e); });
  }
};

module.exports = userCtrl;