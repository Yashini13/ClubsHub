// const getUserAffiliatedClubs = async (req, res) => {
//   try {
//     const token = getTokenFromRequest(req);
//     if (!token) {
//         return res.status(401).json({ message: "Authentication token is missing" });
//     }

//     const decoded = jwt.verify(token, JWT_SECRET);
//     const userId = decoded.id;

//     const user = await User.findById(userId).populate(
//         "clubAffiliations.clubId",
//         "name clubLogo description"
//     );

//     if (!user) {
//         return res.status(404).json({ message: "User not found" });
//     }

//     res.status(200).json(user.clubAffiliations.map((aff) => aff.clubId));
// } catch (error) {
//     res.status(500).json({ message: "Error fetching affiliated clubs", error: error.message });
// }
// };
const mongoose = require("mongoose");

const ClubSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  clubLeadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  clubLogo: {
    type: String,  
    required: true,
    trim: true,
  },
  facultyCoordinater:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
  ,
  clubMembers: [
    {
      student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      role: {
        type: String,
        default: "member", 
      },
      joinedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  clubCategory:{
    type:String,
    required:true
  }
});

const Club = mongoose.model('Club', ClubSchema);
module.exports = Club;