const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const api = {
  // Auth
  async login(credentials: any) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return response.json();
  },

  async register(userData: any) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return response.json();
  },

  // Feedback
  async getFeedbacks() {
    const response = await fetch(`${API_BASE_URL}/feedback`);
    return response.json();
  },

  async submitFeedback(feedbackData: any) {
    const response = await fetch(`${API_BASE_URL}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(feedbackData),
    });
    return response.json();
  },

  // Contact
  async submitContact(contactData: any) {
    const response = await fetch(`${API_BASE_URL}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contactData),
    });
    return response.json();
  },
};
