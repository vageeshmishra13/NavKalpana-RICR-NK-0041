import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { attendanceAPI } from '../api/axiosClient';
import { Calendar, CheckCircle, XCircle } from 'lucide-react';

const Attendance = () => {
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                const { data } = await attendanceAPI.getAll();
                setAttendanceRecords(data);
            } catch (error) {
                console.error('Failed to fetch attendance', error);
            } finally {
                setLoading(false);
            }
        };
        fetchAttendance();
    }, []);

    return (
        <div className="app-layout">
            <Sidebar />
            <main className="main-content">
                <div className="card greeting-card" style={{ marginBottom: '24px' }}>
                    <h2>Attendance</h2>
                    <p>Track your presence across all enrolled courses.</p>
                </div>

                {loading ? (
                    <div className="card"><p>Loading...</p></div>
                ) : attendanceRecords.length === 0 ? (
                    <div className="card"><p>No attendance records found.</p></div>
                ) : (
                    <div className="dashboard-grid">
                        {attendanceRecords.map(record => (
                            <div key={record._id} className="card stat-card">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                    <div className="card-icon" style={{ background: 'rgba(56,189,248,0.15)' }}>
                                        <Calendar size={24} color="#38bdf8" />
                                    </div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                                        {record.attendancePercentage}%
                                    </div>
                                </div>

                                <h3 style={{ fontSize: '1.1rem', marginBottom: '8px', color: '#e2e8f0' }}>{record.courseId?.title || 'Unknown Course'}</h3>

                                <div className="card-sub" style={{ marginBottom: '16px' }}>
                                    {record.presentDays} / {record.totalClasses} classes attended
                                </div>

                                <div className="progress-bar-wrapper" style={{ marginBottom: '16px' }}>
                                    <div className="progress-bar">
                                        <div className="progress-fill blue" style={{ width: `${record.attendancePercentage}%` }} />
                                    </div>
                                </div>

                                <div style={{ marginTop: '16px' }}>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Recent History</p>
                                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                        {record.attendanceHistory?.slice(-5).map((history, i) => (
                                            <div key={i} title={new Date(history.date).toLocaleDateString()} style={{ display: 'flex', alignItems: 'center' }}>
                                                {history.status === 'Present' ? (
                                                    <CheckCircle size={20} color="#10b981" />
                                                ) : (
                                                    <XCircle size={20} color="#ef4444" />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Attendance;
