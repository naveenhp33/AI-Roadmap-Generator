import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FiCheckCircle, FiCircle, FiArrowLeft, FiZap, FiBookOpen, FiExternalLink, FiCpu } from 'react-icons/fi';
import './PhaseDetailsPage.css';

const PhaseDetailsPage = () => {
    const { id, phaseIndex } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [roadmap, setRoadmap] = useState(null);
    const [loading, setLoading] = useState(true);

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
            const newStatus = !isCompleted;
            const { data } = await axios.put(`/api/roadmaps/${id}/progress`, { taskId, isCompleted: newStatus }, config);
            setRoadmap(data);

            // Log activity to heatmap if task was just completed
            if (newStatus) {
                await axios.post('/api/study/log', {
                    date: new Date().toISOString().split('T')[0],
                    minutesStudied: 15, // Arbitrary 15 mins per task for the heatmap
                    task: taskId
                }, config);
            }
        } catch (error) {
            console.error('Error updating progress', error);
        }
    };

    const getSafeLink = (res) => {
        if (!res.link || res.link.includes('...') || res.link === '#' || res.link.length < 10) {
            return `https://www.youtube.com/results?search_query=${encodeURIComponent(res.title)}`;
        }
        return res.link;
    };

    if (loading) return <div className="loading-spinner">Loading phase details...</div>;
    if (!roadmap) return <div className="error-message">Roadmap not found</div>;

    const phase = roadmap.roadmapData.monthlyRoadmap[parseInt(phaseIndex)];
    if (!phase) return <div className="error-message">Phase not found</div>;

    return (
        <div className="phase-details-page container animate-fade-in">
            <button className="back-btn" onClick={() => navigate(`/roadmap/${id}`)}>
                <FiArrowLeft /> Back to Roadmap
            </button>

            <header className="phase-header glass">
                <div className="phase-badge">Phase {phase.month}</div>
                <h1>{phase.focus}</h1>
                <p>Track your progress and master each task in this phase.</p>
            </header>

            <div className="tasks-grid">
                {phase.weeklyGoals.map((week, wIdx) => (
                    <div key={wIdx} className="week-card glass">
                        <div className="week-header">
                            <FiBookOpen className="week-icon" />
                            <h3>Week {week.week}</h3>
                        </div>
                        <ul className="task-list">
                            {week.tasks.map((task, tIdx) => {
                                const taskId = `m${phase.month}-w${week.week}-t${tIdx}`;
                                const isDone = roadmap.completedTasks.includes(taskId);
                                return (
                                    <li 
                                        key={tIdx} 
                                        className={`task-item ${isDone ? 'completed' : ''}`}
                                        onClick={() => handleTaskToggle(taskId, isDone)}
                                    >
                                        <div className="task-status">
                                            {isDone ? <FiCheckCircle className="icon-done" /> : <FiCircle className="icon-todo" />}
                                        </div>
                                        <span>{task}</span>
                                        {isDone && <div className="completed-badge">Completed</div>}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </div>

            <div className="extra-sections">
                <section className="resources-section glass animate-fade-in" style={{animationDelay: '0.4s'}}>
                    <h2><FiExternalLink /> Suggested Resources</h2>
                    <div className="resources-grid">
                        {phase.suggestedResources?.map((res, i) => (
                            <a key={i} href={getSafeLink(res)} target="_blank" rel="noopener noreferrer" className="res-card">
                                <div className="res-type">{res.type}</div>
                                <h4>{res.title}</h4>
                                <div className="res-actions">
                                    <span className="view-link">View Resource <FiExternalLink /></span>
                                    <span className="search-fallback" onClick={(e) => {
                                        e.preventDefault();
                                        window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(res.title)}+2025+tutorial`, '_blank');
                                    }}>
                                        Search 2025 Updates
                                    </span>
                                </div>
                            </a>
                        ))}
                    </div>
                </section>

                <section className="interview-section glass animate-fade-in" style={{animationDelay: '0.6s'}}>
                    <h2><FiCpu /> Interview Prep</h2>
                    <div className="prep-container">
                        {roadmap.roadmapData.interviewPrep?.map((prep, i) => (
                            <div key={i} className="prep-card">
                                <h3>{prep.topic}</h3>
                                <div className="prep-content">
                                    <div className="q-list">
                                        <strong>Common Questions:</strong>
                                        <ul>{prep.questions?.map((q, qi) => <li key={qi}>{q}</li>)}</ul>
                                    </div>
                                    <div className="tips-list">
                                        <strong>Quick Tips:</strong>
                                        <ul>{prep.tips?.map((t, ti) => <li key={ti}>{t}</li>)}</ul>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default PhaseDetailsPage;
