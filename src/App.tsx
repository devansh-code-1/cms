import React from 'react';
import { TemplateProvider } from './contexts/TemplateContext';
import { Dashboard } from './pages/Dashboard';
import './App.css';

function App() {
  return (
    <TemplateProvider>
      <Dashboard />
    </TemplateProvider>
  );
}

export default App;
