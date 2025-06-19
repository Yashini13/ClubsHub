const express = require('express');
const router = express.Router();
const { getMyActivity } = require('../Controller/activityController');

// Route for fetching competition activity for a logged-in user
const { auth, authorize } = require('../middleware/authMiddleware'); // Adjust path if needed
router.get('/:id', auth, authorize(['member']), getMyActivity);


module.exports = router;
