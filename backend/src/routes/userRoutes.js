const express = require('express');
const { body } = require('express-validator');
const { getEmployees, getEmployeeById, createUser, updateUser, deleteUser } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const { validate } = require('../middlewares/validateMiddleware');

const router = express.Router();

// All routes require authentication and admin/manager role
router.use(protect);
router.use(authorize('admin', 'manager'));

router.get('/', getEmployees);
router.get('/:id', getEmployeeById);

router.post(
  '/',
  authorize('admin'),
  [
    body('name', 'Name is required').not().isEmpty(),
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
    body('role', 'Role must be employee, manager, or admin').optional().isIn(['employee', 'manager', 'admin']),
  ],
  validate,
  createUser
);

router.put('/:id', authorize('admin'), updateUser);
router.delete('/:id', authorize('admin'), deleteUser);

module.exports = router;
