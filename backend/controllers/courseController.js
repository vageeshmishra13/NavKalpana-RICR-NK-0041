const Course = require('../models/Course');
const User = require('../models/User');

// @desc    Get all courses for student
// @route   GET /api/courses
// @access  Private
exports.getCourses = async (req, res) => {
    try {
        const courses = await Course.find({ studentId: req.user._id });
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Private
exports.getCourseById = async (req, res) => {
    try {
        const course = await Course.findOne({ _id: req.params.id, studentId: req.user._id });
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.json(course);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Mark lesson as complete
// @route   PUT /api/courses/:id/modules/:moduleId/lessons/:lessonId/complete
// @access  Private
exports.markLessonComplete = async (req, res) => {
    try {
        const course = await Course.findOne({ _id: req.params.id, studentId: req.user._id });
        if (!course) return res.status(404).json({ message: 'Course not found' });

        const module = course.modules.id(req.params.moduleId);
        if (!module) return res.status(404).json({ message: 'Module not found' });

        const lesson = module.lessons.id(req.params.lessonId);
        if (!lesson) return res.status(404).json({ message: 'Lesson not found' });

        if (!lesson.isCompleted) {
            lesson.isCompleted = true;
            course.lessonsCompleted += 1;
            course.progressPercentage = Math.round((course.lessonsCompleted / course.totalLessons) * 100);

            await course.save();

            // Update student streak
            const user = await User.findById(req.user._id);
            const today = new Date().toDateString();
            const lastActive = user.lastActiveDate ? new Date(user.lastActiveDate).toDateString() : null;

            if (today !== lastActive) {
                user.learningStreak += 1;
                user.lastActiveDate = new Date();
                await user.save();
            }

            res.json({ course, userStreak: user.learningStreak });
        } else {
            res.json({ message: 'Lesson already completed', course });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Mark entire course as complete (demo button)
// @route   PUT /api/courses/:id/complete
// @access  Private
exports.markCourseComplete = async (req, res) => {
    try {
        const course = await Course.findOne({ _id: req.params.id, studentId: req.user._id });
        if (!course) return res.status(404).json({ message: 'Course not found' });

        // Mark all lessons as completed
        course.modules.forEach(m => {
            m.lessons.forEach(l => {
                l.isCompleted = true;
            });
        });

        course.lessonsCompleted = course.totalLessons;
        course.progressPercentage = 100;
        await course.save();

        res.json(course);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
