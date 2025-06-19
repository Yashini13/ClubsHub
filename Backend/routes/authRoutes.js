// const express = require('express');
// const router = express.Router();
// const {
//   login,
//   register,
//   logout,
//   updateProfile, 
//   getUserProfile,
//   getUserDetails,getFacultyDetails
// } = require('../Controller/authController'); 
// const { auth, authorize } = require('../middleware/authMiddleware');


// router.post('/register', register);
// router.post('/login', login);


// router.post('/logout', auth, logout);
// router.get('/profile', auth, authorize(['member', 'superAdmin', 'clubAdmin','facultyCoordinator']), getUserProfile);
// router.put('/update-profile', auth, authorize(['member', 'superAdmin', 'clubAdmin','facultyCoordinator']), updateProfile); 
// router.get('/get-user-details',auth,getUserDetails)

// module.exports = router;


const express = require('express');
const passport = require('../googleauth'); // Google Auth
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRATION } = require('../config/constants');
const {
  login,
  register,
  logout,
  updateProfile, 
  getUserProfile,
  getUserDetails,
  getFacultyDetails
} = require('../Controller/authController'); 
const { auth, authorize } = require('../middleware/authMiddleware');
const session = require('express-session');
const router = express.Router();

// Local Authentication Routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', auth, logout);
router.get('/profile', auth, authorize(['member', 'superAdmin', 'clubAdmin','facultyCoordinator']), getUserProfile);
router.put('/update-profile', auth, authorize(['member', 'superAdmin', 'clubAdmin','facultyCoordinator']), updateProfile); 
router.get('/get-user-details', auth, getUserDetails);


// Session

// Google OAuth Login
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth Callback
router.get('/google/callback', passport.authenticate('google', { session: false }), (req, res) => {
  const user = req.user;

  // Generate JWT token
  const token = jwt.sign({ userId: user._id, email: user.email, role: user.role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRATION,
  });

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });

  // Redirect user to frontend after login
  res.redirect('http://localhost:5173/member-dashboard'); // Update to your frontend URL
});

module.exports = router;
