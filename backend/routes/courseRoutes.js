const express = require('express');
const router = express.Router();
const {
    getCourses,
    getCourseById,
    markLessonComplete,
    markCourseComplete,
} = require('../controllers/courseController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getCourses);
router.get('/:id', getCourseById);
router.put('/:id/modules/:moduleId/lessons/:lessonId/complete', markLessonComplete);
router.put('/:id/complete', markCourseComplete);

module.exports = router;
