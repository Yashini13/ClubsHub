
const UserRoles = {
  MEMBER: 'member',
  CLUB_ADMIN: 'clubAdmin',
  FACULTY_COORDINATOR: 'facultyCoordinator',
  SUPER_ADMIN: 'superAdmin',
};

  
  module.exports = {
    UserRoles,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRATION: '1h',
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  };