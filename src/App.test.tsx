import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders healthcare CMS header title', () => {
  render(<App />);
  const headerElement = screen.getByRole('heading', { name: /Healthcare CMS/i });
  expect(headerElement).toBeInTheDocument();
});

test('renders template management heading', () => {
  render(<App />);
  const titleElement = screen.getByRole('heading', { name: /Template Management/i });
  expect(titleElement).toBeInTheDocument();
});

test('renders create new goal template button', () => {
  render(<App />);
  const buttonElement = screen.getByRole('button', { name: /Create New Goal Template/i });
  expect(buttonElement).toBeInTheDocument();
});

test('renders empty state message for goal templates', () => {
  render(<App />);
  const emptyMessage = screen.getByText(/No goal templates created yet/i);
  expect(emptyMessage).toBeInTheDocument();
});
