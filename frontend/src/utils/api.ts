const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
const API_URL = BASE_URL.endsWith('/api') ? BASE_URL : `${BASE_URL}/api`;

const api = {
  get: async (endpoint: string) => {
    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      return { data };
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  
  post: async (endpoint: string, body: any = {}) => {
    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      return { data };
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  
  delete: async (endpoint: string) => {
    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'DELETE',
        headers: { 'Accept': 'application/json' },
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      return { data };
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
};

export default api;
