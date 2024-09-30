import axios from 'axios';

const apiURL = process.env.REPFORA;

class AuthService {
  constructor() {
    this.token = null;
  }

  setToken(token) {
    this.token = token;
  }

  getToken() {
    return this.token;
  }

  async login(email, password, role) {
    try {
      const response = await axios.post(`${apiURL}/api/users/login`, {
        email,
        password,
        role,
      });
      this.setToken(response.data.token);
      return response.data.token;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  }

  async makeAuthenticatedRequest(method, url, data = null) {
    if (!this.token) {
      throw new Error('No hay token de autenticación');
    }
    try {
      const config = {
        method,
        url: `${apiURL}${url}`,
        headers: { token: this.token },
        data
      };
      const response = await axios(config);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  }
}

export default new AuthService();