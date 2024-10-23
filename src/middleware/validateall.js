import axios from 'axios';
import jwt from 'jsonwebtoken'; 
import Apprentice from '../models/apprentice.js'; 

const REPFORA = process.env.REPFORA;

const authenticateUser = async (req, res, next) => {
    const { token } = req.headers;

    if (!token) {
        return res.status(401).json({ msg: 'Token no proveído' });
    }

    try {
        // Validación para Admins
        const adminValidation = await axios.post(`${REPFORA}/api/users/token/productive/stages`, null, {
            headers: { token },
        });

        if (adminValidation.data.token === true) {
            req.userData = adminValidation.data;
            return next();
        }
 
        // Validación para Instructores
        const instructorValidation = await axios.post(`${REPFORA}/api/instructors/token/productive/stages`, null, {
            headers: { token },
        });

        if (instructorValidation.data.token === true) {
            req.userData = instructorValidation.data;
            return next();
        }

        // Validación para Aprendices
        const { uid } = jwt.verify(token, process.env.JWT_SECRET);
        const apprenticeRecord = await Apprentice.findById(uid);

        if (apprenticeRecord && apprenticeRecord.estado !== 0) {
            req.apprentice = apprenticeRecord; // Almacena datos de aprendiz
            return next();
        }

        // Si ningún token es válido
        return res.status(401).json({ msg: "Token no válido" });
        
    } catch (error) {
        // Manejo de errores mejorado
        console.error('Error en autenticación:', error);
        
        // Respuesta estándar de error
        const statusCode = error.response?.status || 500;
        const errorMessage = error.response?.data?.message || 'Error de autenticación';
        
        return res.status(statusCode).json({ message: errorMessage });
    } 
};

export { authenticateUser };

