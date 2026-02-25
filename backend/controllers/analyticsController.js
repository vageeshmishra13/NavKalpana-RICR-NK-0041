const Course = require('../models/Course');
const Assignment = require('../models/Assignment');
const Quiz = require('../models/Quiz');
const User = require('../models/User');

// @desc    Get user analytics and OGI
// @route   GET /api/analytics
// @access  Private
exports.getAnalytics = async (req, res) => {
    try {
        const userId = req.user._id;

        // 1. Quizzes
        const quizzes = await Quiz.find({ studentId: userId, status: 'Completed' });
        let quizAvg = 0;
        if (quizzes.length > 0) {
            quizAvg = quizzes.reduce((acc, q) => acc + q.scorePercentage, 0) / quizzes.length;
        }

        // 2. Assignments
        const assignments = await Assignment.find({ studentId: userId, status: { $in: ['Evaluated', 'Submitted', 'Late'] } });
        let assignmentAvg = 0;
        // Mock assignment score if not evaluated yet but submitted
        if (assignments.length > 0) {
            assignmentAvg = assignments.reduce((acc, a) => acc + (a.marks || 85), 0) / assignments.length;
        }

        // 3. Completion Rate (Courses)
        const courses = await Course.find({ studentId: userId });
        let completionRate = 0;
        if (courses.length > 0) {
            completionRate = courses.reduce((acc, c) => acc + c.progressPercentage, 0) / courses.length;
        }

        // 4. Consistency (Based on streak, max 100)
        const user = await User.findById(userId);
        let consistency = Math.min((user.learningStreak / 30) * 100, 100);

        // OGI Calculation
        // (Quiz Average × 0.40) + (Assignment Average × 0.30) + (Completion Rate × 0.20) + (Consistency × 0.10)
        const OGI = (quizAvg * 0.4) + (assignmentAvg * 0.3) + (completionRate * 0.2) + (consistency * 0.1);

        let classification = 'Needs Attention';
        if (OGI >= 85) classification = 'Excellent';
        else if (OGI >= 70) classification = 'Improving';
        else if (OGI >= 50) classification = 'Stable';

        res.json({
            OGI: Math.round(OGI),
            classification,
            metrics: {
                quizAvg: Math.round(quizAvg),
                assignmentAvg: Math.round(assignmentAvg),
                completionRate: Math.round(completionRate),
                consistency: Math.round(consistency)
            }
        });

    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
