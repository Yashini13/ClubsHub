const express = require("express");
const router = express.Router();
const {
  getAllClubs,
  createClub,
  addMemberToClub,
  getClubDetails,
  getUserAffiliatedClubs,
} = require("../Controller/clubController");

const { auth, authorize } = require("../middleware/authMiddleware");
const { uploadLogo } = require("../middleware/uploadMiddleware");

// Get all clubs
router.get("/", auth, getAllClubs);

// Get details of a specific club by ID
router.get("/:id", auth, getClubDetails);

// Get clubs affiliated with a specific user
router.get("/my-clubs", auth, getUserAffiliatedClubs);

// Create a new club
router.post(
  "/create",
  auth,
  authorize(["superAdmin"]),
  uploadLogo,
  createClub
);

// Add a member to a club
router.post(
  "/add-member",
  auth,
  authorize(["superAdmin", "clubAdmin"]),
  addMemberToClub
);

module.exports = router;
