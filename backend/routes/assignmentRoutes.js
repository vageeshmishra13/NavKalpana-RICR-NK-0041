const express = require('express');
const router = express.Router();
const {
    getAssignments,
    submitAssignment
} = require('../controllers/assignmentController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getAssignments);
router.post('/:id/submit', submitAssignment);

module.exports = router;
