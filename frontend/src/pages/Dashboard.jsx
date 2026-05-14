import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FiTrash2 } from 'react-icons/fi';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import StudyTracker from '../components/StudyTracker';
import './Dashboard.css';

const Dashboard = () => {
    const [roadmaps, setRoadmaps] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);
    const { showToast } = useToast();

    useEffect(() => {
        const fetchRoadmaps = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                const { data } = await axios.get('/api/roadmaps', config);
                setRoadmaps(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchRoadmaps();
        }
    }, [user]);

    const handleDeleteRoadmap = async (e, id) => {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('Frontend: DELETE BUTTON CLICKED for ID:', id);
        
        if (!window.confirm('PERMANENTLY DELETE this roadmap?')) return;
        
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const response = await axios.delete(`/api/roadmaps/${id}`, config);
            console.log('Frontend: Delete Success:', response.data);
            setRoadmaps(prev => prev.filter(r => r._id !== id));
            showToast('Roadmap deleted successfully');
        } catch (error) {
            console.error('Frontend: Delete failed', error);
            showToast(error.response?.data?.message || 'Delete failed', 'error');
        }
    };

    if (loading) return <div className="loading-spinner">Loading...</div>;

    return (
        <div className="dashboard container animate-fade-in">
            <header className="dashboard-header">
                <div>
                    <h1 className="text-gradient">Welcome back, {user.name}</h1>
                    <p>Continue your journey towards tech mastery.</p>
                </div>
                <Link to="/generate" className="btn-primary">
                    Generate New Roadmap
                </Link>
            </header>

            <StudyTracker />

            <div className="roadmaps-grid">
                {roadmaps.length === 0 ? (
                    <div className="empty-state glass">
                        <div className="empty-icon">🚀</div>
                        <h3>No roadmaps yet</h3>
                        <p>Generate your first personalized learning path to get started.</p>
                        <Link to="/generate" className="btn-secondary">Get Started</Link>
                    </div>
                ) : (
                    roadmaps.map(roadmap => (
                        <div key={roadmap._id} className="roadmap-card glass">
                            <div className="roadmap-card-header">
                                <div className="card-top">
                                    <span className="category-tag">{roadmap.skillLevel}</span>
                                    <span 
                                        className="btn-delete-roadmap" 
                                        onClick={(e) => {
                                            console.log('FRONTEND: Span clicked for ID:', roadmap._id);
                                            handleDeleteRoadmap(e, roadmap._id);
                                        }}
                                        title="Delete Roadmap"
                                    >
                                        <FiTrash2 />
                                    </span>
                                </div>
                                <h3>{roadmap.targetRole}</h3>
                                <p className="duration">{roadmap.duration} Months Journey</p>
                            </div>
                            
                            <div className="progress-section">
                                <div className="progress-info">
                                    <span className="progress-label">Current Mastery</span>
                                    <span className="progress-percent">{Math.round(roadmap.progress)}%</span>
                                </div>
                                <div className="progress-bar-bg">
                                    <div 
                                        className="progress-bar-fill" 
                                        style={{ width: `${roadmap.progress}%` }}
                                    ></div>
                                </div>
                            </div>

                            <Link to={`/roadmap/${roadmap._id}`} className="btn-secondary view-btn">
                                Continue Learning
                            </Link>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Dashboard;
