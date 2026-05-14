import React, { useEffect, useState, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { FiCheckCircle, FiCircle, FiSend, FiPrinter, FiZap, FiTarget, FiBox, FiTrendingUp, FiX, FiDollarSign, FiBriefcase, FiLock, FiUnlock, FiShare2 } from 'react-icons/fi';
import './RoadmapResultPage.css';

const RoadmapResultPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const { showToast } = useToast();
    const [roadmap, setRoadmap] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const [chatMessages, setChatMessages] = useState([]);
    const [chatInput, setChatInput] = useState('');
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatLoading, setChatLoading] = useState(false);
    const chatEndRef = useRef(null);

    useEffect(() => {
        const fetchRoadmap = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get(`/api/roadmaps/${id}`, config);
                setRoadmap(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchRoadmap();
    }, [id, user.token]);

    const handleTaskToggle = async (taskId, isCompleted) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.put(`/api/roadmaps/${id}/progress`, { taskId, isCompleted: !isCompleted }, config);
            setRoadmap(data);
        } catch (error) {
            console.error('Error updating progress', error);
        }
    };

    const handleTogglePrivacy = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.put(`/api/roadmaps/${id}/privacy`, {}, config);
            setRoadmap(data);
        } catch (error) {
            console.error('Error toggling privacy', error);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!chatInput.trim()) return;
        const newUserMessage = { role: 'user', content: chatInput };
        setChatMessages(prev => [...prev, newUserMessage]);
        setChatInput('');
        setChatLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.post('/api/roadmaps/chat', { message: newUserMessage.content }, config);
            setChatMessages(prev => [...prev, { role: 'mentor', content: data.reply }]);
        } catch (error) {
            setChatMessages(prev => [...prev, { role: 'mentor', content: 'Connection lost.' }]);
        } finally {
            setChatLoading(false);
        }
    };

    if (loading) return <div className="loading-spinner">Powering up your journey...</div>;
    if (!roadmap) return <div className="error-message">Roadmap not found</div>;

    const rd = roadmap.roadmapData;
    const totalPhases = rd.monthlyRoadmap.length;
    const COLS = 3;

    // Build a flat grid: each phase gets an explicit (row, col) position
    const buildSnakeGrid = () => {
        const grid = [];
        for (let i = 0; i < totalPhases; i++) {
            const row = Math.floor(i / COLS);
            const posInRow = i % COLS;
            const isReversed = row % 2 !== 0;
            const col = isReversed ? (COLS - 1 - posInRow) : posInRow;
            grid.push({ phase: rd.monthlyRoadmap[i], globalIdx: i, row, col });
        }
        return grid;
    };

    const grid = buildSnakeGrid();
    const totalRows = Math.ceil(totalPhases / COLS);

    // Group by row
    const rows = [];
    for (let r = 0; r < totalRows; r++) {
        // Create a 3-slot array for this row
        const slots = [null, null, null];
        grid.filter(g => g.row === r).forEach(g => { slots[g.col] = g; });
        rows.push({ rowIndex: r, isReversed: r % 2 !== 0, slots });
    }

    return (
        <>
        <div className="roadmap-result container animate-fade-in">
            <header className="tech-header">
                <div className="header-left">
                    <div className="target-badge"><FiTarget /> {roadmap.targetRole} Roadmap</div>
                    <h1>Your Path to <br /><span className="text-gradient">Mastery</span></h1>
                </div>
                <div className="header-right">
                    <div className="progress-stat">
                        <div className="stat-label">
                            <span>Journey Progress</span>
                            <span>{roadmap.progress}%</span>
                        </div>
                        <div className="bar-bg">
                            <div className="bar-fill" style={{width: `${roadmap.progress}%`}}></div>
                        </div>
                    </div>
                    <div className="header-actions">
                        <button className="btn-secondary" onClick={() => window.print()}>
                            <FiPrinter /> Save as PDF
                        </button>
                        <button className={`btn-privacy ${roadmap.isPublic ? 'public' : 'private'}`} onClick={handleTogglePrivacy}>
                            {roadmap.isPublic ? <><FiUnlock /> Public</> : <><FiLock /> Private</>}
                        </button>
                        {roadmap.isPublic && (
                            <button className="btn-share" onClick={() => {
                                navigator.clipboard.writeText(window.location.href);
                                showToast('Roadmap link copied to clipboard!');
                            }}>
                                <FiShare2 /> Share
                            </button>
                        )}
                    </div>
                </div>
            </header>

            <div className="snake-container animate-fade-in">
                {rows.map(({ rowIndex, isReversed, slots }) => (
                    <div key={rowIndex} className="snake-row">
                        {slots.map((slot, colIdx) => {
                            if (!slot) {
                                return <div key={`empty-${rowIndex}-${colIdx}`} className="node-cell empty-cell" />;
                            }

                            const { phase, globalIdx } = slot;
                            const isCompleted = roadmap.progress >= (globalIdx + 1) * (100 / totalPhases);
                            const isLastPhase = globalIdx === totalPhases - 1;

                            // Determine which connector this node needs
                            const nextIdx = globalIdx + 1;
                            const nextRow = Math.floor(nextIdx / COLS);
                            const needsConnector = !isLastPhase;
                            const needsUturn = needsConnector && (nextRow !== rowIndex);

                            // Horizontal connector direction
                            const nextPosInRow = nextIdx % COLS;
                            const nextCol = isReversed ? (COLS - 1 - nextPosInRow) : nextPosInRow;
                            const connectorGoesRight = nextCol > colIdx;

                            return (
                                <div key={globalIdx} className={`node-cell ${isCompleted ? 'completed' : ''}`}>
                                    <div className="node-box glass" onClick={() => navigate(`/roadmap/${id}/phase/${globalIdx}`)}>
                                        <div className="node-icon">
                                            {isCompleted ? <FiCheckCircle /> : <FiZap />}
                                        </div>
                                        <div className="node-info">
                                            <span className="node-month">Phase {phase.month}</span>
                                            <h3>{phase.focus}</h3>
                                        </div>
                                        <div className="click-hint">Click to view tasks</div>
                                    </div>
                                    
                                    {needsConnector && !needsUturn && (
                                        <div className={`connector horizontal ${connectorGoesRight ? 'right' : 'left'}`}>
                                            <div className="line"></div>
                                        </div>
                                    )}

                                    {needsUturn && (
                                        <div className={`connector u-turn ${colIdx === 0 ? 'u-left' : 'u-right'}`}>
                                            <div className="line"></div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>

            <aside className="bottom-info">
                <div className="info-card glass animate-fade-in" style={{animationDelay: '0.6s'}}>
                    <h3><FiTrendingUp /> Skill Gap Analysis</h3>
                    <p style={{marginBottom: '1.5rem', color: 'var(--text-secondary)'}}>We've identified these areas where you can improve to reach your goal.</p>
                    <div className="tags">
                        {rd.skillGapAnalysis?.missingSkills?.map((s, i) => <span key={i} className="t-missing">{s}</span>)}
                    </div>
                </div>
                <div className="info-card glass animate-fade-in" style={{animationDelay: '0.8s'}}>
                    <h3><FiBox /> Recommended Projects</h3>
                    <p style={{marginBottom: '1.5rem', color: 'var(--text-secondary)'}}>Build these to solidify your learning and build a portfolio.</p>
                    <div className="proj-list" style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                        {rd.projects?.slice(0, 3).map((p, i) => (
                            <div key={i} className="p-item" style={{padding: '1rem', background: 'var(--bg-color)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)'}}>
                                <h4 style={{fontSize: '1rem', marginBottom: '0.25rem'}}>{p.title}</h4>
                                <p style={{fontSize: '0.875rem', color: 'var(--text-secondary)'}}>{p.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="info-card glass animate-fade-in" style={{animationDelay: '1s'}}>
                    <h3><FiDollarSign /> Market Insights</h3>
                    {rd.marketInsights ? (
                        <div className="market-stats">
                            <div className="m-stat">
                                <label>Avg. Salary</label>
                                <span>{rd.marketInsights.averageSalary}</span>
                            </div>
                            <div className="m-stat">
                                <label>Demand</label>
                                <span className={`d-badge ${rd.marketInsights.demandLevel.toLowerCase()}`}>{rd.marketInsights.demandLevel}</span>
                            </div>
                            <div className="m-stat">
                                <label>Top Hiring</label>
                                <div className="m-tags">
                                    {rd.marketInsights.topCompanies?.map((c, i) => <span key={i}>{c}</span>)}
                                </div>
                            </div>
                        </div>
                    ) : <p>Insights loading...</p>}
                </div>
            </aside>

        </div>
        
        {/* AI Chatbot Overlay - Outside main container to avoid transform issues */}
        <div className={`mentor-chat ${isChatOpen ? 'active' : ''}`}>
            {isChatOpen ? (
                <div className="chat-ui glass">
                    <div className="chat-header">
                        <FiZap /> AI Career Mentor
                        <button onClick={() => setIsChatOpen(false)} style={{marginLeft: 'auto', background: 'none', border: 'none', color: 'white', cursor: 'pointer'}}><FiX /></button>
                    </div>
                    <div className="chat-log">
                        {chatMessages.length === 0 && (
                            <div className="chat-m mentor">
                                Hello! I'm your AI career mentor. Ask me anything about this roadmap or your career path!
                            </div>
                        )}
                        {chatMessages.map((m, i) => <div key={i} className={`chat-m ${m.role}`}>{m.content}</div>)}
                        {chatLoading && <div className="dot-loader" style={{padding: '1rem'}}>Thinking...</div>}
                        <div ref={chatEndRef} />
                    </div>
                    <form className="chat-in" onSubmit={handleSendMessage}>
                        <input value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="Ask a question..." />
                    </form>
                </div>
            ) : (
                <button className="chat-btn animate-pulse-soft" onClick={() => setIsChatOpen(true)}>
                    <FiSend />
                </button>
            )}
        </div>
    </>
);
};

export default RoadmapResultPage;
