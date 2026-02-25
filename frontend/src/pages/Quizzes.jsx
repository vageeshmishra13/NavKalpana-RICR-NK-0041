import { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import { quizAPI } from '../api/axiosClient';
import { HelpCircle, Clock, CheckCircle, XCircle, Trophy, AlertCircle } from 'lucide-react';

const Quizzes = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);

    const [activeQuiz, setActiveQuiz] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [timeLeft, setTimeLeft] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [quizResult, setQuizResult] = useState(null);
    const timerRef = useRef(null);

    useEffect(() => {
        fetchQuizzes();
    }, []);

    // Countdown timer
    useEffect(() => {
        if (activeQuiz && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current);
                        handleAutoSubmit();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timerRef.current);
    }, [activeQuiz]);

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
        setAnswers(new Array(quiz.questions.length).fill(''));
        setTimeLeft(quiz.durationMins * 60);
        setQuizResult(null);
    };

    const handleOptionSelect = (qIndex, option) => {
        const newAnswers = [...answers];
        newAnswers[qIndex] = option;
        setAnswers(newAnswers);
    };

    const handleAutoSubmit = () => {
        submitQuiz(true);
    };

    const submitQuiz = async (auto = false) => {
        clearInterval(timerRef.current);
        setSubmitting(true);
        try {
            const { data } = await quizAPI.submit(activeQuiz._id, answers);
            setQuizResult({ ...data, quiz: activeQuiz, userAnswers: answers, autoSubmitted: auto });
            setActiveQuiz(null);
            fetchQuizzes();
            window.dispatchEvent(new CustomEvent('statsUpdate', {
                detail: { learningStreak: data.userStreak }
            }));
        } catch (error) {
            console.error('Error submitting quiz', error);
            alert('Error submitting quiz');
        } finally {
            setSubmitting(false);
        }
    };

    const formatTime = (secs) => {
        const m = Math.floor(secs / 60).toString().padStart(2, '0');
        const s = (secs % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const timerColor = timeLeft < 60 ? '#ef4444' : timeLeft < 180 ? '#f59e0b' : '#10b981';

    // ---- RESULTS SCREEN ----
    if (quizResult) {
        const score = quizResult.scorePercentage || Math.round((quizResult.correctAnswers / quizResult.quiz.questions.length) * 100);
        const gradeColor = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444';
        const gradeMsg = score >= 80 ? 'Excellent! 🏆' : score >= 60 ? 'Good Job! 👍' : 'Keep Practicing! 💪';

        return (
            <div className="app-layout">
                <Sidebar />
                <main className="main-content">
                    <div className="card" style={{ maxWidth: '700px', margin: '0 auto' }}>
                        {/* Score Header */}
                        <div style={{ textAlign: 'center', marginBottom: '32px', padding: '32px', background: `${gradeColor}12`, borderRadius: '16px', border: `1px solid ${gradeColor}30` }}>
                            <Trophy size={48} color={gradeColor} style={{ marginBottom: '12px' }} />
                            <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '8px' }}>Quiz Completed!</h2>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>{quizResult.quiz.title}</p>
                            <div style={{ fontSize: '4rem', fontWeight: '900', color: gradeColor, lineHeight: 1 }}>{score}%</div>
                            <div style={{ fontSize: '1.2rem', color: gradeColor, marginTop: '8px', fontWeight: '600' }}>{gradeMsg}</div>
                        </div>

                        {/* Stats */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '32px' }}>
                            <div style={{ background: 'rgba(16,185,129,0.08)', borderRadius: '12px', padding: '16px', textAlign: 'center', border: '1px solid rgba(16,185,129,0.2)' }}>
                                <CheckCircle size={24} color="#10b981" style={{ margin: '0 auto 8px' }} />
                                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#10b981' }}>{quizResult.correctAnswers}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Correct</div>
                            </div>
                            <div style={{ background: 'rgba(239,68,68,0.08)', borderRadius: '12px', padding: '16px', textAlign: 'center', border: '1px solid rgba(239,68,68,0.2)' }}>
                                <XCircle size={24} color="#ef4444" style={{ margin: '0 auto 8px' }} />
                                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#ef4444' }}>
                                    {quizResult.quiz.questions.length - quizResult.correctAnswers}
                                </div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Incorrect</div>
                            </div>
                            <div style={{ background: 'rgba(99,102,241,0.08)', borderRadius: '12px', padding: '16px', textAlign: 'center', border: '1px solid rgba(99,102,241,0.2)' }}>
                                <HelpCircle size={24} color="#818cf8" style={{ margin: '0 auto 8px' }} />
                                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#818cf8' }}>{quizResult.quiz.questions.length}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total</div>
                            </div>
                        </div>

                        {/* Question Review */}
                        <h3 style={{ marginBottom: '16px', color: 'var(--text-secondary)' }}>Answer Review</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
                            {quizResult.quiz.questions.map((q, i) => {
                                const isCorrect = quizResult.userAnswers[i] === q.correctAnswer;
                                return (
                                    <div key={i} style={{
                                        padding: '16px',
                                        borderRadius: '12px',
                                        background: isCorrect ? 'rgba(16,185,129,0.06)' : 'rgba(239,68,68,0.06)',
                                        border: `1px solid ${isCorrect ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                            {isCorrect ? <CheckCircle size={18} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} /> : <XCircle size={18} color="#ef4444" style={{ flexShrink: 0, marginTop: '2px' }} />}
                                            <div style={{ flex: 1 }}>
                                                <p style={{ fontWeight: '600', marginBottom: '6px', color: 'var(--text-primary)' }}>{i + 1}. {q.questionText}</p>
                                                <p style={{ fontSize: '0.85rem', color: isCorrect ? '#10b981' : '#ef4444', marginBottom: '4px' }}>
                                                    Your answer: <strong>{quizResult.userAnswers[i] || 'Not answered'}</strong>
                                                </p>
                                                {!isCorrect && (
                                                    <p style={{ fontSize: '0.85rem', color: '#10b981' }}>
                                                        Correct: <strong>{q.correctAnswer}</strong>
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => setQuizResult(null)}>
                            Back to All Quizzes
                        </button>
                    </div>
                </main>
            </div>
        );
    }

    // ---- ACTIVE QUIZ SCREEN ----
    if (activeQuiz) {
        const answered = answers.filter(a => a !== '').length;
        return (
            <div className="app-layout">
                <Sidebar hideMobile={true} />
                <main className="main-content">
                    <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
                        {/* Quiz Header with Timer */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', paddingBottom: '20px', borderBottom: '1px solid var(--border)' }}>
                            <div>
                                <h4 style={{ color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.72rem', fontWeight: 'bold', letterSpacing: '0.1em', marginBottom: '4px' }}>Active Quiz</h4>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>{activeQuiz.title}</h2>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>
                                    {answered} / {activeQuiz.questions.length} answered
                                </p>
                            </div>
                            {/* Countdown Timer */}
                            <div style={{
                                display: 'flex', flexDirection: 'column', alignItems: 'center',
                                padding: '12px 20px',
                                background: `${timerColor}15`,
                                borderRadius: '14px',
                                border: `1px solid ${timerColor}40`,
                                minWidth: '100px'
                            }}>
                                <Clock size={18} color={timerColor} style={{ marginBottom: '4px' }} />
                                <div style={{ fontSize: '1.6rem', fontWeight: '900', color: timerColor, fontVariantNumeric: 'tabular-nums' }}>
                                    {formatTime(timeLeft)}
                                </div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>remaining</div>
                            </div>
                        </div>

                        {/* Progress */}
                        <div className="progress-bar-wrapper" style={{ marginBottom: '28px' }}>
                            <div className="progress-bar">
                                <div className="progress-fill purple" style={{ width: `${(answered / activeQuiz.questions.length) * 100}%`, transition: 'width 0.3s ease' }} />
                            </div>
                        </div>

                        {/* Questions */}
                        {activeQuiz.questions.map((q, qIndex) => (
                            <div key={qIndex} style={{ marginBottom: '32px' }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px' }}>
                                    <div style={{
                                        width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                                        background: answers[qIndex] ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.05)',
                                        border: `2px solid ${answers[qIndex] ? '#6366f1' : 'rgba(255,255,255,0.1)'}`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '0.8rem', fontWeight: 'bold', color: answers[qIndex] ? '#818cf8' : 'var(--text-muted)'
                                    }}>
                                        {qIndex + 1}
                                    </div>
                                    <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#e2e8f0' }}>{q.questionText}</h4>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingLeft: '40px' }}>
                                    {q.options.map((opt, oIndex) => (
                                        <label key={oIndex} style={{
                                            display: 'flex', alignItems: 'center', gap: '12px',
                                            padding: '12px 16px',
                                            background: answers[qIndex] === opt ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.03)',
                                            border: `1px solid ${answers[qIndex] === opt ? '#6366f1' : 'rgba(255,255,255,0.06)'}`,
                                            borderRadius: '10px', cursor: 'pointer', transition: 'all 0.15s'
                                        }}>
                                            <input
                                                type="radio"
                                                name={`q-${qIndex}`}
                                                value={opt}
                                                checked={answers[qIndex] === opt}
                                                onChange={() => handleOptionSelect(qIndex, opt)}
                                                style={{ accentColor: '#6366f1', transform: 'scale(1.2)', flexShrink: 0 }}
                                            />
                                            <span style={{ color: answers[qIndex] === opt ? '#fff' : 'var(--text-secondary)' }}>{opt}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {/* Footer */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '28px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
                            {answered < activeQuiz.questions.length && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fbbf24', fontSize: '0.85rem' }}>
                                    <AlertCircle size={16} />
                                    {activeQuiz.questions.length - answered} question(s) unanswered
                                </div>
                            )}
                            <div style={{ marginLeft: 'auto' }}>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => submitQuiz()}
                                    disabled={submitting}
                                    style={{ padding: '12px 32px', fontWeight: 'bold' }}
                                >
                                    {submitting ? 'Submitting...' : 'Submit Final Answers'}
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    // ---- QUIZ LIST ----
    return (
        <div className="app-layout">
            <Sidebar />
            <main className="main-content">
                <div className="card greeting-card" style={{ marginBottom: '24px', background: 'var(--gradient-accent)', border: 'none' }}>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '6px' }}>Quizzes</h2>
                    <p style={{ opacity: 0.9 }}>Test your knowledge and earn streak points.</p>
                </div>

                {loading ? (
                    <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px' }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ width: '40px', height: '40px', border: '3px solid rgba(99,102,241,0.3)', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
                            <p style={{ color: 'var(--text-muted)' }}>Loading quizzes...</p>
                        </div>
                    </div>
                ) : quizzes.length === 0 ? (
                    <div className="card"><p>No quizzes available right now.</p></div>
                ) : (
                    <div className="dashboard-grid">
                        {quizzes.map(quiz => (
                            <div key={quiz._id} className="card stat-card" style={{ display: 'flex', flexDirection: 'column' }}>
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

                                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '8px' }}>{quiz.title}</h3>
                                <div style={{ display: 'flex', gap: '16px', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '20px' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Clock size={14} /> {quiz.durationMins} min
                                    </span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <HelpCircle size={14} /> {quiz.totalQuestions} Qs
                                    </span>
                                </div>

                                {quiz.status === 'Completed' ? (
                                    <div style={{ marginTop: 'auto' }}>
                                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '6px' }}>
                                            <div style={{ fontSize: '2rem', fontWeight: '900', color: quiz.scorePercentage >= 80 ? '#10b981' : quiz.scorePercentage >= 60 ? '#f59e0b' : '#ef4444' }}>
                                                {quiz.scorePercentage}%
                                            </div>
                                            <div className="card-sub">score</div>
                                        </div>
                                        <div className="progress-bar-wrapper">
                                            <div className="progress-bar">
                                                <div className="progress-fill green" style={{ width: `${quiz.scorePercentage}%` }} />
                                            </div>
                                        </div>
                                        <div className="card-sub" style={{ marginTop: '8px' }}>{quiz.correctAnswers} / {quiz.totalQuestions} correct</div>
                                    </div>
                                ) : (
                                    <button
                                        className="btn btn-primary"
                                        style={{ width: '100%', marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                                        onClick={() => startQuiz(quiz)}
                                    >
                                        <Clock size={16} /> Start Quiz
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
