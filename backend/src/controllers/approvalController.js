const Timesheet = require('../models/Timesheet');
const Project = require('../models/Project');
const ActivityLog = require('../models/ActivityLog');

const approveTimesheet = async (req, res) => {
  try {
    const timesheetId = req.params.id;
    const timesheet = await Timesheet.findById(timesheetId).populate('project');

    if (!timesheet) {
      return res.status(404).json({ message: 'Timesheet not found' });
    }

    // Check if user is the manager of the project or an admin
    if (req.user.role !== 'admin' && timesheet.project.manager.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to approve this timesheet' });
    }

    if (timesheet.status !== 'pending') {
      return res.status(400).json({ message: `This timesheet has already been ${timesheet.status} and cannot be changed again.` });
    }

    timesheet.status = 'approved';
    await timesheet.save();

    await ActivityLog.create({
      userId: req.user._id,
      action: 'timesheet_approved',
      details: `Timesheet ${timesheet._id} approved for project ${timesheet.project.name}`
    });

    res.json({ message: 'Timesheet approved', timesheet });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const rejectTimesheet = async (req, res) => {
  try {
    const timesheetId = req.params.id;
    const { notes } = req.body;
    const timesheet = await Timesheet.findById(timesheetId).populate('project');

    if (!timesheet) {
      return res.status(404).json({ message: 'Timesheet not found' });
    }

    // Check if user is the manager of the project or an admin
    if (req.user.role !== 'admin' && timesheet.project.manager.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to reject this timesheet' });
    }

    if (timesheet.status !== 'pending') {
      return res.status(400).json({ message: `This timesheet has already been ${timesheet.status} and cannot be changed again.` });
    }

    timesheet.status = 'rejected';
    if (notes) timesheet.notes = notes;
    await timesheet.save();

    const details = notes 
      ? `Timesheet ${timesheet._id} rejected for project ${timesheet.project.name}. Notes: ${notes}`
      : `Timesheet ${timesheet._id} rejected for project ${timesheet.project.name}`;

    await ActivityLog.create({
      userId: req.user._id,
      action: 'timesheet_rejected',
      details
    });

    res.json({ message: 'Timesheet rejected', timesheet });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { approveTimesheet, rejectTimesheet };
