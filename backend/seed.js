const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Course = require('./models/Course');
const Quiz = require('./models/Quiz');
const Assignment = require('./models/Assignment');
const Attendance = require('./models/Attendance');

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
        await Attendance.deleteMany();
        console.log('Existing data cleared.');

        // 1. Create User
        const user = await User.create({
            name: 'Vageesh Mishra',
            email: 'test@example.com',
            password: 'password123',
            learningStreak: 7,
            skillsAcquired: 6,
            totalSkills: 12,
            weeklyActivity: [3, 5, 2, 7, 4, 6, 1]
        });
        console.log('User created:', user.email);

        // 2. Create Courses with full module/lesson data
        const courses = await Course.insertMany([
            {
                title: 'Full Stack Web Development',
                instructor: 'Dr. Sumit Gupta',
                thumbnailUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80',
                studentId: user._id,
                attendancePercentage: 88,
                totalLessons: 12,
                lessonsCompleted: 8,
                progressPercentage: 67,
                modules: [
                    {
                        title: 'Module 1: Frontend Foundations',
                        lessons: [
                            { title: 'HTML5 Semantic Elements', duration: '12:00', isCompleted: true },
                            { title: 'CSS Grid & Flexbox', duration: '18:00', isCompleted: true },
                            { title: 'Responsive Design', duration: '15:00', isCompleted: true }
                        ]
                    },
                    {
                        title: 'Module 2: React Deep Dive',
                        lessons: [
                            { title: 'JSX & Components', duration: '20:00', isCompleted: true },
                            { title: 'State & Props', duration: '22:00', isCompleted: true },
                            { title: 'Hooks (useState, useEffect)', duration: '28:00', isCompleted: true }
                        ]
                    },
                    {
                        title: 'Module 3: Backend with Node.js',
                        lessons: [
                            { title: 'Express Routing', duration: '18:00', isCompleted: true },
                            { title: 'MongoDB & Mongoose', duration: '25:00', isCompleted: true },
                            { title: 'JWT Authentication', duration: '30:00', isCompleted: false }
                        ]
                    },
                    {
                        title: 'Module 4: Deployment & DevOps',
                        lessons: [
                            { title: 'Git & GitHub Workflow', duration: '14:00', isCompleted: false },
                            { title: 'Docker Basics', duration: '20:00', isCompleted: false },
                            { title: 'CI/CD with GitHub Actions', duration: '22:00', isCompleted: false }
                        ]
                    }
                ]
            },
            {
                title: 'Artificial Intelligence & ML',
                instructor: 'Prof. Anjali Sharma',
                thumbnailUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=600&q=80',
                studentId: user._id,
                attendancePercentage: 75,
                totalLessons: 10,
                lessonsCompleted: 3,
                progressPercentage: 30,
                modules: [
                    {
                        title: 'Module 1: Python for Data Science',
                        lessons: [
                            { title: 'NumPy & Pandas Basics', duration: '40:00', isCompleted: true },
                            { title: 'Data Visualization with Matplotlib', duration: '15:00', isCompleted: true },
                            { title: 'Seaborn & Statistical Plots', duration: '20:00', isCompleted: true }
                        ]
                    },
                    {
                        title: 'Module 2: Machine Learning Fundamentals',
                        lessons: [
                            { title: 'Linear Regression', duration: '35:00', isCompleted: false },
                            { title: 'Decision Trees & Random Forests', duration: '40:00', isCompleted: false },
                            { title: 'Model Evaluation & Cross-Validation', duration: '30:00', isCompleted: false }
                        ]
                    },
                    {
                        title: 'Module 3: Deep Learning',
                        lessons: [
                            { title: 'Neural Networks Intro', duration: '45:00', isCompleted: false },
                            { title: 'CNNs for Image Recognition', duration: '50:00', isCompleted: false },
                            { title: 'PyTorch Basics', duration: '38:00', isCompleted: false },
                            { title: 'Transfer Learning', duration: '42:00', isCompleted: false }
                        ]
                    }
                ]
            },
            {
                title: 'Data Structures & Algorithms',
                instructor: 'Er. Rohit Kumar',
                thumbnailUrl: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&w=600&q=80',
                studentId: user._id,
                attendancePercentage: 92,
                totalLessons: 15,
                lessonsCompleted: 0,
                progressPercentage: 0,
                modules: [
                    {
                        title: 'Module 1: Arrays & Strings',
                        lessons: [
                            { title: 'Two Pointer Approach', duration: '20:00', isCompleted: false },
                            { title: 'Sliding Window Technique', duration: '25:00', isCompleted: false },
                            { title: 'String Manipulation Problems', duration: '18:00', isCompleted: false }
                        ]
                    },
                    {
                        title: 'Module 2: Linked Lists & Stacks',
                        lessons: [
                            { title: 'Singly & Doubly Linked Lists', duration: '30:00', isCompleted: false },
                            { title: 'Stack-based Problems', duration: '22:00', isCompleted: false },
                            { title: 'Queue & Deque', duration: '20:00', isCompleted: false }
                        ]
                    },
                    {
                        title: 'Module 3: Trees & Graphs',
                        lessons: [
                            { title: 'Binary Trees & BST', duration: '35:00', isCompleted: false },
                            { title: 'BFS & DFS Traversals', duration: '28:00', isCompleted: false },
                            { title: 'Graph Algorithms: Dijkstra', duration: '40:00', isCompleted: false }
                        ]
                    },
                    {
                        title: 'Module 4: Dynamic Programming',
                        lessons: [
                            { title: 'Memoization vs Tabulation', duration: '32:00', isCompleted: false },
                            { title: 'Classic DP Problems (LCS, Knapsack)', duration: '45:00', isCompleted: false },
                            { title: 'DP on Trees & Grids', duration: '38:00', isCompleted: false }
                        ]
                    }
                ]
            },
            {
                title: 'Database Management Systems',
                instructor: 'Dr. Priya Nair',
                thumbnailUrl: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=600&q=80',
                studentId: user._id,
                attendancePercentage: 82,
                totalLessons: 8,
                lessonsCompleted: 5,
                progressPercentage: 62,
                modules: [
                    {
                        title: 'Module 1: SQL Fundamentals',
                        lessons: [
                            { title: 'DDL & DML Commands', duration: '25:00', isCompleted: true },
                            { title: 'Joins (INNER, LEFT, RIGHT)', duration: '30:00', isCompleted: true },
                            { title: 'Subqueries & CTEs', duration: '28:00', isCompleted: true }
                        ]
                    },
                    {
                        title: 'Module 2: Database Design',
                        lessons: [
                            { title: 'ER Diagrams & Normalization', duration: '35:00', isCompleted: true },
                            { title: '1NF, 2NF, 3NF & BCNF', duration: '32:00', isCompleted: true }
                        ]
                    },
                    {
                        title: 'Module 3: Advanced Concepts',
                        lessons: [
                            { title: 'Transactions & ACID Properties', duration: '28:00', isCompleted: false },
                            { title: 'Indexing & Query Optimization', duration: '30:00', isCompleted: false },
                            { title: 'MongoDB vs SQL Comparison', duration: '22:00', isCompleted: false }
                        ]
                    }
                ]
            }
        ]);
        console.log('Courses seeded.');

        // 3. Create 5 full Quizzes with complete questions
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
                    { questionText: 'What does JSX stand for?', options: ['JavaScript XML', 'JSON XML', 'Java Syntax Extension', 'JavaScript Extension'], correctAnswer: 'JavaScript XML' },
                    { questionText: 'Which hook manages side effects in React?', options: ['useState', 'useEffect', 'useContext', 'useReducer'], correctAnswer: 'useEffect' },
                    { questionText: 'How do you pass data to a child component?', options: ['via state', 'via props', 'via events', 'via DOM'], correctAnswer: 'via props' },
                    { questionText: 'What does the virtual DOM do?', options: ['Renders HTML directly', 'Optimizes real DOM updates', 'Manages the server', 'Handles routing'], correctAnswer: 'Optimizes real DOM updates' },
                    { questionText: 'Which method triggers a component re-render?', options: ['setState()', 'render()', 'update()', 'refresh()'], correctAnswer: 'setState()' }
                ]
            },
            {
                title: 'Data Structures Checkpoint',
                durationMins: 20,
                studentId: user._id,
                totalQuestions: 5,
                status: 'Pending',
                questions: [
                    { questionText: 'Time complexity of Binary Search?', options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'], correctAnswer: 'O(log n)' },
                    { questionText: 'Which data structure uses LIFO ordering?', options: ['Queue', 'Stack', 'Heap', 'Array'], correctAnswer: 'Stack' },
                    { questionText: 'What is the height of a balanced BST with n nodes?', options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(1)'], correctAnswer: 'O(log n)' },
                    { questionText: 'Which traversal visits root first?', options: ['Inorder', 'Postorder', 'Preorder', 'Level-order'], correctAnswer: 'Preorder' },
                    { questionText: 'Best case time complexity of Bubble Sort?', options: ['O(n²)', 'O(n log n)', 'O(n)', 'O(1)'], correctAnswer: 'O(n)' }
                ]
            },
            {
                title: 'General Aptitude & Reasoning',
                durationMins: 10,
                studentId: user._id,
                totalQuestions: 5,
                status: 'Completed',
                scorePercentage: 100,
                correctAnswers: 5,
                questions: [
                    { questionText: 'What is 15% of 200?', options: ['25', '30', '35', '40'], correctAnswer: '30' },
                    { questionText: 'Next in sequence: 2, 4, 8, 16, __?', options: ['24', '30', '32', '36'], correctAnswer: '32' },
                    { questionText: 'If A > B and B > C, then A vs C?', options: ['A < C', 'A > C', 'A = C', 'Cannot determine'], correctAnswer: 'A > C' },
                    { questionText: 'Odd one out: 2, 4, 6, 9, 12', options: ['4', '6', '9', '12'], correctAnswer: '9' },
                    { questionText: '5! (5 factorial) equals?', options: ['25', '60', '120', '240'], correctAnswer: '120' }
                ]
            },
            {
                title: 'SQL & Database Quiz',
                durationMins: 15,
                studentId: user._id,
                totalQuestions: 5,
                status: 'Completed',
                scorePercentage: 60,
                correctAnswers: 3,
                questions: [
                    { questionText: 'Which SQL command retrieves data?', options: ['INSERT', 'SELECT', 'UPDATE', 'DELETE'], correctAnswer: 'SELECT' },
                    { questionText: 'What does PRIMARY KEY enforce?', options: ['Unique & Not Null', 'Only Unique', 'Only Not Null', 'None'], correctAnswer: 'Unique & Not Null' },
                    { questionText: 'Which JOIN returns all rows from both tables?', options: ['INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL OUTER JOIN'], correctAnswer: 'FULL OUTER JOIN' },
                    { questionText: 'Which clause filters grouped rows?', options: ['WHERE', 'HAVING', 'GROUP BY', 'ORDER BY'], correctAnswer: 'HAVING' },
                    { questionText: 'Normal form that removes transitive dependencies?', options: ['1NF', '2NF', '3NF', 'BCNF'], correctAnswer: '3NF' }
                ]
            },
            {
                title: 'AI & Machine Learning Basics',
                durationMins: 12,
                studentId: user._id,
                totalQuestions: 5,
                status: 'Pending',
                questions: [
                    { questionText: 'Which algorithm is used for classification?', options: ['Linear Regression', 'Logistic Regression', 'PCA', 'K-Means'], correctAnswer: 'Logistic Regression' },
                    { questionText: 'Overfitting means the model...?', options: ['Performs well on train data only', 'Performs well on all data', 'Has too few parameters', 'Underfits the training data'], correctAnswer: 'Performs well on train data only' },
                    { questionText: 'Which metric is used in classification problems?', options: ['RMSE', 'MAE', 'Accuracy', 'R-squared'], correctAnswer: 'Accuracy' },
                    { questionText: 'K in K-Means represents?', options: ['Number of features', 'Number of clusters', 'Learning rate', 'Epochs'], correctAnswer: 'Number of clusters' },
                    { questionText: 'What does CNN stand for?', options: ['Convoluted Neural Node', 'Convolutional Neural Network', 'Computed Neuron Network', 'Core Neural Net'], correctAnswer: 'Convolutional Neural Network' }
                ]
            }
        ]);
        console.log('Quizzes seeded (5 quizzes with full questions).');

        // 4. Create Assignments
        await Assignment.insertMany([
            {
                title: 'Personal Portfolio Website',
                description: 'Build a fully responsive portfolio using HTML, CSS, and JavaScript. Include a projects section, contact form, and smooth scroll navigation.',
                deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                studentId: user._id,
                status: 'Evaluated',
                submissionType: 'link',
                submissionData: 'https://vageesh-portfolio.netlify.app',
                marks: 95,
                feedback: 'Excellent work on the animations and responsive design! The project section is very well structured.',
                isLate: false
            },
            {
                title: 'DBMS ER Diagram – Library System',
                description: 'Create a complete ER diagram for a Library Management System including entities: Books, Members, Staff, Borrowing. Apply normalization up to 3NF.',
                deadline: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                studentId: user._id,
                status: 'Submitted',
                submissionType: 'file',
                submissionData: 'library_er_diagram.pdf',
                isLate: false
            },
            {
                title: 'Python File Automation Script',
                description: 'Write a Python script to organize files in a directory by their extension. Files should be sorted into folders (Images, Documents, Videos, Others).',
                deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                studentId: user._id,
                status: 'Not Submitted',
                submissionType: 'text',
                isLate: false
            },
            {
                title: 'React Todo App with Context API',
                description: 'Build a feature-complete Todo application using React. Must implement Context API for state management, local storage persistence, filtering, and task priorities.',
                deadline: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
                studentId: user._id,
                status: 'Evaluated',
                submissionType: 'link',
                submissionData: 'https://react-todo-vageesh.vercel.app',
                marks: 88,
                feedback: 'Good implementation of Context API. Could improve the drag-and-drop feature for task reordering.',
                isLate: false
            },
            {
                title: 'ML Model: Iris Classification',
                description: 'Train a machine learning classifier on the Iris dataset. Compare at least 3 algorithms (KNN, SVM, Decision Tree), report accuracy, precision, recall, and F1 score.',
                deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
                studentId: user._id,
                status: 'Not Submitted',
                submissionType: 'file',
                isLate: false
            }
        ]);
        console.log('Assignments seeded (5 assignments).');

        // 5. Create Attendance records with 10-entry history
        for (const course of courses) {
            const history = [];
            for (let i = 14; i >= 0; i--) {
                history.push({
                    date: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
                    status: Math.random() > 0.25 ? 'Present' : 'Absent'
                });
            }
            const presentDays = history.filter(h => h.status === 'Present').length;
            const pct = Math.round((presentDays / history.length) * 100);

            await Attendance.create({
                courseId: course._id,
                studentId: user._id,
                totalClasses: history.length,
                presentDays,
                attendancePercentage: pct,
                attendanceHistory: history
            });
        }
        console.log('Attendance seeded (with 15-day history per course).');

        console.log('\n✅ Database Seeding Complete!');
        console.log('   Email: test@example.com');
        console.log('   Password: password123');
        process.exit();

    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
