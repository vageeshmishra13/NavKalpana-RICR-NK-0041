const mongoose = require('mongoose');

const attendanceRecordSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    status: { type: String, enum: ['Present', 'Absent'], required: true }
});

const attendanceSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    totalClasses: {
        type: Number,
        required: true,
    },
    presentDays: {
        type: Number,
        default: 0,
    },
    attendancePercentage: {
        type: Number,
        default: 0,
    },
    attendanceHistory: [attendanceRecordSchema]
}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
