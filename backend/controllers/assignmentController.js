const Assignment = require('../models/Assignment');
const User = require('../models/User');

// @desc    Get all assignments for student
// @route   GET /api/assignments
// @access  Private
exports.getAssignments = async (req, res) => {
    try {
        const assignments = await Assignment.find({ studentId: req.user._id });
        res.json(assignments);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Submit an assignment
// @route   POST /api/assignments/:id/submit
// @access  Private
exports.submitAssignment = async (req, res) => {
    try {
        const { submissionData, submissionType } = req.body;
        const assignment = await Assignment.findOne({ _id: req.params.id, studentId: req.user._id });

        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        if (assignment.status === 'Evaluated') {
            return res.status(400).json({ message: 'Assignment already evaluated' });
        }

        const now = new Date();
        const isLate = now > assignment.deadline;

        assignment.submissionData = submissionData;
        assignment.submissionType = submissionType || assignment.submissionType;
        assignment.submissionTime = now;
        assignment.status = isLate ? 'Late' : 'Submitted';
        assignment.isLate = isLate;

        await assignment.save();

        // Update streak
        const user = await User.findById(req.user._id);
        const today = now.toDateString();
        const lastActive = user.lastActiveDate ? new Date(user.lastActiveDate).toDateString() : null;

        if (today !== lastActive) {
            user.learningStreak += 1;
            user.lastActiveDate = new Date();
            await user.save();
        }

        res.json({ assignment, userStreak: user.learningStreak });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
