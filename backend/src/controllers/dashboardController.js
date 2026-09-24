const Timesheet = require('../models/Timesheet');
const Project = require('../models/Project');
const User = require('../models/User');

const getDashboardStats = async (req, res) => {
  try {
    const userRole = req.user.role;
    const userId = req.user._id;
    
    let stats = {};

    if (userRole === 'admin') {
      const totalUsers = await User.countDocuments();
      const totalProjects = await Project.countDocuments();
      const pendingTimesheets = await Timesheet.countDocuments({ status: 'pending' });
      
      stats = { totalUsers, totalProjects, pendingTimesheets };
    } else if (userRole === 'manager') {
      const managedProjects = await Project.find({ manager: userId });
      const projectIds = managedProjects.map(p => p._id);
      
      const pendingTimesheets = await Timesheet.countDocuments({ 
        project: { $in: projectIds },
        status: 'pending' 
      });
      
      stats = { managedProjects: managedProjects.length, pendingTimesheets };
    } else {
      // Employee stats
      const myTimesheets = await Timesheet.find({ user: userId });
      const pending = myTimesheets.filter(t => t.status === 'pending').length;
      const approved = myTimesheets.filter(t => t.status === 'approved').length;
      const totalHours = myTimesheets.reduce((acc, t) => acc + (t.status === 'approved' ? t.hours : 0), 0);
      
      stats = { pending, approved, totalApprovedHours: totalHours };
    }

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardStats };
