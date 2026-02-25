const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
    title: { type: String, required: true },
    duration: { type: String, required: true },
    isCompleted: { type: Boolean, default: false }
});

const moduleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    lessons: [lessonSchema]
});

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    instructor: {
        type: String,
        required: true,
    },
    thumbnailUrl: {
        type: String,
        default: 'https://via.placeholder.com/300x200?text=Course',
    },
    modules: [moduleSchema],
    totalLessons: {
        type: Number,
        required: true,
    },
    lessonsCompleted: {
        type: Number,
        default: 0,
    },
    progressPercentage: {
        type: Number,
        default: 0,
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
