const router = require('express').Router();

const {
  getAllUsers,
  getUserById,
  userUpdate,
  newUser,
  followRequest,
  deleteUser,
  block
} = require('../../controllers/UC.js');

//user getAll and post routes
// /api/users
router
.route('/')
.get(getAllUsers)
.post(newUser);

//user get one, update one, and delete one
// /api/users/<userId>
router
.route('/:id')
.get(getUserById)
.put(userUpdate)
.delete(deleteUser);

//user adds a friend
// /api/users/<userId>/friends/<friendId>
router.route('/:id/friends/:friendId')
.post(followRequest);

//user deletes a friend
// /api/users/<userId>/friends/<friendId>
router.route('/:id/friends/:friendId')
.delete(block);

module.exports = router;