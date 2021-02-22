const router = require('express').Router();

const {
  newThought,
  removeThought,
  newReaction,
  removeReaction,
  GAT,
  GTBI,
  putThought,
  putReaction
} = require('../../controllers/TC.js');


router.route('/')
.get(GAT)
.post(newThought);


// /api/thoughts/:id
router.route('/:id')
.get(GTBI)
.put(putThought)

router.route('/:id/users/:userId')
.delete(removeThought);



// /api/thoughts/:id/reactions/
router.route('/:id/reactions/')
.post(newReaction);


// /api/thoughts/:id/reactions/<reactionId>
router.route('/:id/reactions/:reactionId')
.put(putReaction)
.delete(removeReaction);

module.exports = router;