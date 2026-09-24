const { validationResult } = require('express-validator');
const Timesheet = require('../models/Timesheet');
const Project = require('../models/Project');

// @desc    Submit a new timesheet
// @route   POST /api/timesheets
// @access  Private
const submitTimesheet = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { project, date, hours, notes } = req.body;

    const existingProject = await Project.findById(project);
    if (!existingProject) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (req.user.role === 'employee' && !existingProject.assignedEmployees.includes(req.user._id)) {
      return res.status(403).json({ message: 'You are not assigned to this project' });
    }

    const timesheet = new Timesheet({
      user: req.user._id,
      project,
      date,
      hours,
      notes,
    });

    const createdTimesheet = await timesheet.save();
    res.status(201).json(createdTimesheet);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'A timesheet for this project on this date already exists.' });
    }
    next(error);
  }
};

// @desc    Get timesheets
// @route   GET /api/timesheets
// @access  Private
const getTimesheets = async (req, res, next) => {
  try {
    let query = {};
    if (req.user.role === 'employee') {
      query.user = req.user._id;
    } else if (req.user.role === 'manager') {
      const projects = await require('../models/Project').find({ manager: req.user._id });
      const projectIds = projects.map(p => p._id);
      query.project = { $in: projectIds };
    }

    const timesheets = await Timesheet.find(query)
      .populate('user', 'name email')
      .populate('project', 'name');
    res.json(timesheets);
  } catch (error) {
    next(error);
  }
};

// @desc    Get full timesheet history for an employee
// @route   GET /api/timesheets/history/:userId
// @access  Private
const getTimesheetHistory = async (req, res, next) => {
  try {
    const targetUserId = req.params.userId;
    
    if (req.user.role === 'employee' && req.user._id.toString() !== targetUserId) {
      return res.status(403).json({ message: 'Not authorized to view this history' });
    }

    let query = { user: targetUserId };

    if (req.user.role === 'manager') {
      const projects = await require('../models/Project').find({ manager: req.user._id });
      const projectIds = projects.map(p => p._id);
      query.project = { $in: projectIds };
    }

    const timesheets = await Timesheet.find(query)
      .sort({ date: -1 })
      .populate('user', 'name email')
      .populate('project', 'name');

    res.json(timesheets);
  } catch (error) {
    next(error);
  }
};

// @desc    Edit a pending timesheet
// @route   PUT /api/timesheets/:id
// @access  Private (Employee only)
const editTimesheet = async (req, res, next) => {
  try {
    const timesheet = await Timesheet.findById(req.params.id);

    if (!timesheet) {
      return res.status(404).json({ message: 'Timesheet not found' });
    }

    // Ensure the user owns this timesheet
    if (timesheet.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this timesheet' });
    }

    // Only allow editing if pending
    if (timesheet.status !== 'pending') {
      return res.status(400).json({ message: 'Can only edit pending timesheets' });
    }

    const { hours, notes } = req.body;
    if (hours !== undefined) timesheet.hours = hours;
    if (notes !== undefined) timesheet.notes = notes;

    const updatedTimesheet = await timesheet.save();
    res.json(updatedTimesheet);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a timesheet entry
// @route   DELETE /api/timesheets/:id
// @access  Private (Employee only)
const deleteTimesheet = async (req, res, next) => {
  try {
    const timesheet = await Timesheet.findById(req.params.id);

    if (!timesheet) {
      return res.status(404).json({ message: 'Timesheet not found' });
    }

    if (timesheet.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this timesheet' });
    }

    if (timesheet.status !== 'pending') {
      return res.status(400).json({ message: 'Can only delete pending timesheets' });
    }

    await timesheet.deleteOne();
    res.json({ message: 'Timesheet removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitTimesheet,
  getTimesheets,
  getTimesheetHistory,
  editTimesheet,
  deleteTimesheet,
};
