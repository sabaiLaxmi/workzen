const User = require('../models/User');
const { validationResult } = require('express-validator');

const Project = require('../models/Project');

// @desc    Get all employees
// @route   GET /api/users
// @access  Private/Admin/Manager
const getEmployees = async (req, res, next) => {
  try {
    let query = { role: 'employee' };

    // Both Admins and Managers should be able to see all employees
    // so that managers can assign any employee to their projects.
    // Removed the previous restriction that limited managers to only already-assigned employees.

    const users = await User.find(query).select('-password');
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// @desc    Get employee by ID
// @route   GET /api/users/:id
// @access  Private/Admin/Manager
const getEmployeeById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (user) {
      if (req.user.role === 'manager') {
        const assignedProjects = await Project.find({ manager: req.user._id, assignedEmployees: req.params.id });
        if (assignedProjects.length === 0) {
          return res.status(403).json({ message: 'Not authorized to view this user' });
        }
      }
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create a user
// @route   POST /api/users
// @access  Private/Admin
const createUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'employee',
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    next(error);
  }
};
// @desc    Update a user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      user.name = req.body.name || user.name;
      user.role = req.body.role || user.role;
      
      if (req.body.email && req.body.email !== user.email) {
        const emailExists = await User.findOne({ email: req.body.email });
        if (emailExists) {
          return res.status(400).json({ message: 'Email is already taken' });
        }
        user.email = req.body.email;
      }
      
      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      await user.deleteOne();
      res.json({ message: 'User removed' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
};
module.exports = {
  getEmployees,
  getEmployeeById,
  createUser,
  updateUser,
  deleteUser,
};
