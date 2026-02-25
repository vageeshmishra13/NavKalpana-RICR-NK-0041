const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    questionText: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswer: { type: String, required: true },
});

const quizSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    durationMins: {
        type: Number,
        required: true,
    },
    questions: [questionSchema],
    totalQuestions: {
        type: Number,
        required: true,
    },
    scorePercentage: {
        type: Number,
        default: null,
    },
    correctAnswers: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        enum: ['Pending', 'Completed'],
        default: 'Pending',
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
}, { timestamps: true });

module.exports = mongoose.model('Quiz', quizSchema);
