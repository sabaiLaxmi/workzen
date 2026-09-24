const { validationResult } = require('express-validator');
const Project = require('../models/Project');
const User = require('../models/User');

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private/Admin/Manager
const createProject = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, assignedEmployees } = req.body;

    const project = new Project({
      name,
      description,
      manager: req.user._id,
      assignedEmployees: assignedEmployees || [],
    });

    const createdProject = await project.save();
    res.status(201).json(createdProject);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res, next) => {
  try {
    let query = {};
    if (req.user.role === 'employee') {
      // Employees only see projects they are assigned to
      query.assignedEmployees = req.user._id;
    }

    const projects = await Project.find(query)
      .populate('manager', 'name email')
      .populate('assignedEmployees', 'name email');
    
    res.json(projects);
  } catch (error) {
    next(error);
  }
};

// @desc    Assign employees to a project
// @route   PUT /api/projects/:id/assign
// @access  Private/Admin/Manager
const assignEmployees = async (req, res, next) => {
  try {
    const { employeeIds } = req.body; // Expecting an array of User IDs

    if (!Array.isArray(employeeIds)) {
      return res.status(400).json({ message: 'employeeIds must be an array' });
    }

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Ensure manager can only assign to their own projects
    if (req.user.role === 'manager' && project.manager.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to manage this project' });
    }

    const validUsers = await User.find({ _id: { $in: employeeIds }, role: 'employee' });
    if (validUsers.length !== employeeIds.length) {
      return res.status(400).json({ message: 'One or more employeeIds are invalid or do not belong to employee accounts.' });
    }

    project.assignedEmployees = employeeIds;
    const updatedProject = await project.save();

    res.json(updatedProject);
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single project
// @route   GET /api/projects/:id
// @access  Private
const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('manager', 'name email')
      .populate('assignedEmployees', 'name email');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (req.user.role === 'employee' && !project.assignedEmployees.some(emp => emp._id.toString() === req.user._id.toString())) {
      return res.status(403).json({ message: 'Not authorized to view this project' });
    }

    res.json(project);
  } catch (error) {
    next(error);
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private/Admin/Manager
const updateProject = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, status } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (req.user.role === 'manager' && project.manager.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this project' });
    }

    if (name) project.name = name;
    if (description !== undefined) project.description = description;
    if (status) project.status = status;

    const updatedProject = await project.save();
    res.json(updatedProject);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private/Admin/Manager
const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (req.user.role === 'manager' && project.manager.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this project' });
    }

    await project.deleteOne();
    res.json({ message: 'Project removed' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get project team
// @route   GET /api/projects/:id/team
// @access  Private
const getProjectTeam = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('manager', 'name email role')
      .populate('assignedEmployees', 'name email role');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (req.user.role === 'employee' && !project.assignedEmployees.some(emp => emp._id.toString() === req.user._id.toString())) {
      return res.status(403).json({ message: 'Not authorized to view this project team' });
    }

    res.json({
      projectId: project._id,
      manager: project.manager,
      team: project.assignedEmployees,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProject,
  getProjects,
  assignEmployees,
  getProjectById,
  updateProject,
  deleteProject,
  getProjectTeam,
};
