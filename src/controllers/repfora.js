// authController.js
import axios from 'axios';

const apiURL = process.env.REPFORA;

const authController = {

    login: async (req, res) => {
        const { email, password, role } = req.body;
        try {
            const response = await axios.post(`${apiURL}/api/users/login`, {
                email,
                password,
                role,
            });
            const token = response.data.token; 
            console.log('Token recibido:', token); 
            res.json({ token });
        } catch (error) {
            res.status(401).json({
                message: error.response?.data?.message || error.message,
                status: error.response?.status,
                data: error.response?.data
            });
        }
    },

    getInstructors: async (req, res) => {
        const token = req.headers['token']; 
        console.log('Token en getInstructors:', token); 
        try {
            const response = await axios.get(`${apiURL}/api/instructors`, {
                headers: {
                    token: token 
                }
            });
            res.json(response.data);
        } catch (error) {
            res.status(error.response?.status || 500).json({
                message: error.response?.data?.message || error.message,
                status: error.response?.status,
                data: error.response?.data
            });
        }
    },

    getFiches: async (req, res) => {
        const token = req.headers['token']; 
        console.log('Token en getFiches:', token); 
        try {
            const response = await axios.get(`${apiURL}/api/fiches`, {
                headers: {
                    token: token 
                }
            });
            res.json(response.data);
        } catch (error) {
            res.status(error.response?.status || 500).json({
                message: error.response?.data?.message || error.message,
                status: error.response?.status,
                data: error.response?.data
            });
        }
    },

    getInstructorById: async (req, res) => {
        const { id } = req.params; 
        const token = req.headers['token']; 
        console.log('Token en getInstructorById:', token); 

        if (!token) {
            return res.status(400).json({ message: 'No se ha enviado el token' });
        }
        try {
            const response = await axios.get(`${apiURL}/api/instructors/${id}`, {
                headers: {
                    token: token 
                }
            });
            res.json(response.data); 
        } catch (error) {
            console.error('Error en la llamada a la API de instructor por ID:', error);
            res.status(error.response?.status || 500).json({
                message: error.response?.data?.message || error.message,
                status: error.response?.status,
                data: error.response?.data
            });
        }
    },
    getFichesById: async (req, res) => {
        const { id } =req.params;
        const token = req.headers['token'];
        console.log('Token en getFicheById:', token);

        if (!token) {
            return res.status(404).json({ message: 'No se ha enviado token'});
        } try {
            const response = await axios.get(`${apiURL}/api/fiches/${id}`, {
                headers: {
                    token: token
                }
            });
            res.json(response.data);
        } catch (error) {
            console.error('Error en la llamada a la API de Ficha por ID.', error);
            res.status(error.response?.status || 500).json({
                message: error.response?.data?.message || error.message,
                status: error.response?.status,
                data: error.response?.data
            });
        }
    }

}



export { authController };
