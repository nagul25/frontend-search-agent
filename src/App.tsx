import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import styles from './styles/App.module.css';
import { AssessmentBot, LookupBot, SettingsPage } from './components';
import {Settings} from 'lucide-react';
import { ColumnConfigProvider } from './context/ColumnConfigContext';


const App: React.FC = () => {
  return (
    <ColumnConfigProvider>
      <Router>
        <div className={styles.app}>
          <header className={styles.header}>
            <h1 className={styles.headerTitle}>ARB Assistant Platform</h1>
            <div className={styles.actionBtns}>
              <NavLink to="/"
                className={({ isActive }) => isActive ? styles.activeLink : ''}
                style={{ textDecoration: 'none', color: 'white', marginRight: '12px' }}>
                Lookup Agent
              </NavLink>
              <NavLink to="/assessment"
                className={({ isActive }) => isActive ? styles.activeLink : ''}
                style={{ textDecoration: 'none', color: 'white' }}>
                Assessment Agent
              </NavLink>
              <NavLink to="/settings"
                className={({ isActive }) => isActive ? styles.activeLink : ''}
                style={{ textDecoration: 'none', color: 'white' }}>
                <Settings size={24} />
              </NavLink>
            </div>
          </header>
          <Routes>
            <Route path="/" element={<LookupBot />} />
            <Route path="/assessment" element={<AssessmentBot />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<LookupBot />} />
          </Routes>
        </div>
      </Router>
    </ColumnConfigProvider>
  );
};

export default App;
