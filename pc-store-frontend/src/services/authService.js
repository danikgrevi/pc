// src/services/authService.js
import api from './api';

class AuthService {
  async login(credentials) {
    const response = await api.post('/login', credentials);
    if (response.success && response.data) {
      localStorage.setItem('auth_token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response;
  }

  async register(userData) {
    const response = await api.post('/register', userData);
    if (response.success && response.data) {
      localStorage.setItem('auth_token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response;
  }

  async logout() {
    try {
      await api.post('/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    }
  }

  async getUser() {
    return await api.get('/user');
  }
}

export default new AuthService();