// const Competition = require('../models/competitionSchema');
// const { getTokenFromRequest } = require('./authController');  // Reusing token logic from auth controller
// const jwt = require('jsonwebtoken');
// const { JWT_SECRET } = require('../config/constants'); // Adjust the path as needed

// exports.getMyActivity = async (req, res) => {
//   try {
//     const token = getTokenFromRequest(req);

//     if (!token) {
//       return res.status(401).json({ message: 'Not authenticated' });
//     }

//     const decoded = jwt.verify(token, JWT_SECRET);

//     const userId = decoded.userId;

//     const competitions = await Competition.find({ 'registeredUsers.userId': userId })
//     .select('name description date')
//     .sort({ date: -1 });


//     if (!competitions.length) {
//       return res.status(404).json({ message: 'No registered competitions found' });
//     }

//     return res.status(200).json({
//       success: true,
//       competitions
//     });
//   } catch (err) {
//     console.error('Error fetching competitions:', err);
//     return res.status(500).json({ message: 'Server Error', error: err.message });
//   }
// };
const Competition = require('../models/competitionSchema');

exports.getMyActivity = async (req, res) => {
  try {
    // You can fetch all competitions or filter by a query parameter if needed
    const competitions = await Competition.find()
      .select('name description date')
      .sort({ date: -1 });

    if (!competitions.length) {
      return res.status(404).json({ message: 'No competitions found' });
    }

    return res.status(200).json({
      success: true,
      competitions
    });
  } catch (err) {
    console.error('Error fetching competitions:', err);
    return res.status(500).json({ message: 'Server Error', error: err.message });
  }
};
