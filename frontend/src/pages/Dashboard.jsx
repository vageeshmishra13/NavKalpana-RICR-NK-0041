import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
    Trophy, Flame, Star, BookOpen, ClipboardCheck, TrendingUp, Calendar, Award
} from 'lucide-react';
import { analyticsAPI, assignmentAPI, courseAPI } from '../api/axiosClient';

const leaderboard = [
    { rank: 1, name: 'Pooja Sharma', score: 980 },
    { rank: 2, name: 'Arjun Mehta', score: 945 },
    { rank: 3, name: 'Sneha Patel', score: 912 },
    { rank: 4, name: 'Rahul Gupta', score: 887 },
    { rank: 5, name: 'Ananya Singh', score: 860 },
];

const events = [
    { type: 'assignment', title: 'Python File Automation Script', date: 'Feb 28, 2026' },
    { type: 'quiz', title: 'Data Structures Checkpoint', date: 'Mar 1, 2026' },
    { type: 'event', title: 'Hackathon Submission Deadline', date: 'Mar 5, 2026' },
    { type: 'assignment', title: 'ML Iris Classification', date: 'Mar 7, 2026' },
    { type: 'quiz', title: 'AI & ML Basics', date: 'Mar 10, 2026' },
];

const rankColors = ['gold', 'silver', 'bronze', '', ''];

const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
};

