import AuthService from '../servis/AuthService.js';

const authController = {
  login: async (req, res) => {
    const { email, password, role } = req.body;
    try {
      const token = await AuthService.login(email, password, role);
      res.json({ token });
    } catch (error) {
      res.status(401).json({
        message: error.message,
        status: 401
      });
    }
  },

  getInstructors: async (req, res) => {
    try {
      const data = await AuthService.makeAuthenticatedRequest('get', '/api/instructors');
      res.json(data);
    } catch (error) {
      res.status(500).json({
        message: error.message,
        status: 500
      });
    }
  },

  getFiches: async (req, res) => {
    try {
      const data = await AuthService.makeAuthenticatedRequest('get', '/api/fiches');
      res.json(data);
    } catch (error) {
      res.status(500).json({
        message: error.message,
        status: 500
      });
    }
  },

  getInstructorById: async (req, res) => {
    const { id } = req.params;
    try {
      const data = await AuthService.makeAuthenticatedRequest('get', `/api/instructors/${id}`);
      res.json(data);
    } catch (error) {
      res.status(500).json({
        message: error.message,
        status: 500
      });
    }
  },

  getFichesById: async (req, res) => {
    const { id } = req.params;
    try {
      const data = await AuthService.makeAuthenticatedRequest('get', `/api/fiches/${id}`);
      res.json(data);
    } catch (error) {
      res.status(500).json({
        message: error.message,
        status: 500
      });
    }
  }
};

export { authController };