const router = require('express').Router();
const usersTraffic = require('./user-routes.js');
const thoughtsTraffic = require('./thought-routes.js');

//add prefix of /users to the routes created in user-routes.js
router.use('/users', usersTraffic);
//add prefix of /thoughts to the routes created in thought-routes.js
router.use('/thoughts', thoughtsTraffic);

module.exports = router;