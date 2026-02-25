import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { courseAPI } from '../api/axiosClient';
import { User, CalendarCheck, Award, CheckCircle, BookOpen } from 'lucide-react';

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [completing, setCompleting] = useState(null);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const { data } = await courseAPI.getAll();
            setCourses(data);
        } catch (error) {
            console.error('Failed to fetch courses', error);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkCourseComplete = async (e, courseId) => {
        e.preventDefault();
        e.stopPropagation();
        setCompleting(courseId);
        try {
            const { data } = await courseAPI.markCourseComplete(courseId);
            setCourses(prev => prev.map(c => c._id === courseId ? { ...c, progressPercentage: 100, modules: data.modules } : c));
            window.dispatchEvent(new CustomEvent('statsUpdate', {
                detail: { coursesCompleted: courses.filter(c => c.progressPercentage === 100).length + 1 }
            }));
        } catch (error) {
            console.error('Error completing course', error);
        } finally {
            setCompleting(null);
        }
    };

    const getProgressColor = (pct) => {
        if (pct >= 80) return '#10b981';
        if (pct >= 50) return '#f59e0b';
        return '#6366f1';
    };

    return (
        <div className="app-layout">
            <Sidebar />
            <main className="main-content">
                <div className="card greeting-card" style={{ marginBottom: '24px', background: 'var(--gradient-primary)', border: 'none' }}>
                    <div>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '6px' }}>My Courses</h2>
                        <p style={{ opacity: 0.85 }}>Track your academic progress and continue learning.</p>
                    </div>
                </div>

                {loading ? (
                    <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px' }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ width: '40px', height: '40px', border: '3px solid rgba(99,102,241,0.3)', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
                            <p style={{ color: 'var(--text-muted)' }}>Loading courses...</p>
                        </div>
                    </div>
                ) : courses.length === 0 ? (
                    <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
                        <BookOpen size={48} color="var(--text-muted)" style={{ margin: '0 auto 16px' }} />
                        <p style={{ color: 'var(--text-muted)' }}>You are not enrolled in any courses.</p>
                    </div>
                ) : (
                    <div className="dashboard-grid-wide">
                        {courses.map(course => (
                            <div key={course._id} className="card stat-card" style={{ display: 'flex', flexDirection: 'column' }}>
                                {/* Thumbnail */}
                                <div style={{
                                    height: '150px',
                                    background: course.thumbnailUrl
                                        ? `url(${course.thumbnailUrl}) center/cover no-repeat`
                                        : 'var(--gradient-primary)',
                                    borderRadius: '10px',
                                    marginBottom: '16px',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}>
                                    {course.progressPercentage >= 100 && (
                                        <div style={{
                                            position: 'absolute', inset: 0,
                                            background: 'rgba(16,185,129,0.7)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            backdropFilter: 'blur(2px)'
                                        }}>
                                            <CheckCircle size={48} color="#fff" />
                                        </div>
                                    )}
                                </div>

                                {/* Course Info */}
                                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '10px', color: 'var(--text-primary)' }}>
                                    {course.title}
                                </h3>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '12px' }}>
                                    <User size={14} />
                                    <span>{course.instructor}</span>
                                </div>

                                {/* Stats Row */}
                                <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                                    <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', borderRadius: '8px', padding: '10px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                                        <div style={{ fontSize: '1rem', fontWeight: '700', color: getProgressColor(course.progressPercentage) }}>
                                            {course.progressPercentage ?? 0}%
                                        </div>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>Progress</div>
                                    </div>
                                    <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', borderRadius: '8px', padding: '10px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                                            <CalendarCheck size={14} color="#38bdf8" />
                                            <span style={{ fontSize: '1rem', fontWeight: '700', color: '#38bdf8' }}>
                                                {course.attendancePercentage ?? 80}%
                                            </span>
                                        </div>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>Attendance</div>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="progress-bar-wrapper" style={{ marginBottom: '16px' }}>
                                    <div className="progress-bar">
                                        <div
                                            className="progress-fill"
                                            style={{
                                                width: `${course.progressPercentage ?? 0}%`,
                                                background: `linear-gradient(90deg, ${getProgressColor(course.progressPercentage)}, ${getProgressColor(course.progressPercentage)}aa)`,
                                                transition: 'width 0.5s ease'
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                                    <Link
                                        to={`/courses/${course._id}`}
                                        className="btn btn-primary"
                                        style={{ flex: 1, textAlign: 'center', padding: '10px' }}
                                    >
                                        {course.progressPercentage >= 100 ? 'Review' : 'Continue →'}
                                    </Link>
                                    {(course.progressPercentage ?? 0) < 100 && (
                                        <button
                                            className="btn"
                                            onClick={(e) => handleMarkCourseComplete(e, course._id)}
                                            disabled={completing === course._id}
                                            title="Mark Course as Complete (Demo)"
                                            style={{
                                                padding: '10px 14px',
                                                background: 'rgba(245,158,11,0.1)',
                                                color: '#fbbf24',
                                                border: '1px solid rgba(245,158,11,0.2)',
                                                display: 'flex', alignItems: 'center', gap: '6px',
                                                fontSize: '0.8rem', fontWeight: '600'
                                            }}
                                        >
                                            <Award size={14} />
                                            {completing === course._id ? 'Working...' : 'Complete'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Courses;
