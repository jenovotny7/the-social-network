const router = require('express').Router();
const usersTraffic = require('./URoutes.js');
const thoughtsTraffic = require('./TRoutes.js');


router.use('/users', usersTraffic);
router.use('/thoughts', thoughtsTraffic);


module.exports = router;