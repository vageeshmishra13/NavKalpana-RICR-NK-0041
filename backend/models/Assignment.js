const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    deadline: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['Not Submitted', 'Submitted', 'Late', 'Evaluated'],
        default: 'Not Submitted',
    },
    submissionType: {
        type: String,
        enum: ['file', 'text', 'link'],
        required: true,
    },
    submissionData: {
        type: String,
    },
    submissionTime: {
        type: Date,
    },
    marks: {
        type: Number,
        default: null,
    },
    feedback: {
        type: String,
    },
    isLate: {
        type: Boolean,
        default: false,
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
}, { timestamps: true });

module.exports = mongoose.model('Assignment', assignmentSchema);
