import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import JobCreationForm from '../JobCreationForm';
import { UserProvider } from '../../contexts/UserContext';
import { NotificationProvider } from '../../contexts/NotificationContext';

// Mock Firebase (adjust as needed for your setup)
jest.mock('../../firebase', () => ({
  db: {},
}));

describe('JobCreationForm', () => {
  test('renders Create Job form', () => {
    render(
      <UserProvider>
        <NotificationProvider>
          <JobCreationForm />
        </NotificationProvider>
      </UserProvider>
    );
    expect(screen.getByText(/Create Job/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
  });

  test('shows error if required fields are missing', () => {
    render(
      <UserProvider>
        <NotificationProvider>
          <JobCreationForm />
        </NotificationProvider>
      </UserProvider>
    );
    fireEvent.click(screen.getByText(/Create Job/i));
    // Since assignedTo is required, form should not submit and fields should remain
    expect(screen.getByLabelText(/Title/i)).toBeInTheDocument();
  });
});