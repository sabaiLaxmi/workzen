const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { approveTimesheet, rejectTimesheet } = require('../controllers/approvalController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const { validate } = require('../middlewares/validateMiddleware');

// Only admins and managers can approve or reject
router.put('/:id/approve', protect, authorize('admin', 'manager'), approveTimesheet);
router.put(
  '/:id/reject',
  protect,
  authorize('admin', 'manager'),
  [
    body('notes', 'Notes are required when rejecting').not().isEmpty(),
  ],
  validate,
  rejectTimesheet
);

module.exports = router;
