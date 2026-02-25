import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { quizAPI } from '../api/axiosClient';
import { HelpCircle, Clock, CheckCircle } from 'lucide-react';

const Quizzes = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);

    const [activeQuiz, setActiveQuiz] = useState(null);
    const [answers, setAnswers] = useState([]);

    useEffect(() => {
        fetchQuizzes();
    }, []);

    const fetchQuizzes = async () => {
        try {
            const { data } = await quizAPI.getAll();
            setQuizzes(data);
        } catch (error) {
            console.error('Failed to fetch quizzes', error);
        } finally {
            setLoading(false);
        }
    };

    const startQuiz = (quiz) => {
        setActiveQuiz(quiz);
        setAnswers(new Array(quiz.totalQuestions).fill(''));
    };

    const handleOptionSelect = (qIndex, option) => {
        const newAnswers = [...answers];
        newAnswers[qIndex] = option;
        setAnswers(newAnswers);
    };

    const submitQuiz = async () => {
        try {
            const { data } = await quizAPI.submit(activeQuiz._id, answers);
            setActiveQuiz(null);
            fetchQuizzes();

            // Emit event to update Dashboard without reload
            window.dispatchEvent(new CustomEvent('statsUpdate', {
                detail: { learningStreak: data.userStreak }
            }));

        } catch (error) {
            console.error('Error submitting quiz', error);
            alert('Error submitting quiz');
        }
    };

    if (activeQuiz) {
        return (
            <div className="app-layout">
                <Sidebar hideMobile={true} />
                <main className="main-content">
                    <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '32px',
                            paddingBottom: '20px',
                            borderBottom: '1px solid var(--border)'
                        }}>
                            <div>
                                <h4 style={{ color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 'bold', letterSpacing: '0.1em', marginBottom: '4px' }}>Active Quiz</h4>
                                <h2 style={{ fontSize: '1.75rem', fontWeight: '800' }}>{activeQuiz.title}</h2>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '30px', color: '#f59e0b', fontWeight: 'bold' }}>
                                <Clock size={18} /> {activeQuiz.durationMins} mins
                            </div>
                        </div>

                        {activeQuiz.questions.map((q, qIndex) => (
                            <div key={qIndex} style={{ marginBottom: '32px' }}>
                                <h4 style={{ fontSize: '1.1rem', marginBottom: '16px', color: '#e2e8f0' }}>{qIndex + 1}. {q.questionText}</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {q.options.map((opt, oIndex) => (
                                        <label
                                            key={oIndex}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '12px',
                                                padding: '12px 16px',
                                                background: answers[qIndex] === opt ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.03)',
                                                border: `1px solid ${answers[qIndex] === opt ? '#6366f1' : 'rgba(255,255,255,0.05)'}`,
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            <input
                                                type="radio"
                                                name={`q-${qIndex}`}
                                                value={opt}
                                                checked={answers[qIndex] === opt}
                                                onChange={() => handleOptionSelect(qIndex, opt)}
                                                style={{ accentColor: '#6366f1', transform: 'scale(1.2)' }}
                                            />
                                            <span style={{ color: answers[qIndex] === opt ? '#fff' : 'var(--text-secondary)' }}>{opt}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}

                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '32px' }}>
                            <button className="btn btn-primary" onClick={submitQuiz}>Submit Final Answers</button>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="app-layout">
            <Sidebar />
            <main className="main-content">
                <div className="card greeting-card" style={{
                    marginBottom: '24px',
                    background: 'var(--gradient-accent)',
                    border: 'none'
                }}>
                    <h2>Quizzes</h2>
                    <p style={{ opacity: 0.9 }}>Test your knowledge and earn streak points.</p>
                </div>

                {loading ? (
                    <div className="card"><p>Loading...</p></div>
                ) : quizzes.length === 0 ? (
                    <div className="card"><p>No quizzes available right now.</p></div>
                ) : (
                    <div className="dashboard-grid">
                        {quizzes.map(quiz => (
                            <div key={quiz._id} className="card stat-card">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                    <div className="card-icon" style={{ background: 'rgba(139,92,246,0.15)' }}>
                                        <HelpCircle size={24} color="#a78bfa" />
                                    </div>
                                    {quiz.status === 'Completed' ? (
                                        <span className="card-badge badge-success"><CheckCircle size={12} /> Completed</span>
                                    ) : (
                                        <span className="card-badge" style={{ background: 'rgba(255,255,255,0.1)' }}>Pending</span>
                                    )}
                                </div>

                                <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>{quiz.title}</h3>
                                <div style={{ display: 'flex', gap: '16px', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '16px' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14} /> {quiz.durationMins}m</span>
                                    <span>{quiz.totalQuestions} Questions</span>
                                </div>

                                {quiz.status === 'Completed' ? (
                                    <div>
                                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981', marginBottom: '4px' }}>{quiz.scorePercentage}%</div>
                                        <div className="card-sub">{quiz.correctAnswers} / {quiz.totalQuestions} correct</div>
                                    </div>
                                ) : (
                                    <button className="btn btn-primary" style={{ width: '100%', marginTop: 'auto' }} onClick={() => startQuiz(quiz)}>
                                        Start Quiz
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Quizzes;
