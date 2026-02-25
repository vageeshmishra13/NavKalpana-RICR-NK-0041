import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { courseAPI } from '../api/axiosClient';
import { CheckCircle, Circle, PlayCircle, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const CourseDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { setUser } = useAuth(); // If we need to update streak in context
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const { data } = await courseAPI.getById(id);
                setCourse(data);
            } catch (error) {
                console.error('Failed to fetch course', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [id]);

    const handleMarkComplete = async (moduleId, lessonId) => {
        try {
            const { data } = await courseAPI.markLessonComplete(id, moduleId, lessonId);
            setCourse(data.course);

            // Emit event to update Dashboard without reload
            window.dispatchEvent(new CustomEvent('statsUpdate', {
                detail: { learningStreak: data.userStreak }
            }));

        } catch (error) {
            console.error('Error marking complete', error);
        }
    };

    const handleCourseComplete = async () => {
        try {
            const { data } = await courseAPI.markCourseComplete(id);
            setCourse(data);

            window.dispatchEvent(new CustomEvent('statsUpdate', {
                detail: { coursesCompleted: 1 } // Simplified logic
            }));

        } catch (error) {
            console.error('Error marking course complete', error);
        }
    };

    if (loading) return <div className="app-layout"><Sidebar /><main className="main-content"><p>Loading...</p></main></div>;
    if (!course) return <div className="app-layout"><Sidebar /><main className="main-content"><p>Course not found.</p></main></div>;

    return (
        <div className="app-layout">
            <Sidebar />
            <main className="main-content">
                <button className="btn btn-secondary" onClick={() => navigate('/courses')} style={{ marginBottom: '16px' }}>&larr; Back to Courses</button>

                <div className="card" style={{ marginBottom: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                        <div>
                            <h1 style={{ fontSize: '1.8rem', color: '#f8fafc', marginBottom: '8px' }}>{course.title}</h1>
                            <p style={{ color: 'var(--text-muted)' }}>Instructor: {course.instructor}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{course.progressPercentage}%</div>
                            <div style={{ color: 'var(--text-muted)' }}>Completed</div>
                        </div>
                    </div>

                    <div className="progress-bar-wrapper" style={{ marginTop: '16px' }}>
                        <div className="progress-bar">
                            <div className="progress-fill purple" style={{ width: `${course.progressPercentage}%` }} />
                        </div>
                    </div>

                    <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
                        {course.progressPercentage < 100 && (
                            <button className="btn btn-primary" onClick={handleCourseComplete} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Award size={18} /> Mark Course as Complete (Demo)
                            </button>
                        )}
                    </div>
                </div>

                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    <div className="card-header" style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <span className="card-title">Course Modules</span>
                    </div>

                    <div>
                        {course.modules.map((mod, mIndex) => (
                            <div key={mod._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <div style={{ padding: '16px 20px', background: 'rgba(255,255,255,0.02)', fontWeight: 'bold', fontSize: '1.1rem' }}>
                                    Module {mIndex + 1}: {mod.title}
                                </div>

                                <div>
                                    {mod.lessons.map((lesson, lIndex) => (
                                        <div key={lesson._id} style={{
                                            padding: '16px 20px',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            borderBottom: lIndex < mod.lessons.length - 1 ? '1px solid rgba(255,255,255,0.02)' : 'none'
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <PlayCircle size={20} color={lesson.isCompleted ? '#10b981' : 'var(--text-muted)'} />
                                                <span style={{ color: lesson.isCompleted ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                                                    {lesson.title}
                                                </span>
                                            </div>

                                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{lesson.duration}</span>
                                                {!lesson.isCompleted ? (
                                                    <button
                                                        className="btn"
                                                        style={{ background: 'rgba(16,185,129,0.1)', color: '#34d399', padding: '6px 12px', fontSize: '0.85rem' }}
                                                        onClick={() => handleMarkComplete(mod._id, lesson._id)}
                                                    >
                                                        Mark Complete
                                                    </button>
                                                ) : (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10b981', fontSize: '0.9rem' }}>
                                                        <CheckCircle size={16} /> Completed
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CourseDetail;
