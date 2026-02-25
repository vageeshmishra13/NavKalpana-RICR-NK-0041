import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { assignmentAPI } from '../api/axiosClient';
import { ClipboardList, Upload, CheckCircle, Clock, AlertCircle, Star, Link, FileText, MessageSquare, X } from 'lucide-react';

const Assignments = () => {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [submissionData, setSubmissionData] = useState('');
    const [submissionType, setSubmissionType] = useState('text');
    const [dragActive, setDragActive] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [expandedFeedback, setExpandedFeedback] = useState(null);

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

    const openModal = (a) => {
        setSelectedAssignment(a);
        setSubmissionType(a.submissionType || 'text');
        setSubmissionData('');
        setSelectedFile(null);
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(e.type === 'dragenter' || e.type === 'dragover');
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files[0]) setSelectedFile(e.dataTransfer.files[0]);
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) setSelectedFile(e.target.files[0]);
    };

    const handleSubmit = async () => {
        const data = submissionType === 'file'
            ? (selectedFile ? selectedFile.name : null)
            : submissionData.trim();

        if (!data) return alert('Please provide a submission.');
        setSubmitting(true);
        try {
            const res = await assignmentAPI.submit(selectedAssignment._id, data);
            setSelectedAssignment(null);
            fetchAssignments();
            window.dispatchEvent(new CustomEvent('statsUpdate', {
                detail: { learningStreak: res.data.userStreak }
            }));
        } catch (error) {
            console.error('Error submitting', error);
            alert('Error submitting assignment');
        } finally {
            setSubmitting(false);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Submitted': return <span className="card-badge badge-success"><CheckCircle size={12} /> Submitted</span>;
            case 'Evaluated': return <span className="card-badge badge-success" style={{ background: 'rgba(16,185,129,0.25)', color: '#10b981' }}><CheckCircle size={12} /> Evaluated</span>;
            case 'Late': return <span className="card-badge badge-warning"><AlertCircle size={12} /> Late</span>;
            default: return <span className="card-badge" style={{ background: 'rgba(255,255,255,0.08)' }}><Clock size={12} /> Pending</span>;
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'file': return <Upload size={14} />;
            case 'link': return <Link size={14} />;
            default: return <FileText size={14} />;
        }
    };

    const isDeadlinePast = (deadline) => new Date(deadline) < new Date();

    return (
        <div className="app-layout">
            <Sidebar />
            <main className="main-content">
                <div className="card greeting-card" style={{ marginBottom: '24px', background: 'var(--gradient-secondary)', border: 'none' }}>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '6px' }}>Assignments</h2>
                    <p style={{ opacity: 0.9 }}>Submit your work and track your evaluations in real-time.</p>
                </div>

                {/* Summary strip */}
                {!loading && assignments.length > 0 && (
                    <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
                        {[
                            { label: 'Total', value: assignments.length, color: '#818cf8' },
                            { label: 'Completed', value: assignments.filter(a => a.status !== 'Not Submitted').length, color: '#34d399' },
                            { label: 'Pending', value: assignments.filter(a => a.status === 'Not Submitted').length, color: '#fbbf24' },
                            { label: 'Evaluated', value: assignments.filter(a => a.status === 'Evaluated').length, color: '#38bdf8' },
                        ].map(s => (
                            <div key={s.label} className="card" style={{ flex: '1', minWidth: '100px', padding: '16px', minHeight: 'unset', background: `${s.color}12`, border: `1px solid ${s.color}25` }}>
                                <div style={{ fontSize: '1.6rem', fontWeight: '900', color: s.color }}>{s.value}</div>
                                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>{s.label}</div>
                            </div>
                        ))}
                    </div>
                )}

                {loading ? (
                    <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px' }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ width: '40px', height: '40px', border: '3px solid rgba(99,102,241,0.3)', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
                            <p style={{ color: 'var(--text-muted)' }}>Loading assignments...</p>
                        </div>
                    </div>
                ) : assignments.length === 0 ? (
                    <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
                        <ClipboardList size={48} color="var(--text-muted)" style={{ margin: '0 auto 16px' }} />
                        <p style={{ color: 'var(--text-muted)' }}>No assignments found.</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {assignments.map(a => (
                            <div key={a._id} className="card" style={{ padding: '24px', minHeight: 'unset' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                                            <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)' }}>{a.title}</h3>
                                            {getStatusBadge(a.status)}
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '3px 8px', borderRadius: '20px' }}>
                                                {getTypeIcon(a.submissionType)} {a.submissionType}
                                            </span>
                                        </div>
                                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '10px' }}>{a.description}</p>
                                        <div style={{ display: 'flex', gap: '20px', fontSize: '0.8rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                                            <span style={{ color: isDeadlinePast(a.deadline) && a.status === 'Not Submitted' ? '#ef4444' : 'var(--text-muted)' }}>
                                                📅 Deadline: {new Date(a.deadline).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                {isDeadlinePast(a.deadline) && a.status === 'Not Submitted' && ' (Overdue!)'}
                                            </span>
                                            {a.submissionTime && (
                                                <span>⏰ Submitted: {new Date(a.submissionTime).toLocaleDateString()}</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Score + Actions */}
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px', flexShrink: 0 }}>
                                        {a.marks !== null && a.marks !== undefined && (
                                            <div style={{ textAlign: 'center' }}>
                                                <div style={{ fontSize: '1.8rem', fontWeight: '900', color: a.marks >= 90 ? '#10b981' : a.marks >= 60 ? '#f59e0b' : '#ef4444' }}>
                                                    {a.marks}<span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>/100</span>
                                                </div>
                                                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Score</div>
                                            </div>
                                        )}
                                        {a.status === 'Not Submitted' ? (
                                            <button
                                                className="btn btn-primary"
                                                style={{ padding: '8px 20px', display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}
                                                onClick={() => openModal(a)}
                                            >
                                                <Upload size={14} /> Submit
                                            </button>
                                        ) : a.feedback && (
                                            <button
                                                className="btn"
                                                style={{ padding: '8px 16px', background: 'rgba(16,185,129,0.1)', color: '#34d399', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                                                onClick={() => setExpandedFeedback(expandedFeedback === a._id ? null : a._id)}
                                            >
                                                <MessageSquare size={14} /> Feedback
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Feedback Panel */}
                                {expandedFeedback === a._id && a.feedback && (
                                    <div style={{ marginTop: '16px', padding: '16px', background: 'rgba(16,185,129,0.06)', borderRadius: '10px', border: '1px solid rgba(16,185,129,0.15)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                            <Star size={16} color="#fbbf24" />
                                            <span style={{ fontWeight: '600', color: '#34d399', fontSize: '0.875rem' }}>Instructor Feedback</span>
                                        </div>
                                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>{a.feedback}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Submission Modal */}
                {selectedAssignment && (
                    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(6px)' }}>
                        <div className="card" style={{ width: '560px', maxWidth: '92vw', padding: '36px', maxHeight: '90vh', overflowY: 'auto' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                <h3 style={{ fontSize: '1.4rem', fontWeight: '800' }}>Submit Assignment</h3>
                                <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }} onClick={() => setSelectedAssignment(null)}>
                                    <X size={20} />
                                </button>
                            </div>

                            <div style={{ marginBottom: '24px', padding: '16px', background: 'rgba(99,102,241,0.06)', borderRadius: '12px', border: '1px solid rgba(99,102,241,0.15)' }}>
                                <p style={{ color: 'var(--primary-light)', fontWeight: '700', marginBottom: '4px' }}>{selectedAssignment.title}</p>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{selectedAssignment.description}</p>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '6px' }}>
                                    📅 Deadline: {new Date(selectedAssignment.deadline).toLocaleDateString()}
                                </p>
                            </div>

                            {/* Submission Type Toggles */}
                            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                                {['file', 'text', 'link'].map(type => (
                                    <button
                                        key={type}
                                        onClick={() => { setSubmissionType(type); setSubmissionData(''); setSelectedFile(null); }}
                                        style={{
                                            flex: 1,
                                            padding: '8px',
                                            borderRadius: '8px',
                                            border: `1px solid ${submissionType === type ? '#6366f1' : 'rgba(255,255,255,0.1)'}`,
                                            background: submissionType === type ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.03)',
                                            color: submissionType === type ? '#818cf8' : 'var(--text-muted)',
                                            cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px'
                                        }}
                                    >
                                        {type === 'file' ? <Upload size={14} /> : type === 'link' ? <Link size={14} /> : <FileText size={14} />}
                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                    </button>
                                ))}
                            </div>

                            {/* File Drop Zone */}
                            {submissionType === 'file' && (
                                <div
                                    onDragEnter={handleDrag} onDragOver={handleDrag} onDragLeave={handleDrag} onDrop={handleDrop}
                                    onClick={() => document.getElementById('file-upload').click()}
                                    style={{
                                        border: `2px dashed ${dragActive ? '#6366f1' : 'rgba(255,255,255,0.12)'}`,
                                        borderRadius: '12px', padding: '36px', textAlign: 'center',
                                        background: dragActive ? 'rgba(99,102,241,0.1)' : 'transparent',
                                        cursor: 'pointer', transition: 'all 0.2s', marginBottom: '20px'
                                    }}
                                >
                                    <Upload size={32} color={selectedFile ? '#10b981' : 'var(--text-muted)'} style={{ marginBottom: '12px' }} />
                                    {selectedFile ? (
                                        <div style={{ color: '#10b981', fontWeight: '600' }}>✓ {selectedFile.name}</div>
                                    ) : (
                                        <>
                                            <p style={{ fontWeight: '600', marginBottom: '4px' }}>Drag & drop your file here</p>
                                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>or click to browse</p>
                                        </>
                                    )}
                                    <input id="file-upload" type="file" style={{ display: 'none' }} onChange={handleFileChange} />
                                </div>
                            )}

                            {/* Text Input */}
                            {submissionType === 'text' && (
                                <textarea
                                    style={{ width: '100%', padding: '14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', minHeight: '120px', marginBottom: '20px', resize: 'vertical', fontSize: '0.9rem' }}
                                    placeholder="Write your answer or notes here..."
                                    value={submissionData}
                                    onChange={e => setSubmissionData(e.target.value)}
                                />
                            )}

                            {/* Link Input */}
                            {submissionType === 'link' && (
                                <input
                                    type="url"
                                    style={{ width: '100%', padding: '14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', marginBottom: '20px', fontSize: '0.9rem' }}
                                    placeholder="https://github.com/your-submission"
                                    value={submissionData}
                                    onChange={e => setSubmissionData(e.target.value)}
                                />
                            )}

                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                                <button className="btn" style={{ padding: '10px 24px', color: 'var(--text-muted)' }} onClick={() => setSelectedAssignment(null)}>
                                    Cancel
                                </button>
                                <button className="btn btn-primary" style={{ padding: '10px 32px', fontWeight: '700' }} onClick={handleSubmit} disabled={submitting}>
                                    {submitting ? 'Submitting...' : 'Confirm & Submit'}
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
