const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Course = require('./models/Course');
const Quiz = require('./models/Quiz');
const Assignment = require('./models/Assignment');

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for seeding...');

        // Clear existing data
        await User.deleteMany();
        await Course.deleteMany();
        await Quiz.deleteMany();
        await Assignment.deleteMany();

        console.log('Existing data cleared.');

        // 1. Create User
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        const user = await User.create({
            name: 'Vageesh Mishra',
            email: 'test@example.com',
            password: 'password123', // Will be hashed by pre-save hook
            learningStreak: 5,
            skillsAcquired: 4,
            totalSkills: 10,
            weeklyActivity: [2, 4, 1, 5, 3, 0, 0]
        });

        console.log('User created:', user.email);

        // 2. Create Courses
        const courses = await Course.insertMany([
            {
                title: 'Full Stack Web Development',
                instructor: 'Dr. Sumit Gupta',
                thumbnailUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=300&q=80',
                studentId: user._id,
                totalLessons: 12,
                lessonsCompleted: 8,
                progressPercentage: 66,
                modules: [
                    {
                        title: 'Introduction to React',
                        lessons: [
                            { title: 'JSX Basics', duration: '15:00', isCompleted: true },
                            { title: 'Components & Props', duration: '20:00', isCompleted: true },
                            { title: 'State & Lifecycle', duration: '25:00', isCompleted: true }
                        ]
                    },
                    {
                        title: 'Backend with Node.js',
                        lessons: [
                            { title: 'Express Middleware', duration: '18:00', isCompleted: true },
                            { title: 'MongoDB Integration', duration: '22:00', isCompleted: true },
                            { title: 'JWT Auth', duration: '30:00', isCompleted: false }
                        ]
                    }
                ]
            },
            {
                title: 'Artificial Intelligence & ML',
                instructor: 'Prof. Anjali Sharma',
                thumbnailUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=300&q=80',
                studentId: user._id,
                totalLessons: 10,
                lessonsCompleted: 3,
                progressPercentage: 30,
                modules: [
                    {
                        title: 'Python for Data Science',
                        lessons: [
                            { title: 'NumPy & Pandas', duration: '40:00', isCompleted: true },
                            { title: 'Matplotlib Basics', duration: '15:00', isCompleted: true }
                        ]
                    }
                ]
            },
            {
                title: 'Data Structures & Algorithms',
                instructor: 'Er. Rohit Kumar',
                thumbnailUrl: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&w=300&q=80',
                studentId: user._id,
                totalLessons: 15,
                lessonsCompleted: 0,
                progressPercentage: 0,
                modules: [
                    {
                        title: 'Arrays & Strings',
                        lessons: [
                            { title: 'Two Pointer Approach', duration: '20:00', isCompleted: false },
                            { title: 'Sliding Window', duration: '25:00', isCompleted: false }
                        ]
                    }
                ]
            }
        ]);

        console.log('Courses seeded.');

        // 3. Create Quizzes
        await Quiz.insertMany([
            {
                title: 'React Fundamentals Quiz',
                durationMins: 15,
                studentId: user._id,
                totalQuestions: 5,
                status: 'Completed',
                scorePercentage: 80,
                correctAnswers: 4,
                questions: [
                    { questionText: 'What is JSX?', options: ['JavaScript XML', 'JSON XML', 'Java Syntax Extension'], correctAnswer: 'JavaScript XML' },
                    { questionText: 'Which hook is used for side effects?', options: ['useState', 'useEffect', 'useContext'], correctAnswer: 'useEffect' }
                ]
            },
            {
                title: 'Data Structures Checkpoint',
                durationMins: 20,
                studentId: user._id,
                totalQuestions: 10,
                status: 'Pending',
                questions: [
                    { questionText: 'Time complexity of Binary Search?', options: ['O(n)', 'O(log n)', 'O(n^2)'], correctAnswer: 'O(log n)' }
                ]
            },
            {
                title: 'General Aptitude',
                durationMins: 10,
                studentId: user._id,
                totalQuestions: 5,
                status: 'Completed',
                scorePercentage: 100,
                correctAnswers: 5,
                questions: [
                    { questionText: '2 + 2?', options: ['3', '4', '5'], correctAnswer: '4' }
                ]
            }
        ]);

        console.log('Quizzes seeded.');

        // 4. Create Assignments
        await Assignment.insertMany([
            {
                title: 'Personal Portfolio Website',
                description: 'Build a responsive portfolio using HTML, CSS, and JS.',
                deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                studentId: user._id,
                status: 'Evaluated',
                submissionType: 'link',
                submissionData: 'https://vageesh-portfolio.com',
                marks: 95,
                feedback: 'Excellent work on the animations!'
            },
            {
                title: 'DBMS ER Diagram',
                description: 'Create an ER diagram for a Library Management System.',
                deadline: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                studentId: user._id,
                status: 'Submitted',
                submissionType: 'file',
                submissionData: 'er-diagram.pdf'
            },
            {
                title: 'Python Scripting',
                description: 'Write a script to automate file organization.',
                deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                studentId: user._id,
                status: 'Not Submitted',
                submissionType: 'text'
            }
        ]);

        console.log('Assignments seeded.');
        console.log('Database Seeding Complete! 🚀');
        process.exit();

    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
