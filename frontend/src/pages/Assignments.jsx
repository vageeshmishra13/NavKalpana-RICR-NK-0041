import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { assignmentAPI } from '../api/axiosClient';
import { ClipboardList, Upload, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const Assignments = () => {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [submissionData, setSubmissionData] = useState('');
    const [dragActive, setDragActive] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

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

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setSelectedFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
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
                <div className="card greeting-card" style={{
                    marginBottom: '24px',
                    background: 'var(--gradient-secondary)',
                    border: 'none'
                }}>
                    <h2>Assignments</h2>
                    <p style={{ opacity: 0.9 }}>Submit your pending work and track your evaluations.</p>
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
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                                        <th style={{ padding: '16px 12px', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Title</th>
                                        <th style={{ padding: '16px 12px', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Deadline</th>
                                        <th style={{ padding: '16px 12px', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                                        <th style={{ padding: '16px 12px', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Marks</th>
                                        <th style={{ padding: '16px 12px', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {assignments.map(a => (
                                        <tr key={a._id} style={{ borderBottom: '1px solid var(--border)' }}>
                                            <td style={{ padding: '20px 12px' }}>
                                                <div style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px' }}>{a.title}</div>
                                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '300px' }}>{a.description}</div>
                                            </td>
                                            <td style={{ padding: '20px 12px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                                {new Date(a.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </td>
                                            <td style={{ padding: '20px 12px' }}>{getStatusBadge(a.status)}</td>
                                            <td style={{ padding: '20px 12px', fontWeight: '700', color: a.marks >= 90 ? 'var(--success)' : 'var(--text-primary)' }}>
                                                {a.marks !== null ? `${a.marks}/100` : '-'}
                                            </td>
                                            <td style={{ padding: '20px 12px', textAlign: 'right' }}>
                                                {a.status === 'Not Submitted' ? (
                                                    <button
                                                        className="btn btn-primary"
                                                        style={{ padding: '8px 20px', display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}
                                                        onClick={() => setSelectedAssignment(a)}
                                                    >
                                                        <Upload size={14} /> Submit
                                                    </button>
                                                ) : (
                                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '500' }}>Completed</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Modal for submission */}
                {selectedAssignment && (
                    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
                        <div className="card" style={{ width: '500px', maxWidth: '90%', padding: '32px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Submit Assignment</h3>
                                <button className="btn" onClick={() => { setSelectedAssignment(null); setSelectedFile(null); }} style={{ padding: '8px', color: 'var(--text-muted)' }}>✕</button>
                            </div>

                            <div style={{ marginBottom: '24px', padding: '16px', background: 'rgba(99,102,241,0.05)', borderRadius: '12px', border: '1px solid rgba(99,102,241,0.1)' }}>
                                <p style={{ color: 'var(--primary-light)', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '4px' }}>{selectedAssignment.title}</p>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Type: {selectedAssignment.submissionType}</p>
                            </div>

                            <label style={{ display: 'block', marginBottom: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>
                                File Upload or Comments:
                            </label>

                            <div
                                onDragEnter={handleDrag}
                                onDragOver={handleDrag}
                                onDragLeave={handleDrag}
                                onDrop={handleDrop}
                                style={{
                                    border: `2px dashed ${dragActive ? 'var(--primary)' : 'rgba(255,255,255,0.1)'}`,
                                    borderRadius: '12px',
                                    padding: '32px',
                                    textAlign: 'center',
                                    background: dragActive ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.02)',
                                    marginBottom: '20px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                onClick={() => document.getElementById('file-upload').click()}
                            >
                                <Upload size={32} color={selectedFile ? 'var(--success)' : 'var(--text-muted)'} style={{ marginBottom: '12px' }} />
                                {selectedFile ? (
                                    <div style={{ color: 'var(--success)', fontWeight: 'bold' }}>{selectedFile.name}</div>
                                ) : (
                                    <div style={{ color: 'var(--text-muted)' }}>
                                        <p style={{ fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '4px' }}>Drag & drop your file here</p>
                                        <p style={{ fontSize: '0.85rem' }}>or click to browse from manager</p>
                                    </div>
                                )}
                                <input id="file-upload" type="file" style={{ display: 'none' }} onChange={handleFileChange} />
                            </div>

                            <textarea
                                style={{ width: '100%', padding: '16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', minHeight: '100px', marginBottom: '24px', resize: 'vertical' }}
                                placeholder="Add any additional notes (Optional)..."
                                value={submissionData}
                                onChange={(e) => setSubmissionData(e.target.value)}
                            />

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                                <button className="btn btn-secondary" style={{ padding: '10px 24px' }} onClick={() => { setSelectedAssignment(null); setSelectedFile(null); }}>Cancel</button>
                                <button className="btn btn-primary" style={{ padding: '10px 32px', fontWeight: 'bold' }} onClick={handleSubmit}>
                                    Confirm & Submit
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
};

export default Assignments;
