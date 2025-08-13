import React from 'react';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="layout">
      <header className="layout__header">
        <div className="layout__header-content">
          <h1 className="layout__title">Healthcare CMS</h1>
          <p className="layout__subtitle">HL7 FHIR Template Management System</p>
        </div>
      </header>
      
      <main className="layout__main">
        <div className="layout__container">
          {children}
        </div>
      </main>
      
      <footer className="layout__footer">
        <div className="layout__container">
          <p>&copy; 2024 Healthcare CMS. Built with React.js and HL7 FHIR standards.</p>
        </div>
      </footer>
    </div>
  );
};