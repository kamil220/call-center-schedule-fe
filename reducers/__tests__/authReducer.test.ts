import { authReducer, initialState } from '@/reducers/authReducer';
import { UserRole } from '@/types/user';

describe('authReducer', () => {
  it('should return the initial state', () => {
    expect(authReducer(undefined, { type: 'unknown' } as any)).toEqual(initialState);
  });

  it('should handle INITIALIZE with user', () => {
    const user = { id: '1', email: 'test@example.com', role: UserRole.ADMIN };
    const action = { type: 'INITIALIZE', payload: { user } };
    
    expect(authReducer(initialState, action)).toEqual({
      ...initialState,
      user,
      isAuthenticated: true,
      isLoading: false,
    });
  });

  it('should handle INITIALIZE without user', () => {
    const action = { type: 'INITIALIZE', payload: { user: null } };
    
    expect(authReducer(initialState, action)).toEqual({
      ...initialState,
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  });

  it('should handle LOGIN', () => {
    const user = { id: '1', email: 'test@example.com', role: UserRole.AGENT };
    const action = { type: 'LOGIN', payload: user };
    
    expect(authReducer(initialState, action)).toEqual({
      ...initialState,
      user,
      isAuthenticated: true,
    });
  });

  it('should handle LOGOUT', () => {
    // Start from authenticated state
    const state = {
      ...initialState,
      user: { id: '1', email: 'test@example.com', role: UserRole.AGENT },
      isAuthenticated: true,
    };
    
    const action = { type: 'LOGOUT' };
    
    expect(authReducer(state, action)).toEqual({
      ...state,
      user: null,
      isAuthenticated: false,
    });
  });

  it('should handle SET_LOADING', () => {
    const action = { type: 'SET_LOADING', payload: true };
    
    expect(authReducer(initialState, action)).toEqual({
      ...initialState,
      isLoading: true,
    });
  });
}); 