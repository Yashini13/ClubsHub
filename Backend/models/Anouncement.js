


const mongoose = require('mongoose');
const { UserRoles } = require('../config/constants');

const AnnouncementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event'
    },
    clubId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Club'
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    createdByRole: {
      type: String,
      enum: [UserRoles.CLUB_ADMIN, UserRoles.SUPER_ADMIN],
      required: true
    },
    targetAudience: [{
      type: String,
      enum: Object.values(UserRoles),
      
    }],
    allowedRolesToView: [{
      type: String,
      enum: Object.values(UserRoles),
      required: true
    }],
    attachments: [{
      type: String
    }],
    priority: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH'],
      default: 'MEDIUM'
    },
    status: {
      type: String,
      enum: ['PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'PUBLISHED'],
      default: 'PENDING_APPROVAL'
    },
    visibleFrom: {
      type: Date,
      default: Date.now
    },
    visibleUntil: {
      type: Date
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Announcement', AnnouncementSchema);

