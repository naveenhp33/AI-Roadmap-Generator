import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FiUsers, FiArrowRight, FiTarget, FiActivity } from 'react-icons/fi';
import './CommunityPage.css';

const CommunityPage = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [roadmaps, setRoadmaps] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPublicRoadmaps = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get('/api/roadmaps/public', config);
                setRoadmaps(data);
            } catch (error) {
                console.error('Error fetching public roadmaps', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPublicRoadmaps();
    }, [user.token]);

    if (loading) return <div className="loading-spinner">Discovering roadmaps...</div>;

    return (
        <div className="community-page container animate-fade-in">
            <header className="page-header">
                <h1><FiUsers /> Community <span className="text-gradient">Roadmaps</span></h1>
                <p>Learn from the paths taken by others. Explore and fork high-quality roadmaps.</p>
            </header>

            <div className="roadmap-grid">
                {roadmaps.length === 0 ? (
                    <div className="empty-state glass">
                        <p>No public roadmaps available yet. Be the first to share one!</p>
                    </div>
                ) : (
                    roadmaps.map((rd) => (
                        <div key={rd._id} className="roadmap-card glass" onClick={() => navigate(`/roadmap/${rd._id}`)}>
                            <div className="card-header">
                                <div className="role-icon"><FiTarget /></div>
                                <h3>{rd.targetRole}</h3>
                            </div>
                            <div className="card-body">
                                <p><FiActivity /> Progress: {rd.progress}%</p>
                                <div className="tags">
                                    {rd.skills.slice(0, 3).map((s, i) => <span key={i}>{s}</span>)}
                                </div>
                            </div>
                            <div className="card-footer">
                                <span>View Journey</span>
                                <FiArrowRight />
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CommunityPage;
