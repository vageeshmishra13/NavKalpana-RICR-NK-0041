const Attendance = require('../models/Attendance');

// @desc    Get all attendance records for student
// @route   GET /api/attendance
// @access  Private
exports.getAttendance = async (req, res) => {
    try {
        const attendance = await Attendance.find({ studentId: req.user._id }).populate('courseId', 'title');
        res.json(attendance);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
