const Timesheet = require('../models/Timesheet');
const Project = require('../models/Project');
const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');

// @desc    Get report for a specific project
// @route   GET /api/reports/project/:id
// @access  Private/Admin/Manager
const getProjectReport = async (req, res, next) => {
  try {
    const projectId = req.params.id;

    // Verify project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (req.user.role === 'manager' && project.manager.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to view this project's report" });
    }

    // Aggregate hours per employee for this project
    const report = await Timesheet.aggregate([
      { $match: { project: project._id, status: 'approved' } },
      { 
        $group: {
          _id: '$user',
          totalHours: { $sum: '$hours' },
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'employee'
        }
      },
      { $unwind: '$employee' },
      {
        $project: {
          _id: 0,
          employeeId: '$_id',
          employeeName: '$employee.name',
          totalHours: 1,
        }
      }
    ]);

    const totalProjectHours = report.reduce((sum, record) => sum + record.totalHours, 0);

    res.json({
      project: {
        id: project._id,
        name: project.name,
      },
      totalProjectHours,
      employeeBreakdown: report,
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get report for a specific employee
// @route   GET /api/reports/employee/:id
// @access  Private/Admin/Manager
const getEmployeeReport = async (req, res, next) => {
  try {
    const employeeId = req.params.id;

    // Verify user exists
    const employee = await User.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    if (req.user.role === 'manager') {
      const projects = await Project.find({ manager: req.user._id, assignedEmployees: employeeId });
      if (projects.length === 0) {
        return res.status(403).json({ message: "Not authorized to view this employee's report" });
      }
    }

    // Aggregate hours per project for this employee
    const report = await Timesheet.aggregate([
      { $match: { user: employee._id, status: 'approved' } },
      {
        $group: {
          _id: '$project',
          totalHours: { $sum: '$hours' }
        }
      },
      {
        $lookup: {
          from: 'projects',
          localField: '_id',
          foreignField: '_id',
          as: 'projectDetails'
        }
      },
      { $unwind: '$projectDetails' },
      {
        $project: {
          _id: 0,
          projectId: '$_id',
          projectName: '$projectDetails.name',
          totalHours: 1,
        }
      }
    ]);

    const totalEmployeeHours = report.reduce((sum, record) => sum + record.totalHours, 0);

    res.json({
      employee: {
        id: employee._id,
        name: employee.name,
      },
      totalEmployeeHours,
      projectBreakdown: report,
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get activity log
// @route   GET /api/reports/activity-log
// @access  Private/Admin
const getActivityLog = async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 50, 200);

    const logs = await ActivityLog.find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('userId', 'name email role');

    res.json(logs);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProjectReport,
  getEmployeeReport,
  getActivityLog,
};
