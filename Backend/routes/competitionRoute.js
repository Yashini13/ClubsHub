const express = require('express');
const router = express.Router();
const { getMyActivity } = require('../Controller/CompetitionContoller');

// Route for fetching competition activity for a logged-in user
router.get('/my-activity', getMyActivity);

module.exports = router;
