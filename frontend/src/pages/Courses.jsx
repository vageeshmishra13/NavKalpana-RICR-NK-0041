import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { courseAPI } from '../api/axiosClient';
import { User } from 'lucide-react';

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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
        fetchCourses();
    }, []);

    return (
        <div className="app-layout">
            <Sidebar />
            <main className="main-content">
                <div className="card greeting-card" style={{ marginBottom: '24px' }}>
                    <h2>My Courses</h2>
                    <p>Track your academic progress and continue learning.</p>
                </div>

                {loading ? (
                    <div className="card"><p>Loading courses...</p></div>
                ) : courses.length === 0 ? (
                    <div className="card"><p>You are not enrolled in any courses.</p></div>
                ) : (
                    <div className="dashboard-grid-wide">
                        {courses.map(course => (
                            <div key={course._id} className="card stat-card">
                                <div style={{ height: '140px', background: `url(${course.thumbnailUrl}) center/cover no-repeat`, borderRadius: '8px', marginBottom: '16px' }}></div>
                                <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>{course.title}</h3>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '16px' }}>
                                    <User size={16} /> <span>{course.instructor}</span>
                                </div>

                                <div className="card-sub" style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Progress</span>
                                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{course.progressPercentage}%</span>
                                </div>

                                <div className="progress-bar-wrapper" style={{ marginBottom: '20px' }}>
                                    <div className="progress-bar">
                                        <div className="progress-fill purple" style={{ width: `${course.progressPercentage}%` }} />
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '12px', marginTop: 'auto' }}>
                                    <Link to={`/courses/${course._id}`} className="btn btn-primary" style={{ flex: 1, textAlign: 'center', padding: '10px' }}>
                                        Continue
                                    </Link>
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
