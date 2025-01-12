const Club = require("../models/Club");
const User = require("../models/User");

// Fetch all clubs
const getAllClubs = async (req, res) => {
  try {
    const clubs = await Club.find().populate("clubLeadId", "name email");
    res.status(200).json(clubs);
  } catch (error) {
    res.status(500).json({ error: "Error fetching clubs" });
  }
};

// Fetch details of a specific club by ID
const getClubDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const club = await Club.findById(id)
      .populate("clubLeadId", "name email")
      .populate("clubMembers.student", "name email");
    if (!club) {
      return res.status(404).json({ error: "Club not found" });
    }
    res.status(200).json(club);
  } catch (error) {
    res.status(500).json({ error: "Error fetching club details" });
  }
};

// Fetch clubs affiliated with the logged-in user
const getUserAffiliatedClubs = async (req, res) => {
  try {
    const token = getTokenFromRequest(req);
    if (!token) {
        return res.status(401).json({ message: "Authentication token is missing" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;

    const user = await User.findById(userId).populate(
        "clubAffiliations.clubId",
        "name clubLogo description"
    );

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.clubAffiliations.map((aff) => aff.clubId));
} catch (error) {
    res.status(500).json({ message: "Error fetching affiliated clubs", error: error.message });
}
};

// Create a new club
const createClub = async (req, res) => {
  const { name, description, clubLeadId } = req.body;
  try {
    const existingClub = await Club.findOne({ name });
    if (existingClub) {
      return res.status(400).json({ error: "Club name already exists" });
    }
    const newClub = new Club({
      name,
      description,
      clubLeadId,
      clubLogo: req.file.path,
    });
    await newClub.save();
    res.status(201).json(newClub);
  } catch (error) {
    res.status(500).json({ error: "Error creating club" });
  }
};

// Add a member to a club
const addMemberToClub = async (req, res) => {
  const { clubId, userId, role } = req.body;
  try {
    const club = await Club.findById(clubId);
    const user = await User.findById(userId);
    if (!club || !user) {
      return res.status(404).json({ error: "Club or user not found" });
    }
    const isMember = club.clubMembers.some(
      (member) => member.student.toString() === userId
    );
    if (isMember) {
      return res.status(400).json({ error: "User is already a member" });
    }
    club.clubMembers.push({ student: userId, role });
    user.clubAffiliations.push({ clubId, clubName: club.name });
    await club.save();
    await user.save();
    res.status(200).json({ message: "Member added successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error adding member to club" });
  }
};

module.exports = {
  getAllClubs,
  getClubDetails,
  getUserAffiliatedClubs,
  createClub,
  addMemberToClub,
};
