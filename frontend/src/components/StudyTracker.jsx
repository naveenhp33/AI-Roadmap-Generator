import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FiTrendingUp, FiAward, FiCalendar } from 'react-icons/fi';
import './StudyTracker.css';

const StudyTracker = () => {
    const { user } = useContext(AuthContext);
    const [history, setHistory] = useState([]);
    const [streak, setStreak] = useState(0);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get('/api/study/history', config);
                setHistory(data);
                calculateStreak(data);
            } catch (error) {
                console.error('Error fetching history', error);
            }
        };
        fetchHistory();
    }, [user]);

    const calculateStreak = (data) => {
        if (!data.length) return;
        let currentStreak = 0;
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        
        const dates = data.map(log => log.date);
        
        // Check if studied today or yesterday to continue streak
        if (dates.includes(today) || dates.includes(yesterday)) {
            let checkDate = dates.includes(today) ? today : yesterday;
            while (dates.includes(checkDate)) {
                currentStreak++;
                const prevDate = new Date(new Date(checkDate).getTime() - 86400000).toISOString().split('T')[0];
                checkDate = prevDate;
            }
        }
        setStreak(currentStreak);
    };

    const renderCalendar = () => {
        const last30Days = [];
        for (let i = 29; i >= 0; i--) {
            const date = new Date(Date.now() - i * 86400000).toISOString().split('T')[0];
            last30Days.push(date);
        }

        return (
            <div className="activity-grid">
                {last30Days.map(date => {
                    const log = history.find(h => h.date === date);
                    const level = log ? Math.min(Math.ceil(log.completedTasks.length / 2), 4) : 0;
                    return (
                        <div 
                            key={date} 
                            className={`activity-cell level-${level}`}
                            title={`${date}: ${log ? log.completedTasks.length : 0} tasks completed`}
                        />
                    );
                })}
            </div>
        );
    };

    return (
        <div className="study-tracker glass">
            <div className="tracker-header">
                <h3><FiCalendar /> Activity Heatmap</h3>
                <div className="streak-badge">
                    <FiAward /> {streak} Day Streak
                </div>
            </div>
            
            {renderCalendar()}
            
            <div className="tracker-footer">
                <span>Less</span>
                <div className="legend">
                    <div className="activity-cell level-0"></div>
                    <div className="activity-cell level-1"></div>
                    <div className="activity-cell level-2"></div>
                    <div className="activity-cell level-3"></div>
                    <div className="activity-cell level-4"></div>
                </div>
                <span>More</span>
            </div>
        </div>
    );
};

export default StudyTracker;
