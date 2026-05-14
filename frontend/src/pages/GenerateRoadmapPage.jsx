import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './GenerateRoadmapPage.css';

const GenerateRoadmapPage = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        targetRole: '',
        skills: '',
        experienceLevel: 'Beginner',
        studyHours: '',
        duration: '',
        preferredLearningStyle: 'Video based',
        interests: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.post('/api/roadmaps/generate', formData, config);
            navigate(`/roadmap/${data._id}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to generate roadmap. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="generate-page container animate-fade-in">
            <div className="form-container glass">
                <div className="form-header">
                    <h2>Generate Your AI Roadmap</h2>
                    <p>Tell us about your goals, and we'll create a personalized learning path.</p>
                </div>
                
                {error && <div className="error-message">{error}</div>}

                {loading ? (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Generating your personalized roadmap... This might take a minute.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="roadmap-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label>Target Role</label>
                                <input 
                                    type="text" 
                                    name="targetRole" 
                                    placeholder="e.g., Full Stack Developer" 
                                    required 
                                    value={formData.targetRole} 
                                    onChange={handleChange} 
                                />
                            </div>
                            <div className="form-group">
                                <label>Current Skills (Comma separated)</label>
                                <input 
                                    type="text" 
                                    name="skills" 
                                    placeholder="e.g., HTML, CSS, JavaScript" 
                                    required 
                                    value={formData.skills} 
                                    onChange={handleChange} 
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Experience Level</label>
                                <select name="experienceLevel" value={formData.experienceLevel} onChange={handleChange}>
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Advanced">Advanced</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Preferred Learning Style</label>
                                <select name="preferredLearningStyle" value={formData.preferredLearningStyle} onChange={handleChange}>
                                    <option value="Video based">Video based</option>
                                    <option value="Text/Documentation">Text/Documentation</option>
                                    <option value="Interactive Coding">Interactive Coding</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Weekly Study Hours</label>
                                <input 
                                    type="number" 
                                    name="studyHours" 
                                    placeholder="e.g., 10" 
                                    min="1"
                                    required 
                                    value={formData.studyHours} 
                                    onChange={handleChange} 
                                />
                            </div>
                            <div className="form-group">
                                <label>Duration (Months)</label>
                                <input 
                                    type="number" 
                                    name="duration" 
                                    placeholder="e.g., 6" 
                                    min="1"
                                    max="24"
                                    required 
                                    value={formData.duration} 
                                    onChange={handleChange} 
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Areas of Interest / Specialization</label>
                            <input 
                                type="text" 
                                name="interests" 
                                placeholder="e.g., AI, Web3, Cloud Computing" 
                                value={formData.interests} 
                                onChange={handleChange} 
                            />
                        </div>

                        <button type="submit" className="btn-primary submit-btn">
                            Generate Roadmap
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default GenerateRoadmapPage;
