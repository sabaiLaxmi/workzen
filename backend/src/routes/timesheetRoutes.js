const express = require('express');
const { body } = require('express-validator');
const { submitTimesheet, getTimesheets, getTimesheetHistory, editTimesheet, deleteTimesheet } = require('../controllers/timesheetController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const { validate } = require('../middlewares/validateMiddleware');

const router = express.Router();

router.use(protect);

router.post(
  '/',
  [
    body('project', 'Project ID is required').not().isEmpty(),
    body('date', 'Please provide a valid date').isISO8601(),
    body('hours', 'Hours must be a number between 0 and 24').isFloat({ min: 0, max: 24 }),
  ],
  validate,
  submitTimesheet
);

router.get('/', getTimesheets);

router.get('/history/:userId', getTimesheetHistory);

router.put(
  '/:id',
  [
    body('hours', 'Hours must be a number between 0 and 24').optional().isFloat({ min: 0, max: 24 }),
  ],
  validate,
  editTimesheet
);

router.delete('/:id', deleteTimesheet);

module.exports = router;
