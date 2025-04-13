import { renderHook, act } from '@testing-library/react';
import { useLoginForm } from '@/hooks/use-login-form';
import { authService } from '@/services/auth.service';
import { useAuth } from '@/context/auth-context';

// Mock dependencies
jest.mock('@/services/auth.service');
jest.mock('@/context/auth-context');

describe('useLoginForm', () => {
  const mockLogin = jest.fn();
  const mockEvent = {
    preventDefault: jest.fn(),
  } as unknown as React.FormEvent<HTMLFormElement>;
  
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock the useAuth hook implementation
    (useAuth as jest.Mock).mockReturnValue({
      login: mockLogin,
    });
  });
  
  it('should initialize with empty state', () => {
    const { result } = renderHook(() => useLoginForm());
    
    expect(result.current.email).toBe('');
    expect(result.current.password).toBe('');
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });
  
  it('should update email and password', () => {
    const { result } = renderHook(() => useLoginForm());
    
    act(() => {
      result.current.setEmail('test@example.com');
    });
    
    expect(result.current.email).toBe('test@example.com');
    
    act(() => {
      result.current.setPassword('password123');
    });
    
    expect(result.current.password).toBe('password123');
  });
  
  it('should handle successful login', async () => {
    // Mock successful login response
    const mockUser = { id: '1', email: 'test@example.com', role: 'ADMIN' };
    (authService.login as jest.Mock).mockResolvedValueOnce({
      success: true,
      user: mockUser,
    });
    
    const { result } = renderHook(() => useLoginForm());
    
    // Set form values
    act(() => {
      result.current.setEmail('test@example.com');
      result.current.setPassword('password123');
    });
    
    // Submit form
    await act(async () => {
      await result.current.handleSubmit(mockEvent);
    });
    
    // Verify API was called with correct credentials
    expect(authService.login).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
    
    // Verify useAuth.login was called with the user
    expect(mockLogin).toHaveBeenCalledWith(mockUser);
    
    // Verify loading state was managed correctly
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });
  
  it('should handle login error', async () => {
    // Mock error response
    const errorMessage = 'Invalid credentials';
    (authService.login as jest.Mock).mockResolvedValueOnce({
      success: false,
      error: errorMessage,
    });
    
    const { result } = renderHook(() => useLoginForm());
    
    // Submit form
    await act(async () => {
      await result.current.handleSubmit(mockEvent);
    });
    
    // Verify error was set
    expect(result.current.error).toBe(errorMessage);
    expect(mockLogin).not.toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);
  });
  
  it('should handle unexpected exceptions', async () => {
    // Mock exception
    (authService.login as jest.Mock).mockRejectedValueOnce(new Error('Network error'));
    
    const { result } = renderHook(() => useLoginForm());
    
    // Submit form
    await act(async () => {
      await result.current.handleSubmit(mockEvent);
    });
    
    // Verify error handling
    expect(result.current.error).toBe('An unexpected error occurred.');
    expect(mockLogin).not.toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);
  });
}); 