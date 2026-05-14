import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FiAward, FiLayout, FiCode, FiBriefcase, FiDownload } from 'react-icons/fi';
import './PortfolioBuilderPage.css';

const PortfolioBuilderPage = () => {
    const { user } = useContext(AuthContext);
    const [roadmaps, setRoadmaps] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRoadmaps = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get('/api/roadmaps', config);
                setRoadmaps(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchRoadmaps();
    }, [user.token]);

    if (loading) return <div className="loading-spinner">Building your profile...</div>;

    const completedSkills = [...new Set(roadmaps.flatMap(r => r.skills))]
        .filter(s => s && s.toLowerCase() !== 'nothing' && s.trim() !== '');
    
    const totalProgress = roadmaps.length > 0 
        ? Math.round(roadmaps.reduce((acc, curr) => acc + curr.progress, 0) / roadmaps.length) 
        : 0;

    return (
        <div className="portfolio-page container animate-fade-in">
            <header className="portfolio-header glass">
                <div className="profile-info">
                    <div className="avatar-placeholder">{user.name.charAt(0)}</div>
                    <div>
                        <h1>{user.name}</h1>
                        <p>{roadmaps.length > 0 ? roadmaps[0].targetRole : 'Aspiring Developer'}</p>
                    </div>
                </div>
                <button className="btn-primary" onClick={() => window.print()}><FiDownload /> Download Portfolio</button>
            </header>

            <div className="portfolio-grid">
                <section className="p-section glass">
                    <h2><FiAward /> Mastery Progress</h2>
                    <div className="overall-progress">
                        <div className="progress-circle">
                            <span className="p-val">{totalProgress}%</span>
                            <span className="p-label">Average Mastery</span>
                        </div>
                        <div className="progress-stats">
                            <div className="p-stat-item">
                                <strong>{roadmaps.length}</strong>
                                <span>Roadmaps Started</span>
                            </div>
                            <div className="p-stat-item">
                                <strong>{completedSkills.length}</strong>
                                <span>Skills Tracked</span>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="p-section glass">
                    <h2><FiCode /> Skill Cloud</h2>
                    <div className="skill-cloud">
                        {completedSkills.map((s, i) => (
                            <span key={i} className="skill-tag">{s}</span>
                        ))}
                    </div>
                </section>

                <section className="p-section glass full-width">
                    <h2><FiLayout /> Highlighted Projects</h2>
                    <div className="projects-list">
                        {roadmaps.flatMap(r => r.roadmapData.projects || []).slice(0, 4).map((p, i) => (
                            <div key={i} className="portfolio-project-card">
                                <h3>{p.title}</h3>
                                <p>{p.description}</p>
                                <div className="p-tech">
                                    {p.technologiesUsed?.map((t, ti) => <span key={ti} className="tech-tag">{t}</span>)}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default PortfolioBuilderPage;
