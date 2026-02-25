import Sidebar from '../components/Sidebar';
import { Briefcase, MapPin, Code } from 'lucide-react';

const JobsInternships = () => {
    // Dummy data as per requirements
    const jobs = [
        { id: 1, company: 'Google', role: 'Software Engineering Intern', location: 'Remote / Bangalore', skills: ['React', 'Node.js', 'Data Structures'], type: 'Internship' },
        { id: 2, company: 'Microsoft', role: 'Frontend Developer', location: 'Hyderabad', skills: ['React', 'Tailwind', 'TypeScript'], type: 'Full-time' },
        { id: 3, company: 'Amazon', role: 'SDE Intern', location: 'Bangalore', skills: ['Java', 'AWS', 'System Design'], type: 'Internship' },
        { id: 4, company: 'Atlassian', role: 'Product Manager Intern', location: 'Remote', skills: ['Agile', 'Jira', 'Communication'], type: 'Internship' },
    ];

    return (
        <div className="app-layout">
            <Sidebar />
            <main className="main-content">
                <div className="card greeting-card" style={{ marginBottom: '24px' }}>
                    <h2>Jobs & Internships</h2>
                    <p>Explore career opportunities tailored to your skills.</p>
                </div>

                <div className="dashboard-grid">
                    {jobs.map(job => (
                        <div key={job.id} className="card stat-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '16px' }}>
                                <div style={{ padding: '12px', background: 'rgba(59,130,246,0.15)', borderRadius: '12px' }}>
                                    <Briefcase size={24} color="#60a5fa" />
                                </div>
                                <span className={`card-badge ${job.type === 'Internship' ? 'badge-warning' : 'badge-success'}`}>
                                    {job.type}
                                </span>
                            </div>

                            <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>{job.role}</h3>
                            <p style={{ color: 'var(--text-secondary)', fontWeight: 'bold', marginBottom: '12px' }}>{job.company}</p>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '8px' }}>
                                <MapPin size={16} /> {job.location}
                            </div>

                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>
                                <Code size={16} style={{ marginTop: '2px' }} />
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                    {job.skills.map(s => <span key={s} style={{ background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>{s}</span>)}
                                </div>
                            </div>

                            <div style={{ marginTop: 'auto', width: '100%' }}>
                                <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => alert('Redirecting to application portal...')}>
                                    Apply Now
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default JobsInternships;
