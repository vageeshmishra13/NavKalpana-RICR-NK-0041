import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { courseAPI } from '../api/axiosClient';
import {
    CheckCircle, ChevronDown, ChevronRight, PlayCircle, Award,
    FileText, Brain, Code2, ArrowLeft, BookOpen, Flame
} from 'lucide-react';

const difficultyColors = {
    Beginner: { bg: 'rgba(16,185,129,0.12)', color: '#34d399', border: 'rgba(16,185,129,0.2)' },
    Intermediate: { bg: 'rgba(245,158,11,0.12)', color: '#fbbf24', border: 'rgba(245,158,11,0.2)' },
    Advanced: { bg: 'rgba(239,68,68,0.12)', color: '#f87171', border: 'rgba(239,68,68,0.2)' },
};

const getDifficulty = (index) => {
    const levels = ['Beginner', 'Intermediate', 'Advanced'];
    return levels[index % 3];
};

const CourseDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [expandedModules, setExpandedModules] = useState({});
    const [activeLesson, setActiveLesson] = useState(null);
    const [completing, setCompleting] = useState(null);
    const [completingCourse, setCompletingCourse] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        fetchCourse();
    }, [id]);

    const fetchCourse = async () => {
        try {
            const { data } = await courseAPI.getById(id);
            setCourse(data);
            // Expand first module by default
            if (data.modules?.length > 0) {
                setExpandedModules({ [data.modules[0]._id]: true });
            }
        } catch (error) {
            console.error('Failed to fetch course', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleModule = (moduleId) => {
        setExpandedModules(prev => ({ ...prev, [moduleId]: !prev[moduleId] }));
    };

    const handleMarkComplete = async (moduleId, lessonId) => {
        setCompleting(lessonId);
        try {
            const { data } = await courseAPI.markLessonComplete(id, moduleId, lessonId);
            setCourse(data.course);
            window.dispatchEvent(new CustomEvent('statsUpdate', {
                detail: { learningStreak: data.userStreak }
            }));
            showSuccess('Lesson marked complete! 🎉');
        } catch (error) {
            console.error('Error marking complete', error);
        } finally {
            setCompleting(null);
        }
    };

    const handleCourseComplete = async () => {
        setCompletingCourse(true);
        try {
            const { data } = await courseAPI.markCourseComplete(id);
            setCourse(data);
            window.dispatchEvent(new CustomEvent('statsUpdate', {
                detail: { coursesCompleted: 1, overallScore: Math.min(100, 78 + 5) }
            }));
            showSuccess('Course completed! Excellent work! 🏆');
        } catch (error) {
            console.error('Error marking course complete', error);
        } finally {
            setCompletingCourse(false);
        }
    };

    const showSuccess = (msg) => {
        setSuccessMsg(msg);
        setTimeout(() => setSuccessMsg(''), 3000);
    };

    const getModuleProgress = (mod) => {
        if (!mod.lessons?.length) return 0;
        const done = mod.lessons.filter(l => l.isCompleted).length;
        return Math.round((done / mod.lessons.length) * 100);
    };

    if (loading) return (
        <div className="app-layout">
            <Sidebar />
            <main className="main-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ width: '48px', height: '48px', border: '3px solid rgba(99,102,241,0.3)', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
                    <p style={{ color: 'var(--text-muted)' }}>Loading course...</p>
                </div>
            </main>
        </div>
    );

    if (!course) return (
        <div className="app-layout">
            <Sidebar />
            <main className="main-content"><p>Course not found.</p></main>
        </div>
    );

    const totalLessons = course.modules?.reduce((sum, m) => sum + m.lessons.length, 0) || 0;
    const completedLessons = course.modules?.reduce((sum, m) => sum + m.lessons.filter(l => l.isCompleted).length, 0) || 0;

    return (
        <div className="app-layout">
            <Sidebar />
            <main className="main-content">
                {/* Success Toast */}
                {successMsg && (
                    <div style={{
                        position: 'fixed', top: '24px', right: '24px', zIndex: 9999,
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        color: '#fff', padding: '14px 24px', borderRadius: '12px',
                        boxShadow: '0 8px 32px rgba(16,185,129,0.4)',
                        fontWeight: '600', fontSize: '0.95rem',
                        animation: 'slideIn 0.3s ease'
                    }}>
                        {successMsg}
                    </div>
                )}

                <button
                    className="btn btn-secondary"
                    onClick={() => navigate('/courses')}
                    style={{ marginBottom: '20px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                    <ArrowLeft size={16} /> Back to Courses
                </button>

                {/* Course Header */}
                <div className="card" style={{ marginBottom: '24px', background: 'var(--gradient-primary)', border: 'none' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                        <div style={{ flex: 1 }}>
                            <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#fff', marginBottom: '6px' }}>{course.title}</h1>
                            <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '16px' }}>
                                <BookOpen size={14} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                                Instructor: {course.instructor}
                            </p>
                            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '1.5rem', fontWeight: '800' }}>{course.progressPercentage ?? 0}%</div>
                                    <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Progress</div>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '1.5rem', fontWeight: '800' }}>{completedLessons}/{totalLessons}</div>
                                    <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Lessons</div>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '1.5rem', fontWeight: '800' }}>{course.modules?.length || 0}</div>
                                    <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Modules</div>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '1.5rem', fontWeight: '800' }}>{course.attendancePercentage ?? 80}%</div>
                                    <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Attendance</div>
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-end' }}>
                            {(course.progressPercentage ?? 0) < 100 && (
                                <button
                                    className="btn"
                                    onClick={handleCourseComplete}
                                    disabled={completingCourse}
                                    style={{
                                        background: 'rgba(255,255,255,0.2)',
                                        border: '1px solid rgba(255,255,255,0.4)',
                                        color: '#fff',
                                        padding: '10px 20px',
                                        display: 'flex', alignItems: 'center', gap: '8px',
                                        fontWeight: '600'
                                    }}
                                >
                                    <Award size={18} />
                                    {completingCourse ? 'Completing...' : 'Mark Course as Complete (Demo)'}
                                </button>
                            )}
                            {(course.progressPercentage ?? 0) === 100 && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fff', fontWeight: 'bold' }}>
                                    <CheckCircle size={20} /> Course Complete!
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="progress-bar-wrapper" style={{ marginTop: '20px' }}>
                        <div className="progress-bar" style={{ height: '8px' }}>
                            <div
                                className="progress-fill purple"
                                style={{ width: `${course.progressPercentage ?? 0}%`, transition: 'width 0.5s ease' }}
                            />
                        </div>
                    </div>
                </div>

                {/* Active Lesson Viewer */}
                {activeLesson && (
                    <div className="card" style={{ marginBottom: '24px', border: '1px solid rgba(99,102,241,0.2)' }}>
                        <div className="card-header" style={{ marginBottom: '20px' }}>
                            <span className="card-title">{activeLesson.lesson.title}</span>
                            <button className="btn" onClick={() => setActiveLesson(null)} style={{ padding: '6px 12px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>✕ Close</button>
                        </div>
                        {/* Video Section */}
                        <div style={{ background: '#000', borderRadius: '12px', overflow: 'hidden', marginBottom: '20px', aspectRatio: '16/9', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                            <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
                                <PlayCircle size={64} style={{ marginBottom: '12px', opacity: 0.6 }} />
                                <p style={{ fontSize: '1rem' }}>Video: {activeLesson.lesson.title}</p>
                                <p style={{ fontSize: '0.85rem', opacity: 0.6 }}>Duration: {activeLesson.lesson.duration}</p>
                            </div>
                        </div>
                        {/* Tabs for Notes / Quiz / CodeLab */}
                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                            <div style={{ flex: 1, minWidth: '200px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#60a5fa', marginBottom: '10px', fontWeight: '600' }}>
                                    <FileText size={16} /> Lecture Notes
                                </div>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                                    Notes for "{activeLesson.lesson.title}" cover the foundational concepts introduced in the video.
                                    Key takeaways, definitions, and important formulas are included for quick revision.
                                </p>
                            </div>
                            <div style={{ flex: 1, minWidth: '200px', background: 'rgba(139,92,246,0.05)', borderRadius: '12px', padding: '16px', border: '1px solid rgba(139,92,246,0.1)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a78bfa', marginBottom: '10px', fontWeight: '600' }}>
                                    <Brain size={16} /> Lesson Quiz
                                </div>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Practice questions for this lesson available in the Quizzes module.</p>
                                <button className="btn" style={{ marginTop: '10px', padding: '6px 14px', background: 'rgba(139,92,246,0.15)', color: '#a78bfa', fontSize: '0.85rem' }}>
                                    Go to Quiz →
                                </button>
                            </div>
                            <div style={{ flex: 1, minWidth: '200px', background: 'rgba(16,185,129,0.05)', borderRadius: '12px', padding: '16px', border: '1px solid rgba(16,185,129,0.1)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#34d399', marginBottom: '10px', fontWeight: '600' }}>
                                    <Code2 size={16} /> CodeLab
                                </div>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Interactive coding environment for hands-on practice.</p>
                                <button className="btn" style={{ marginTop: '10px', padding: '6px 14px', background: 'rgba(16,185,129,0.15)', color: '#34d399', fontSize: '0.85rem' }}>
                                    Open CodeLab →
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modules List */}
                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    <div className="card-header" style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <span className="card-title">Course Modules</span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{course.modules?.length || 0} modules</span>
                    </div>

                    {course.modules?.map((mod, mIndex) => {
                        const modProgress = getModuleProgress(mod);
                        const isExpanded = !!expandedModules[mod._id];

                        return (
                            <div key={mod._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                {/* Module Header */}
                                <div
                                    onClick={() => toggleModule(mod._id)}
                                    style={{
                                        padding: '18px 24px',
                                        background: isExpanded ? 'rgba(99,102,241,0.05)' : 'rgba(255,255,255,0.01)',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '16px',
                                        transition: 'background 0.2s'
                                    }}
                                >
                                    <div style={{
                                        width: '32px', height: '32px',
                                        borderRadius: '8px',
                                        background: modProgress === 100 ? 'rgba(16,185,129,0.15)' : 'rgba(99,102,241,0.15)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: modProgress === 100 ? '#10b981' : '#818cf8',
                                        fontWeight: 'bold', fontSize: '0.85rem', flexShrink: 0
                                    }}>
                                        {modProgress === 100 ? <CheckCircle size={16} /> : mIndex + 1}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
                                            {mod.title}
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                            {mod.lessons?.filter(l => l.isCompleted).length}/{mod.lessons?.length} lessons · {modProgress}% complete
                                        </div>
                                    </div>
                                    {/* Module progress bar */}
                                    <div style={{ width: '80px', marginRight: '8px' }}>
                                        <div style={{ height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                                            <div style={{
                                                height: '100%', borderRadius: '4px',
                                                background: modProgress === 100 ? '#10b981' : '#6366f1',
                                                width: `${modProgress}%`, transition: 'width 0.5s ease'
                                            }} />
                                        </div>
                                    </div>
                                    {isExpanded ? <ChevronDown size={18} color="var(--text-muted)" /> : <ChevronRight size={18} color="var(--text-muted)" />}
                                </div>

                                {/* Lessons */}
                                {isExpanded && (
                                    <div>
                                        {mod.lessons?.map((lesson, lIndex) => {
                                            const diff = getDifficulty(lIndex);
                                            const diffStyle = difficultyColors[diff];
                                            const isActive = activeLesson?.lesson._id === lesson._id;
                                            return (
                                                <div
                                                    key={lesson._id}
                                                    style={{
                                                        padding: '14px 24px 14px 72px',
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        gap: '12px',
                                                        borderBottom: lIndex < mod.lessons.length - 1 ? '1px solid rgba(255,255,255,0.02)' : 'none',
                                                        background: isActive ? 'rgba(99,102,241,0.07)' : 'transparent',
                                                        transition: 'background 0.2s',
                                                        flexWrap: 'wrap'
                                                    }}
                                                >
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '200px' }}>
                                                        <div
                                                            onClick={() => setActiveLesson({ module: mod, lesson })}
                                                            style={{ cursor: 'pointer' }}
                                                        >
                                                            <PlayCircle size={20} color={lesson.isCompleted ? '#10b981' : '#6366f1'} />
                                                        </div>
                                                        <div>
                                                            <div
                                                                onClick={() => setActiveLesson({ module: mod, lesson })}
                                                                style={{
                                                                    color: lesson.isCompleted ? 'var(--text-secondary)' : 'var(--text-primary)',
                                                                    fontWeight: '500',
                                                                    cursor: 'pointer',
                                                                    marginBottom: '4px',
                                                                    textDecoration: lesson.isCompleted ? 'line-through' : 'none',
                                                                    opacity: lesson.isCompleted ? 0.7 : 1
                                                                }}
                                                            >
                                                                {lesson.title}
                                                            </div>
                                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{lesson.duration}</div>
                                                        </div>
                                                    </div>

                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                                                        {/* Difficulty Badge */}
                                                        <span style={{
                                                            padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600',
                                                            background: diffStyle.bg, color: diffStyle.color, border: `1px solid ${diffStyle.border}`
                                                        }}>
                                                            {diff}
                                                        </span>

                                                        {lesson.isCompleted ? (
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10b981', fontSize: '0.85rem', fontWeight: '600' }}>
                                                                <CheckCircle size={16} /> Done
                                                            </div>
                                                        ) : (
                                                            <button
                                                                className="btn"
                                                                style={{
                                                                    background: 'rgba(16,185,129,0.1)',
                                                                    color: '#34d399',
                                                                    padding: '6px 14px',
                                                                    fontSize: '0.8rem',
                                                                    fontWeight: '600',
                                                                    border: '1px solid rgba(16,185,129,0.2)',
                                                                    display: 'flex', alignItems: 'center', gap: '6px'
                                                                }}
                                                                onClick={() => handleMarkComplete(mod._id, lesson._id)}
                                                                disabled={completing === lesson._id}
                                                            >
                                                                {completing === lesson._id ? (
                                                                    <>
                                                                        <div style={{ width: '12px', height: '12px', border: '2px solid rgba(52,211,153,0.3)', borderTopColor: '#34d399', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                                                                        Saving...
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <Flame size={13} /> Mark Complete
                                                                    </>
                                                                )}
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </main>
        </div>
    );
};

export default CourseDetail;
