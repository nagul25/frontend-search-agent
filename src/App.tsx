import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import styles from './styles/App.module.css';
import {AssessmentBot, LookupBot} from './components';

const App: React.FC = () => {
  return (
    <Router>
      <div className={styles.app}>
        <header className={styles.header}>
            <h1 className={styles.headerTitle}>ARB Assistant Platform</h1>
            <div className={styles.actionBtns}>
              <NavLink to="/"
              className={({ isActive }) => isActive ? styles.activeLink : ''}
               style={{ textDecoration: 'none', color: 'white', marginRight: '12px' }}>
                Lookup Bot
              </NavLink>
              {/* <NavLink to="/assessment"
              className={({isActive}) => isActive ? styles.activeLink : ''}
              style={{ textDecoration: 'none', color: 'white' }}>
                Assessment Bot
              </NavLink> */}
            </div>
        </header>
        <Routes>
          <Route path="/" element={<LookupBot />} />
          <Route path="/assessment" element={<AssessmentBot />} />
          <Route path="*" element={<LookupBot />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
