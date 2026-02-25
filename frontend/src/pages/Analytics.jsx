import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { analyticsAPI } from '../api/axiosClient';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, RadialBarChart, RadialBar, Legend } from 'recharts';
import { Target, TrendingUp, Award, Zap } from 'lucide-react';

const Analytics = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await analyticsAPI.getOverview();
                setData(res.data);
            } catch (error) {
                console.error('Failed to fetch analytics', error);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (loading) return <div className="app-layout"><Sidebar /><main className="main-content"><p>Loading analytics...</p></main></div>;
    if (!data) return <div className="app-layout"><Sidebar /><main className="main-content"><p>No data available.</p></main></div>;

    const getClassificationColor = (classification) => {
        switch (classification) {
            case 'Excellent': return '#10b981'; // green
            case 'Improving': return '#38bdf8'; // blue
            case 'Stable': return '#fbbf24'; // amber
            default: return '#ef4444'; // red
        }
    };

    const metricsData = [
        { name: 'Quizzes', score: data.metrics.quizAvg, fill: '#8b5cf6' },
        { name: 'Assignments', score: data.metrics.assignmentAvg, fill: '#3b82f6' },
        { name: 'Completion', score: data.metrics.completionRate, fill: '#10b981' },
        { name: 'Consistency', score: data.metrics.consistency, fill: '#f59e0b' },
    ];

    const radialData = [
        { name: 'OGI', uv: data.OGI, fill: getClassificationColor(data.classification) }
    ];

    return (
        <div className="app-layout">
            <Sidebar />
            <main className="main-content">
                <div className="card greeting-card" style={{ marginBottom: '24px' }}>
                    <h2>Growth Analytics</h2>
                    <p>Deep dive into your performance metrics and Overall Growth Index (OGI).</p>
                </div>

                <div className="dashboard-grid-wide" style={{ marginBottom: '24px' }}>
                    {/* Main OGI Card */}
                    <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                        <h3 style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>Overall Growth Index</h3>

                        <div style={{ height: '200px', width: '100%', position: 'relative' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" barSize={20} data={radialData} startAngle={180} endAngle={0}>
                                    <RadialBar minAngle={15} background clockWise dataKey="uv" cornerRadius={10} />
                                </RadialBarChart>
                            </ResponsiveContainer>
                            <div style={{ position: 'absolute', top: '65%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                                <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--text-primary)', lineHeight: 1 }}>{data.OGI}</div>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>out of 100</div>
                            </div>
                        </div>

                        <div
                            style={{
                                marginTop: '16px',
                                padding: '8px 24px',
                                borderRadius: '30px',
                                fontWeight: 'bold',
                                color: getClassificationColor(data.classification),
                                background: `${getClassificationColor(data.classification)}1A`,
                                border: `1px solid ${getClassificationColor(data.classification)}40`
                            }}>
                            {data.classification}
                        </div>
                    </div>

                    {/* Breakdown Chart */}
                    <div className="card">
                        <div className="card-header" style={{ marginBottom: '16px' }}>
                            <span className="card-title">Performance Breakdown</span>
                        </div>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={metricsData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                                <RechartsTooltip cursor={{ fill: 'rgba(255,255,255,0.02)' }} contentStyle={{ background: '#1e1e2d', border: 'none', borderRadius: '8px', color: '#fff' }} />
                                <Bar dataKey="score" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Detailed Metrics Cards */}
                <div className="dashboard-grid">
                    <div className="card stat-card purple">
                        <div className="card-header">
                            <span className="card-title">Quiz Average</span>
                            <div className="card-icon" style={{ background: 'rgba(139,92,246,0.15)' }}><Target size={20} color="#a78bfa" /></div>
                        </div>
                        <div className="card-value">{Math.round(data.metrics.quizAvg)}%</div>
                        <div className="card-sub">From {data.classification !== 'Needs Attention' ? 'all' : 'completed'} quizzes</div>
                    </div>

                    <div className="card stat-card blue">
                        <div className="card-header">
                            <span className="card-title">Assignment Avg</span>
                            <div className="card-icon" style={{ background: 'rgba(59,130,246,0.15)' }}><Award size={20} color="#60a5fa" /></div>
                        </div>
                        <div className="card-value">{Math.round(data.metrics.assignmentAvg)}%</div>
                        <div className="card-sub">Evaluated assignments</div>
                    </div>

                    <div className="card stat-card green">
                        <div className="card-header">
                            <span className="card-title">Completion Rate</span>
                            <div className="card-icon" style={{ background: 'rgba(16,185,129,0.15)' }}><TrendingUp size={20} color="#34d399" /></div>
                        </div>
                        <div className="card-value">{Math.round(data.metrics.completionRate)}%</div>
                        <div className="card-sub">Across active courses</div>
                    </div>

                    <div className="card stat-card amber">
                        <div className="card-header">
                            <span className="card-title">Consistency</span>
                            <div className="card-icon" style={{ background: 'rgba(245,158,11,0.15)' }}><Zap size={20} color="#fbbf24" /></div>
                        </div>
                        <div className="card-value">{Math.round(data.metrics.consistency)}%</div>
                        <div className="card-sub">Based on learning streak</div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Analytics;
