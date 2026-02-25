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
        const allQuizzes = await Quiz.find({ studentId: userId });
        const completedQuizzes = allQuizzes.filter(q => q.status === 'Completed');
        let quizAvg = 0;
        if (completedQuizzes.length > 0) {
            quizAvg = completedQuizzes.reduce((acc, q) => acc + (q.scorePercentage || 0), 0) / completedQuizzes.length;
        }

        // 2. Assignments
        const allAssignments = await Assignment.find({ studentId: userId });
        const submittedAssignments = allAssignments.filter(a => ['Submitted', 'Late', 'Evaluated'].includes(a.status));
        const evaluatedAssignments = allAssignments.filter(a => a.status === 'Evaluated');

        // Assignment avg = avg of evaluated marks; fallback to mock 80 for submitted
        let assignmentAvg = 0;
        if (allAssignments.length > 0) {
            const totalMarks = allAssignments.reduce((acc, a) => {
                if (a.status === 'Evaluated' && a.marks != null) return acc + a.marks;
                if (a.status === 'Submitted' || a.status === 'Late') return acc + 80; // mock score
                return acc; // Not submitted = 0 contribution
            }, 0);
            assignmentAvg = totalMarks / allAssignments.length;
        }

        // On-time submissions = submitted before deadline (not Late)
        const onTimeSubmissions = allAssignments.filter(a => a.status === 'Submitted' || a.status === 'Evaluated').length;
        const consistency = allAssignments.length > 0
            ? (onTimeSubmissions / allAssignments.length) * 100
            : 0;

        // Assignment completion percentage
        const assignmentCompletion = allAssignments.length > 0
            ? (submittedAssignments.length / allAssignments.length) * 100
            : 0;

        // 3. Courses — module/lesson completion
        const courses = await Course.find({ studentId: userId });
        let completionRate = 0;
        let totalModules = 0;
        let completedModules = 0;

        if (courses.length > 0) {
            completionRate = courses.reduce((acc, c) => acc + (c.progressPercentage || 0), 0) / courses.length;
            courses.forEach(c => {
                c.modules.forEach(m => {
                    totalModules++;
                    const allDone = m.lessons.every(l => l.isCompleted);
                    if (allDone && m.lessons.length > 0) completedModules++;
                });
            });
        }

        const moduleCompletionPct = totalModules > 0 ? (completedModules / totalModules) * 100 : 0;

        // 4. Consistency based on learningStreak
        const user = await User.findById(userId);

        // OGI Calculation
        const OGI = (quizAvg * 0.40) + (assignmentAvg * 0.30) + (completionRate * 0.20) + (consistency * 0.10);

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
                consistency: Math.round(consistency),
                moduleCompletionPct: Math.round(moduleCompletionPct),
                assignmentCompletion: Math.round(assignmentCompletion),
                totalQuizzes: allQuizzes.length,
                completedQuizzes: completedQuizzes.length,
                totalAssignments: allAssignments.length,
                submittedAssignments: submittedAssignments.length,
                onTimeSubmissions,
                learningStreak: user?.learningStreak || 0,
            }
        });

    } catch (error) {
        console.error('Analytics error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};
