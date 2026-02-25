import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { supportAPI } from '../api/axiosClient';

const Support = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ ticketType: 'Doubt', topic: '', description: '', fileUrl: '' });

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            const { data } = await supportAPI.getAll();
            setTickets(data);
        } catch (error) {
            console.error('Failed to fetch support tickets', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await supportAPI.create(formData);
            setShowModal(false);
            setFormData({ ticketType: 'Doubt', topic: '', description: '', fileUrl: '' });
            fetchTickets();
        } catch (error) {
            console.error('Error creating ticket', error);
            alert('Error submitting request');
        }
    };

    return (
        <div className="app-layout">
            <Sidebar />
            <main className="main-content">
                <div className="card greeting-card" style={{
                    marginBottom: '24px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'var(--gradient-success)',
                    border: 'none'
                }}>
                    <div>
                        <h2>Learning Support</h2>
                        <p style={{ opacity: 0.9 }}>Request backup classes or submit your doubts.</p>
                    </div>
                    <button className="btn btn-primary" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.3)' }} onClick={() => setShowModal(true)}>+ New Request</button>
                </div>

                {loading ? (
                    <div className="card"><p>Loading...</p></div>
                ) : tickets.length === 0 ? (
                    <div className="card"><p>No previous requests found.</p></div>
                ) : (
                    <div className="card">
                        <div className="card-header" style={{ marginBottom: '16px' }}>
                            <span className="card-title">My Support History</span>
                        </div>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <th style={{ padding: '12px', color: 'var(--text-muted)' }}>Ticket ID</th>
                                    <th style={{ padding: '12px', color: 'var(--text-muted)' }}>Type</th>
                                    <th style={{ padding: '12px', color: 'var(--text-muted)' }}>Topic</th>
                                    <th style={{ padding: '12px', color: 'var(--text-muted)' }}>Date</th>
                                    <th style={{ padding: '12px', color: 'var(--text-muted)' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tickets.map(t => (
                                    <tr key={t._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                                        <td style={{ padding: '16px 12px', color: 'var(--text-secondary)' }}>{t._id.slice(-6).toUpperCase()}</td>
                                        <td style={{ padding: '16px 12px' }}>{t.ticketType}</td>
                                        <td style={{ padding: '16px 12px' }}>
                                            <div style={{ fontWeight: '500' }}>{t.topic}</div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{t.description}</div>
                                        </td>
                                        <td style={{ padding: '16px 12px', color: 'var(--text-secondary)' }}>
                                            {new Date(t.createdAt).toLocaleDateString()}
                                        </td>
                                        <td style={{ padding: '16px 12px' }}>
                                            <span className={`card-badge ${t.status === 'Resolved' ? 'badge-success' : t.status === 'In Progress' ? 'badge-warning' : ''}`} style={t.status === 'Open' ? { background: 'rgba(255,255,255,0.1)' } : {}}>
                                                {t.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Modal for new request */}
                {showModal && (
                    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                        <div className="card" style={{ width: '500px', maxWidth: '90%' }}>
                            <h3 style={{ marginBottom: '16px' }}>Submit New Request</h3>

                            <form onSubmit={handleSubmit}>
                                <div style={{ marginBottom: '16px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Request Type</label>
                                    <select
                                        style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#fff' }}
                                        value={formData.ticketType}
                                        onChange={(e) => setFormData({ ...formData, ticketType: e.target.value })}
                                    >
                                        <option value="Doubt">Ask a Doubt</option>
                                        <option value="Backup Class Request">Request Backup Class</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div style={{ marginBottom: '16px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Topic</label>
                                    <input
                                        type="text"
                                        required
                                        style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#fff' }}
                                        value={formData.topic}
                                        onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                                    />
                                </div>

                                <div style={{ marginBottom: '24px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Description</label>
                                    <textarea
                                        required
                                        style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#fff', minHeight: '100px' }}
                                        placeholder="Explain your doubt or reason for backup class..."
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary">Submit Request</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
};

export default Support;
