import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { assignmentAPI } from '../api/axiosClient';
import { ClipboardList, Upload, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const Assignments = () => {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [submissionData, setSubmissionData] = useState('');

    useEffect(() => {
        fetchAssignments();
    }, []);

    const fetchAssignments = async () => {
        try {
            const { data } = await assignmentAPI.getAll();
            setAssignments(data);
        } catch (error) {
            console.error('Failed to fetch assignments', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!submissionData) return alert('Please enter submission details.');

        try {
            const { data } = await assignmentAPI.submit(selectedAssignment._id, submissionData);
            setSelectedAssignment(null);
            setSubmissionData('');
            fetchAssignments();

            // Emit event to update Dashboard without reload
            window.dispatchEvent(new CustomEvent('statsUpdate', {
                detail: { learningStreak: data.userStreak, assignmentsCompleted: assignments.filter(a => a.status !== 'Not Submitted').length + 1 }
            }));

        } catch (error) {
            console.error('Error submitting', error);
            alert('Error submitting assignment');
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Submitted': return <span className="card-badge badge-success"><CheckCircle size={12} /> Submitted</span>;
            case 'Evaluated': return <span className="card-badge badge-success" style={{ background: 'rgba(16,185,129,0.2)', color: '#10b981' }}><CheckCircle size={12} /> Evaluated</span>;
            case 'Late': return <span className="card-badge badge-warning"><AlertCircle size={12} /> Late</span>;
            default: return <span className="card-badge" style={{ background: 'rgba(255,255,255,0.1)' }}><Clock size={12} /> Pending</span>;
        }
    };

    return (
        <div className="app-layout">
            <Sidebar />
            <main className="main-content">
                <div className="card greeting-card" style={{ marginBottom: '24px' }}>
                    <h2>Assignments</h2>
                    <p>Submit your pending work and track your evaluations.</p>
                </div>

                {loading ? (
                    <div className="card"><p>Loading...</p></div>
                ) : assignments.length === 0 ? (
                    <div className="card"><p>No assignments found.</p></div>
                ) : (
                    <div className="card">
                        <div className="card-header" style={{ marginBottom: '16px' }}>
                            <span className="card-title">Pending & Previous Assignments</span>
                        </div>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <th style={{ padding: '12px', color: 'var(--text-muted)' }}>Title</th>
                                    <th style={{ padding: '12px', color: 'var(--text-muted)' }}>Deadline</th>
                                    <th style={{ padding: '12px', color: 'var(--text-muted)' }}>Status</th>
                                    <th style={{ padding: '12px', color: 'var(--text-muted)' }}>Marks</th>
                                    <th style={{ padding: '12px', color: 'var(--text-muted)' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {assignments.map(a => (
                                    <tr key={a._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                                        <td style={{ padding: '16px 12px' }}>
                                            <div style={{ fontWeight: '500' }}>{a.title}</div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{a.description}</div>
                                        </td>
                                        <td style={{ padding: '16px 12px', color: 'var(--text-secondary)' }}>
                                            {new Date(a.deadline).toLocaleDateString()}
                                        </td>
                                        <td style={{ padding: '16px 12px' }}>{getStatusBadge(a.status)}</td>
                                        <td style={{ padding: '16px 12px', fontWeight: 'bold' }}>{a.marks !== null ? a.marks : '-'}</td>
                                        <td style={{ padding: '16px 12px' }}>
                                            {a.status === 'Not Submitted' ? (
                                                <button
                                                    className="btn btn-primary"
                                                    style={{ padding: '6px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}
                                                    onClick={() => setSelectedAssignment(a)}
                                                >
                                                    <Upload size={14} /> Submit
                                                </button>
                                            ) : (
                                                <button className="btn" disabled style={{ padding: '6px 16px', opacity: 0.5 }}>Submitted</button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Modal for submission */}
                {selectedAssignment && (
                    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                        <div className="card" style={{ width: '400px', maxWidth: '90%' }}>
                            <h3 style={{ marginBottom: '8px' }}>Submit Assignment</h3>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '16px', fontSize: '0.9rem' }}>{selectedAssignment.title}</p>

                            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>
                                Submission details ({selectedAssignment.submissionType}):
                            </label>
                            <textarea
                                style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#fff', minHeight: '100px', marginBottom: '16px' }}
                                placeholder="Paste your link or text here..."
                                value={submissionData}
                                onChange={(e) => setSubmissionData(e.target.value)}
                            />

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                                <button className="btn btn-secondary" onClick={() => setSelectedAssignment(null)}>Cancel</button>
                                <button className="btn btn-primary" onClick={handleSubmit}>Confirm Submit</button>
                            </div>
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
};

export default Assignments;