const Dashboard = () => {
    const { user, refreshUser } = useAuth();
    const [stats, setStats] = useState(null);
    const [assignments, setAssignments] = useState([]);
    const [courses, setCourses] = useState([]);
    const [weeklyData, setWeeklyData] = useState([
        { day: 'Mon', lessons: 3 }, { day: 'Tue', lessons: 5 }, { day: 'Wed', lessons: 2 },
        { day: 'Thu', lessons: 7 }, { day: 'Fri', lessons: 4 }, { day: 'Sat', lessons: 6 }, { day: 'Sun', lessons: 1 },
    ]);
    const [loading, setLoading] = useState(true);

    const fetchDashboardData = async () => {
        try {
            const [analyticsRes, assignRes, courseRes] = await Promise.all([
                analyticsAPI.getOverview(),
                assignmentAPI.getAll(),
                courseAPI.getAll(),
            ]);
            setStats(analyticsRes.data);
            setAssignments(assignRes.data || []);
            setCourses(courseRes.data || []);

            // Build weekly data from user's weeklyActivity if available
            if (user?.weeklyActivity?.length === 7) {
                const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                setWeeklyData(user.weeklyActivity.map((v, i) => ({ day: days[i], lessons: v })));
            }
        } catch (err) {
            console.error('Dashboard data fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
        // Listen for live updates from other pages
        const handleUpdate = () => {
            fetchDashboardData();
            refreshUser();
        };
        window.addEventListener('statsUpdate', handleUpdate);
        return () => window.removeEventListener('statsUpdate', handleUpdate);
    }, []);

    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    const totalAssignments = assignments.length;
    const completedAssignments = assignments.filter(a => ['Submitted', 'Late', 'Evaluated'].includes(a.status)).length;
    const overallScore = stats?.OGI ?? 0;
    const learningStreak = user?.learningStreak ?? 0;
    const skillsAcquired = user?.skillsAcquired ?? 0;
    const totalSkills = user?.totalSkills ?? 12;

    return (
        <div className="app-layout">
            <Sidebar />
            <main className="main-content">
                {/* Greeting */}
                <div className="card greeting-card" style={{
                    marginBottom: '24px',
                    background: 'var(--gradient-primary)',
                    border: 'none',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '8px' }}>
                            {getGreeting()}, {user?.name?.split(' ')[0] || 'Student'}! 👋
                        </h2>
                        <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>
                            Ready to continue your learning journey? You&apos;re on a{' '}
                            <span style={{ fontWeight: 'bold' }}>{learningStreak}-day</span> streak!
                        </p>
                        <div className="greeting-time" style={{ marginTop: '16px', opacity: 0.8, fontSize: '0.85rem' }}>
                            {timeStr} · {dateStr}
                        </div>
                    </div>
                </div>

                {/* Stat Cards Row */}
                <div className="dashboard-grid" style={{ marginBottom: '24px' }}>
                    {/* Academic Score */}
                    <div className="card stat-card purple">
                        <div className="card-header">
                            <span className="card-title">Academic Score (OGI)</span>
                            <div className="card-icon" style={{ background: 'rgba(99,102,241,0.15)' }}>
                                <TrendingUp size={20} color="#818cf8" />
                            </div>
                        </div>
                        <div className="card-value" style={{ color: '#818cf8' }}>
                            {loading ? '...' : `${overallScore}%`}
                        </div>
                        <div className="progress-bar-wrapper">
                            <div className="progress-bar">
                                <div className="progress-fill purple" style={{ width: `${overallScore}%`, transition: 'width 0.6s ease' }} />
                            </div>
                        </div>
                        <div className="card-sub" style={{ marginTop: '8px' }}>
                            {stats ? `Classification: ${stats.classification}` : 'Overall performance'}
                        </div>
                    </div>

                    {/* Assignment Summary */}
                    <div className="card stat-card blue">
                        <div className="card-header">
                            <span className="card-title">Assignments</span>
                            <div className="card-icon" style={{ background: 'rgba(14,165,233,0.15)' }}>
                                <ClipboardCheck size={20} color="#38bdf8" />
                            </div>
                        </div>
                        <div className="card-value">
                            {loading ? '...' : completedAssignments}
                            <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/{totalAssignments}</span>
                        </div>
                        <div className="progress-bar-wrapper">
                            <div className="progress-bar">
                                <div className="progress-fill blue" style={{
                                    width: `${totalAssignments ? (completedAssignments / totalAssignments) * 100 : 0}%`,
                                    transition: 'width 0.6s ease'
                                }} />
                            </div>
                        </div>
                        <div className="card-sub">Completed / Total</div>
                    </div>

                    {/* Learning Streak */}
                    <div className="card stat-card amber">
                        <div className="card-header">
                            <span className="card-title">Learning Streak</span>
                            <div className="card-icon" style={{ background: 'rgba(245,158,11,0.15)' }}>
                                <Flame size={20} color="#fbbf24" />
                            </div>
                        </div>
                        <div className="card-value">{learningStreak} <span style={{ fontSize: '1rem' }}>🔥</span></div>
                        <div className="card-sub">Consecutive learning days</div>
                        <div className="card-badge badge-warning" style={{ marginTop: '8px' }}>
                            {learningStreak >= 7 ? '🏆 On Fire!' : learningStreak >= 3 ? 'Keep going!' : 'Start your streak!'}
                        </div>
                    </div>

                    {/* Skills Acquired */}
                    <div className="card stat-card green">
                        <div className="card-header">
                            <span className="card-title">Skills Acquired</span>
                            <div className="card-icon" style={{ background: 'rgba(16,185,129,0.15)' }}>
                                <Star size={20} color="#34d399" />
                            </div>
                        </div>
                        <div className="card-value">
                            {skillsAcquired}
                            <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/{totalSkills}</span>
                        </div>
                        <div className="progress-bar-wrapper">
                            <div className="progress-bar">
                                <div className="progress-fill green" style={{ width: `${(skillsAcquired / totalSkills) * 100}%`, transition: 'width 0.6s ease' }} />
                            </div>
                        </div>
                        <div className="card-sub">Skills linked to module completion</div>
                    </div>
                </div>

                {/* Analytics Summary Cards */}
                {stats && (
                    <div className="dashboard-grid" style={{ marginBottom: '24px' }}>
                        {[
                            { label: 'Quiz Avg Score', value: `${stats.metrics.quizAvg}%`, color: '#a78bfa', bg: 'rgba(139,92,246,0.1)' },
                            { label: 'Assignment Avg', value: `${stats.metrics.assignmentAvg}%`, color: '#60a5fa', bg: 'rgba(59,130,246,0.1)' },
                            { label: 'Module Completion', value: `${stats.metrics.completionRate}%`, color: '#34d399', bg: 'rgba(16,185,129,0.1)' },
                            { label: 'Consistency', value: `${stats.metrics.consistency}%`, color: '#fbbf24', bg: 'rgba(245,158,11,0.1)' },
                        ].map(item => (
                            <div key={item.label} className="card" style={{ background: item.bg, border: `1px solid ${item.color}25`, minHeight: 'unset', padding: '20px' }}>
                                <div className="card-sub" style={{ marginBottom: '8px', marginTop: 0 }}>{item.label}</div>
                                <div style={{ fontSize: '2rem', fontWeight: '900', color: item.color }}>{item.value}</div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Chart + Leaderboard */}
                <div className="dashboard-grid-wide" style={{ marginBottom: '24px' }}>
                    {/* Weekly Activity Chart */}
                    <div className="card">
                        <div className="card-header">
                            <span className="card-title">Weekly Learning Activity</span>
                            <BookOpen size={18} color="var(--text-muted)" />
                        </div>
                        <div style={{ padding: '20px 0' }}>
                            <ResponsiveContainer width="100%" height={220}>
                                <AreaChart data={weeklyData}>
                                    <defs>
                                        <linearGradient id="colorLessons" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                    <XAxis dataKey="day" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                                    <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        contentStyle={{ background: '#18181b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)' }}
                                        labelStyle={{ color: '#fafafa', fontWeight: 'bold', marginBottom: '4px' }}
                                        itemStyle={{ color: '#818cf8' }}
                                    />
                                    <Area type="monotone" dataKey="lessons" stroke="#6366f1" strokeWidth={3} fill="url(#colorLessons)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Leaderboard */}
                    <div className="card">
                        <div className="card-header">
                            <span className="card-title">Leaderboard</span>
                            <Trophy size={18} color="#fbbf24" />
                        </div>
                        <div className="leaderboard-list">
                            {leaderboard.map((item, i) => (
                                <div key={item.rank} className="leaderboard-item">
                                    <span className={`leaderboard-rank ${rankColors[i]}`}>#{item.rank}</span>
                                    <span className="leaderboard-name">{item.name}</span>
                                    <span className="leaderboard-score">{item.score}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Course Progress + Events */}
                <div className="dashboard-grid-wide" style={{ marginBottom: '24px' }}>
                    {/* Active Courses */}
                    <div className="card">
                        <div className="card-header" style={{ marginBottom: '16px' }}>
                            <span className="card-title">Course Progress</span>
                            <Award size={18} color="var(--text-muted)" />
                        </div>
                        {loading ? (
                            <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '24px' }}>Loading...</div>
                        ) : courses.length === 0 ? (
                            <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '24px' }}>No courses found</div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {courses.map(course => (
                                    <div key={course._id}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                            <span style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-primary)' }}>{course.title}</span>
                                            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: course.progressPercentage >= 80 ? '#10b981' : '#818cf8' }}>
                                                {course.progressPercentage}%
                                            </span>
                                        </div>
                                        <div className="progress-bar">
                                            <div className="progress-fill purple" style={{ width: `${course.progressPercentage}%`, transition: 'width 0.6s ease' }} />
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '3px' }}>{course.instructor}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Events Calendar */}
                    <div className="card">
                        <div className="card-header">
                            <span className="card-title">Upcoming Events</span>
                            <Calendar size={18} color="var(--text-muted)" />
                        </div>
                        <div className="events-list">
                            {events.map((ev, i) => (
                                <div key={i} className="event-item">
                                    <div className={`event-dot ${ev.type}`} />
                                    <div className="event-info">
                                        <div className="event-title">{ev.title}</div>
                                        <div className="event-date">{ev.date}</div>
                                    </div>
                                    <span className="card-badge badge-warning" style={{ fontSize: '0.7rem' }}>{ev.type}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
