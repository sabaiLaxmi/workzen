const mongoose = require('mongoose');

const timesheetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  hours: {
    type: Number,
    required: true,
    min: 0,
    max: 24,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  notes: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

timesheetSchema.index({ user: 1, project: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Timesheet', timesheetSchema);
