import Sidebar from '../components/Sidebar';
import { Linkedin, Building2, UserCircle2 } from 'lucide-react';

const Alumni = () => {
    // Dummy data as per requirements
    const alumniList = [
        { id: 1, name: 'Rahul Verma', company: 'Amazon', position: 'SDE-II', gradYear: '2023' },
        { id: 2, name: 'Simran Kaur', company: 'Atlassian', position: 'Product Manager', gradYear: '2022' },
        { id: 3, name: 'Amit Singh', company: 'Google', position: 'Frontend Engineer', gradYear: '2024' },
        { id: 4, name: 'Priya Sharma', company: 'Netflix', position: 'UI/UX Designer', gradYear: '2021' },
    ];

    return (
        <div className="app-layout">
            <Sidebar />
            <main className="main-content">
                <div className="card greeting-card" style={{ marginBottom: '24px' }}>
                    <h2>Alumni Network</h2>
                    <p>Connect with our successful graduates working across the globe.</p>
                </div>

                <div className="dashboard-grid">
                    {alumniList.map(alumni => (
                        <div key={alumni.id} className="card stat-card" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                                <UserCircle2 size={48} color="var(--text-muted)" />
                            </div>

                            <h3 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>{alumni.name}</h3>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '16px', fontSize: '0.9rem' }}>Class of {alumni.gradYear}</p>

                            <div style={{ background: 'rgba(255,255,255,0.02)', width: '100%', padding: '12px', borderRadius: '8px', marginBottom: '24px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--text-primary)', fontWeight: 'bold' }}>
                                    <Building2 size={16} color="var(--text-muted)" /> {alumni.company}
                                </div>
                                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
                                    {alumni.position}
                                </div>
                            </div>

                            <div style={{ marginTop: 'auto', width: '100%' }}>
                                <button className="btn btn-secondary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} onClick={() => alert('Opening LinkedIn profile...')}>
                                    <Linkedin size={18} /> Connect
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default Alumni;
