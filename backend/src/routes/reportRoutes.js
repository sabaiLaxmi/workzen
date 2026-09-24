const express = require('express');
const { getProjectReport, getEmployeeReport, getActivityLog } = require('../controllers/reportController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

const router = express.Router();

router.use(protect);
router.use(authorize('admin', 'manager'));

router.get('/project/:id', getProjectReport);
router.get('/employee/:id', getEmployeeReport);

router.get('/activity-log', authorize('admin'), getActivityLog);

module.exports = router;
