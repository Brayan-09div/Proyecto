import axios from 'axios';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const REP_FORA = process.env.REPFORA;

if (!REP_FORA) {
  console.error("La variable de entorno REPFORA no está definida.");
}

const authController = {

  login: async (req, res) => {
    const { email, password, role } = req.body;
    try {
      const response = await axios.post(`${REP_FORA}/api/users/login`, { email, password, role });
      const token = response.data.token;
      console.log('Token recibido', token);
      res.json({ token });
    } catch (error) {
      res.status(error.response?.status || 500).json({
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
        data: error.response?.data
      });
    }
  },

  listAllInstructors: async (req, res) => {
    const token = req.headers['token'];
    console.log(token);
    try {
      const response = await axios.get(`${REP_FORA}/api/instructors`, { headers: { token } });
      res.json(response.data);
    } catch (error) {
      res.status(error.response?.status || 500).json({
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
        data: error.response?.data
      });
    }
  },

  listInstructorById: async (req, res) => {
    const token = req.headers['token'];
    console.log(token);
    const { id } = req.params;
    try {
      const response = await axios.get(`${REP_FORA}/api/instructors/${id}`, { headers: { token } });
      res.json(response.data);
    } catch (error) {
      res.status(error.response?.status || 500).json({
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
        data: error.response?.data
      });
    }
  },
};

export default authController;
