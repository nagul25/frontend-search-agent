import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import styles from './styles/App.module.css';
import { AssessmentBot, LookupBot, SettingsPage } from './components';
import {Settings} from 'lucide-react';
import { ColumnConfigProvider } from './context/ColumnConfigContext';
import SettingsModal from './components/SettingsModal';


const App: React.FC = () => {

  const [isOpen, setIsOpen] = useState(false);

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
              <div
                className={styles.activeLink}
                style={{ textDecoration: 'none', color: 'white' }}
                onClick={() => setIsOpen(true)}
              >
                <Settings size={24}/>
              </div>
            </div>
          </header>
          <Routes>
            <Route path="/" element={<LookupBot />} />
            <Route path="/assessment" element={<AssessmentBot />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<LookupBot />} />
          </Routes>
          <SettingsModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </div>
      </Router>
    </ColumnConfigProvider>
  );
};

export default App;
