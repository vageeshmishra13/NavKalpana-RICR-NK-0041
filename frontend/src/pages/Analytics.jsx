import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { analyticsAPI } from '../api/axiosClient';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
    ResponsiveContainer, LineChart, Line, Legend, RadialBarChart, RadialBar
} from 'recharts';
import { Target, TrendingUp, Award, Zap, BookOpen, ClipboardCheck } from 'lucide-react';

const weeklyTrendDummy = [
    { week: 'Week 1', ogi: 52 },
    { week: 'Week 2', ogi: 57 },
    { week: 'Week 3', ogi: 61 },
    { week: 'Week 4', ogi: 65 },
    { week: 'Week 5', ogi: 69 },
    { week: 'Week 6', ogi: 74 },
];

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

        // Listen for real-time stat updates
        const handleUpdate = () => fetchAnalytics();
        window.addEventListener('statsUpdate', handleUpdate);
        return () => window.removeEventListener('statsUpdate', handleUpdate);
    }, []);

    if (loading) return (
        <div className="app-layout">
            <Sidebar />
            <main className="main-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ width: '48px', height: '48px', border: '3px solid rgba(99,102,241,0.3)', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
                    <p style={{ color: 'var(--text-muted)' }}>Loading analytics...</p>
                </div>
            </main>
        </div>
    );

    if (!data) return (
        <div className="app-layout">
            <Sidebar />
            <main className="main-content"><p>No data available.</p></main>
        </div>
    );

    const getClassificationColor = (cls) => {
        switch (cls) {
            case 'Excellent': return '#10b981';
            case 'Improving': return '#38bdf8';
            case 'Stable': return '#fbbf24';
            default: return '#ef4444';
        }
    };

    const clsColor = getClassificationColor(data.classification);

    const metricsData = [
        { name: 'Quiz Avg', score: Math.round(data.metrics.quizAvg), fill: '#8b5cf6' },
        { name: 'Assign Avg', score: Math.round(data.metrics.assignmentAvg), fill: '#3b82f6' },
        { name: 'Completion', score: Math.round(data.metrics.completionRate), fill: '#10b981' },
        { name: 'Consistency', score: Math.round(data.metrics.consistency), fill: '#f59e0b' },
    ];

    const radialData = [
        { name: 'OGI', uv: data.OGI, fill: clsColor }
    ];

    const weeklyHistory = weeklyTrendDummy.concat({ week: 'Current', ogi: data.OGI });

    return (
        <div className="app-layout">
            <Sidebar />
            <main className="main-content">
                {/* Header */}
                <div className="card greeting-card" style={{ marginBottom: '24px', background: 'var(--gradient-primary)', border: 'none' }}>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '6px' }}>Growth Analytics</h2>
                    <p style={{ opacity: 0.85 }}>Deep insights into your performance metrics and Overall Growth Index (OGI).</p>
                </div>

                {/* OGI + Breakdown */}
                <div className="dashboard-grid-wide" style={{ marginBottom: '24px' }}>
                    {/* OGI Radial */}
                    <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                        <h3 style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>Overall Growth Index (OGI)</h3>
                        <div style={{ height: '240px', width: '100%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <RadialBarChart cx="50%" cy="50%" innerRadius="80%" outerRadius="100%" barSize={15} data={radialData} startAngle={210} endAngle={-30}>
                                    <RadialBar minAngle={15} background clockWise dataKey="uv" cornerRadius={10} />
                                </RadialBarChart>
                            </ResponsiveContainer>
                            <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <div style={{ fontSize: '3.5rem', fontWeight: '900', color: 'var(--text-primary)', lineHeight: 1 }}>{data.OGI}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '4px' }}>OGI Score</div>
                            </div>
                        </div>
                        <div style={{
                            marginTop: '8px', padding: '8px 24px', borderRadius: '30px',
                            fontWeight: '700', fontSize: '1rem',
                            color: clsColor,
                            background: `${clsColor}1A`,
                            border: `1px solid ${clsColor}40`
                        }}>
                            {data.classification}
                        </div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '12px', maxWidth: '240px' }}>
                            Score: 85–100 Excellent · 70–84 Improving · 50–69 Stable · Below 50 Needs Attention
                        </p>
                    </div>

                    {/* Bar Chart */}
                    <div className="card">
                        <div className="card-header" style={{ marginBottom: '16px' }}>
                            <span className="card-title">Performance Breakdown</span>
                        </div>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={metricsData} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                                <RechartsTooltip cursor={{ fill: 'rgba(255,255,255,0.02)' }} contentStyle={{ background: '#1e1e2d', border: 'none', borderRadius: '8px', color: '#fff' }} formatter={(v) => [`${v}%`]} />
                                <Bar dataKey="score" radius={[6, 6, 0, 0]} barSize={44} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Metrics Cards */}
                <div className="dashboard-grid" style={{ marginBottom: '24px' }}>
                    <div className="card stat-card purple">
                        <div className="card-header">
                            <span className="card-title">Quiz Average</span>
                            <div className="card-icon" style={{ background: 'rgba(139,92,246,0.15)' }}><Target size={20} color="#a78bfa" /></div>
                        </div>
                        <div className="card-value">{Math.round(data.metrics.quizAvg)}%</div>
                        <div className="progress-bar-wrapper"><div className="progress-bar"><div className="progress-fill purple" style={{ width: `${data.metrics.quizAvg}%` }} /></div></div>
                        <div className="card-sub" style={{ marginTop: '8px' }}>Quiz Performance Summary</div>
                    </div>

                    <div className="card stat-card blue">
                        <div className="card-header">
                            <span className="card-title">Assignment Avg</span>
                            <div className="card-icon" style={{ background: 'rgba(59,130,246,0.15)' }}><Award size={20} color="#60a5fa" /></div>
                        </div>
                        <div className="card-value">{Math.round(data.metrics.assignmentAvg)}%</div>
                        <div className="progress-bar-wrapper"><div className="progress-bar"><div className="progress-fill blue" style={{ width: `${data.metrics.assignmentAvg}%` }} /></div></div>
                        <div className="card-sub" style={{ marginTop: '8px' }}>Average Assignment Score</div>
                    </div>

                    <div className="card stat-card green">
                        <div className="card-header">
                            <span className="card-title">Module Completion</span>
                            <div className="card-icon" style={{ background: 'rgba(16,185,129,0.15)' }}><BookOpen size={20} color="#34d399" /></div>
                        </div>
                        <div className="card-value">{Math.round(data.metrics.completionRate)}%</div>
                        <div className="progress-bar-wrapper"><div className="progress-bar"><div className="progress-fill green" style={{ width: `${data.metrics.completionRate}%` }} /></div></div>
                        <div className="card-sub" style={{ marginTop: '8px' }}>Module Completion Rate</div>
                    </div>

                    <div className="card stat-card amber">
                        <div className="card-header">
                            <span className="card-title">Consistency</span>
                            <div className="card-icon" style={{ background: 'rgba(245,158,11,0.15)' }}><Zap size={20} color="#fbbf24" /></div>
                        </div>
                        <div className="card-value">{Math.round(data.metrics.consistency)}%</div>
                        <div className="progress-bar-wrapper"><div className="progress-bar"><div className="progress-fill amber" style={{ width: `${data.metrics.consistency}%` }} /></div></div>
                        <div className="card-sub" style={{ marginTop: '8px' }}>On-time Submission Rate</div>
                    </div>
                </div>

                {/* OGI Formula Card */}
                <div className="card" style={{ marginBottom: '24px' }}>
                    <div className="card-header" style={{ marginBottom: '16px' }}>
                        <span className="card-title">OGI Calculation Breakdown</span>
                        <TrendingUp size={18} color="var(--text-muted)" />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                        {[
                            { label: 'Quiz Average × 0.40', value: (data.metrics.quizAvg * 0.40).toFixed(1), color: '#8b5cf6' },
                            { label: 'Assignment Avg × 0.30', value: (data.metrics.assignmentAvg * 0.30).toFixed(1), color: '#3b82f6' },
                            { label: 'Completion Rate × 0.20', value: (data.metrics.completionRate * 0.20).toFixed(1), color: '#10b981' },
                            { label: 'Consistency × 0.10', value: (data.metrics.consistency * 0.10).toFixed(1), color: '#f59e0b' },
                        ].map(item => (
                            <div key={item.label} style={{ background: `${item.color}10`, borderRadius: '10px', padding: '14px', border: `1px solid ${item.color}25` }}>
                                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px' }}>{item.label}</div>
                                <div style={{ fontSize: '1.4rem', fontWeight: '800', color: item.color }}>{item.value}</div>
                            </div>
                        ))}
                    </div>
                    <div style={{ textAlign: 'right', marginTop: '16px', fontSize: '1rem', color: 'var(--text-secondary)' }}>
                        Total OGI = <strong style={{ color: clsColor, fontSize: '1.4rem' }}>{data.OGI}</strong>
                    </div>
                </div>

                {/* Weekly OGI Trend Line Chart */}
                <div className="card" style={{ marginBottom: '24px' }}>
                    <div className="card-header" style={{ marginBottom: '16px' }}>
                        <span className="card-title">Weekly OGI Performance Trend</span>
                        <TrendingUp size={18} color="var(--text-muted)" />
                    </div>
                    <ResponsiveContainer width="100%" height={220}>
                        <LineChart data={weeklyHistory} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis dataKey="week" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                            <RechartsTooltip contentStyle={{ background: '#1e1e2d', border: 'none', borderRadius: '8px', color: '#fff' }} formatter={(v) => [`${v}`, 'OGI']} />
                            <Line type="monotone" dataKey="ogi" stroke={clsColor} strokeWidth={3} dot={{ fill: clsColor, r: 5 }} activeDot={{ r: 7 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Weekly Performance History Table */}
                <div className="card">
                    <div className="card-header" style={{ marginBottom: '16px' }}>
                        <span className="card-title">Weekly Performance History</span>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                    {['Period', 'OGI Score', 'Quiz Avg', 'Assignment Avg', 'Classification'].map(h => (
                                        <th key={h} style={{ padding: '12px 16px', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {weeklyHistory.map((row, i) => {
                                    const cls = row.ogi >= 85 ? 'Excellent' : row.ogi >= 70 ? 'Improving' : row.ogi >= 50 ? 'Stable' : 'Needs Attention';
                                    const rc = getClassificationColor(cls);
                                    return (
                                        <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', background: i === weeklyHistory.length - 1 ? 'rgba(99,102,241,0.05)' : 'transparent' }}>
                                            <td style={{ padding: '14px 16px', color: 'var(--text-primary)', fontWeight: i === weeklyHistory.length - 1 ? '700' : '400' }}>{row.week}</td>
                                            <td style={{ padding: '14px 16px', fontWeight: '700', color: rc, fontSize: '1.05rem' }}>{row.ogi}</td>
                                            <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>{Math.round(data.metrics.quizAvg * (0.9 + i * 0.03))}%</td>
                                            <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>{Math.round(data.metrics.assignmentAvg * (0.88 + i * 0.02))}%</td>
                                            <td style={{ padding: '14px 16px' }}>
                                                <span style={{ padding: '3px 12px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '600', background: `${rc}18`, color: rc, border: `1px solid ${rc}35` }}>
                                                    {cls}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Analytics;
