import { authService } from '@/services/auth.service';
import { UserRole } from '@/types/user';

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should return admin user for correct admin credentials', async () => {
      const credentials = { email: 'admin@email.com', password: 'admin' };
      const result = await authService.login(credentials);
      
      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.user?.email).toBe('admin@email.com');
      expect(result.user?.role).toBe(UserRole.ADMIN);
      expect(result.token).toBeTruthy();
    });

    it('should return agent user for password "password"', async () => {
      const credentials = { email: 'agent1@example.com', password: 'password' };
      const result = await authService.login(credentials);
      
      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.user?.email).toBe('agent1@example.com');
      expect(result.user?.role).toBe(UserRole.AGENT);
    });

    it('should return error for invalid credentials', async () => {
      const credentials = { email: 'user@example.com', password: 'wrong' };
      const result = await authService.login(credentials);
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid email or password');
      expect(result.user).toBeUndefined();
    });
  });

  describe('logout', () => {
    it('should resolve successfully', async () => {
      // Just verify it doesn't throw an error for now
      await expect(authService.logout()).resolves.toBeUndefined();
    });
  });

  describe('getSession', () => {
    it('should return null user in mock implementation', async () => {
      const result = await authService.getSession();
      expect(result.user).toBeNull();
    });
  });
}); 