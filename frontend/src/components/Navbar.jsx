import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiMenu, FiX } from 'react-icons/fi';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
        setMenuOpen(false);
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="container nav-container">
                <Link to={user ? "/dashboard" : "/"} className="nav-logo" onClick={() => setMenuOpen(false)}>
                    <span className="text-gradient">CareerPilot</span> <span>AI</span>
                </Link>
                
                <div className={`nav-menu ${menuOpen ? 'active' : ''}`}>
                    {user ? (
                        <>
                            <Link to="/dashboard" className="nav-link" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                            <Link to="/generate" className="nav-link" onClick={() => setMenuOpen(false)}>Generate Roadmap</Link>
                            <Link to="/community" className="nav-link" onClick={() => setMenuOpen(false)}>Community</Link>
                            <Link to="/portfolio" className="nav-link" onClick={() => setMenuOpen(false)}>Portfolio</Link>
                            <Link to="/todos" className="nav-link" onClick={() => setMenuOpen(false)}>Tasks</Link>
                            <button onClick={handleLogout} className="btn-secondary">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-link" onClick={() => setMenuOpen(false)}>Login</Link>
                            <Link to="/register" className="btn-primary" onClick={() => setMenuOpen(false)}>Register</Link>
                        </>
                    )}
                </div>

                <div className="nav-actions">
                    <button className="mobile-toggle" onClick={toggleMenu}>
                        {menuOpen ? <FiX /> : <FiMenu />}
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
