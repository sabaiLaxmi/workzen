const express = require('express');
const { body } = require('express-validator');
const { createProject, getProjects, assignEmployees, getProjectById, updateProject, deleteProject, getProjectTeam } = require('../controllers/projectController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const { validate } = require('../middlewares/validateMiddleware');

const router = express.Router();

router.use(protect);

router.post(
  '/',
  authorize('admin', 'manager'),
  [
    body('name', 'Project name is required').not().isEmpty(),
  ],
  validate,
  createProject
);

router.get('/', getProjects);

router.put(
  '/:id/assign',
  authorize('admin', 'manager'),
  [
    body('employeeIds', 'employeeIds array is required').isArray(),
  ],
  validate,
  assignEmployees
);

router.get('/:id/team', getProjectTeam);
router.get('/:id', getProjectById);

router.put(
  '/:id',
  authorize('admin', 'manager'),
  [
    body('status', 'Invalid status').optional().isIn(['active', 'completed', 'archived']),
  ],
  validate,
  updateProject
);

router.delete('/:id', authorize('admin', 'manager'), deleteProject);

module.exports = router;
