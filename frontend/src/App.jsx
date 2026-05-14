import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import GenerateRoadmapPage from './pages/GenerateRoadmapPage';
import RoadmapResultPage from './pages/RoadmapResultPage';
import PhaseDetailsPage from './pages/PhaseDetailsPage';
import CommunityPage from './pages/CommunityPage';
import PortfolioBuilderPage from './pages/PortfolioBuilderPage';
import TodoPage from './pages/TodoPage';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/generate" element={<GenerateRoadmapPage />} />
          <Route path="/roadmap/:id" element={<RoadmapResultPage />} />
          <Route path="/roadmap/:id/phase/:phaseIndex" element={<PhaseDetailsPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/portfolio" element={<PortfolioBuilderPage />} />
          <Route path="/todos" element={<TodoPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
