const express = require('express');
const router = express.Router();
const {
    getQuizzes,
    submitQuiz
} = require('../controllers/quizController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getQuizzes);
router.post('/:id/submit', submitQuiz);

module.exports = router;
