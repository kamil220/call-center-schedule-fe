import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { LoginForm } from '@/components/login-form';
import { useLoginForm } from '@/hooks/use-login-form';

// Mock dependencies
jest.mock('@/hooks/use-login-form');

describe('LoginForm', () => {
  // Create mock handlers
  const mockHandleSubmit = jest.fn();
  const mockSetEmail = jest.fn();
  const mockSetPassword = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock implementation of the useLoginForm hook
    (useLoginForm as jest.Mock).mockReturnValue({
      email: '',
      setEmail: mockSetEmail,
      password: '',
      setPassword: mockSetPassword,
      isLoading: false,
      error: null,
      handleSubmit: mockHandleSubmit,
    });
  });
  
  it('renders the login form correctly', () => {
    render(<LoginForm />);
    
    // Check for basic elements
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByText(/sign in/i)).toBeInTheDocument();
  });
  
  it('calls setEmail when email input changes', () => {
    render(<LoginForm />);
    
    // Find input and simulate change
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    // Verify handler was called with correct value
    expect(mockSetEmail).toHaveBeenCalledWith('test@example.com');
  });
  
  it('calls setPassword when password input changes', () => {
    render(<LoginForm />);
    
    // Find input and simulate change
    const passwordInput = screen.getByLabelText(/password/i);
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    // Verify handler was called with correct value
    expect(mockSetPassword).toHaveBeenCalledWith('password123');
  });
  
  it('calls handleSubmit when form is submitted', async () => {
    render(<LoginForm />);
    
    // Find form directly by HTML tag and simulate submit
    const form = document.querySelector('form');
    fireEvent.submit(form || document.body);
    
    // Verify handler was called
    expect(mockHandleSubmit).toHaveBeenCalled();
  });
  
  it('shows error message when there is an error', () => {
    // Mock error state
    (useLoginForm as jest.Mock).mockReturnValue({
      email: '',
      setEmail: mockSetEmail,
      password: '',
      setPassword: mockSetPassword,
      isLoading: false,
      error: 'Invalid credentials',
      handleSubmit: mockHandleSubmit,
    });
    
    render(<LoginForm />);
    
    // Verify error message is displayed
    expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
  });
  
  it('disables form elements while loading', () => {
    // Mock loading state
    (useLoginForm as jest.Mock).mockReturnValue({
      email: '',
      setEmail: mockSetEmail,
      password: '',
      setPassword: mockSetPassword,
      isLoading: true,
      error: null,
      handleSubmit: mockHandleSubmit,
    });
    
    render(<LoginForm />);
    
    // Verify inputs are disabled
    expect(screen.getByLabelText(/email/i)).toBeDisabled();
    expect(screen.getByLabelText(/password/i)).toBeDisabled();
    
    // Find submit button by its type instead of text content (which changes during loading)
    const submitButton = document.querySelector('button[type="submit"]');
    expect(submitButton).toBeDisabled();
  });
}); 