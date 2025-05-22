const Competition = require('../models/ActivitySchema');
const { getTokenFromRequest } = require('./authController');  // Reusing token logic from auth controller

exports.getMyActivity = async (req, res) => {
  try {
    const {id} = req.params;
    const token = getTokenFromRequest(req);

    if (!token) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const jwt = require('jsonwebtoken');
    const JWT_SECRET = process.env.JWT_SECRET;


    const userId = decoded.userId;

    // const competitions = await Competition.findById({ 'registeredUsers.userId': userId })
    //   .select('name description date image venue createdBy registeredUsers isActive')
    //   .populate('createdBy', 'name') // for organizer
    //   .sort({ 'registeredUsers.registeredAt': -1 });
    const competitions = await Competition.findById(id);

    if (!competitions.length) {
      return res.status(404).json({ message: 'No registered competitions found' });
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

