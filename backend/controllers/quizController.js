const Quiz = require('../models/Quiz');
const User = require('../models/User');

// @desc    Get all quizzes for student
// @route   GET /api/quizzes
// @access  Private
exports.getQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.find({ studentId: req.user._id });
        res.json(quizzes);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Submit a quiz
// @route   POST /api/quizzes/:id/submit
// @access  Private
exports.submitQuiz = async (req, res) => {
    try {
        const { answers } = req.body;
        const quiz = await Quiz.findOne({ _id: req.params.id, studentId: req.user._id });

        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        if (quiz.status === 'Completed') {
            return res.status(400).json({ message: 'Quiz already completed' });
        }

        let correctAnswersCount = 0;

        // Evaluate answers
        quiz.questions.forEach((q, index) => {
            // Assuming answers array matches questions array order
            if (answers[index] === q.correctAnswer) {
                correctAnswersCount++;
            }
        });

        const scorePercentage = Math.round((correctAnswersCount / quiz.totalQuestions) * 100);

        quiz.correctAnswers = correctAnswersCount;
        quiz.scorePercentage = scorePercentage;
        quiz.status = 'Completed';

        await quiz.save();

        // Update streak
        const user = await User.findById(req.user._id);
        const today = new Date().toDateString();
        const lastActive = user.lastActiveDate ? new Date(user.lastActiveDate).toDateString() : null;

        if (today !== lastActive) {
            user.learningStreak += 1;
            user.lastActiveDate = new Date();
            await user.save();
        }

        res.json({ quiz, userStreak: user.learningStreak });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
