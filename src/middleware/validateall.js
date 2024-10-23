import axios from 'axios';
import jwt from 'jsonwebtoken';
import Apprentice from '../models/apprentice.js';

const REPFORA = process.env.REPFORA;

const authenticateUser = async (req, res, next) => {
    const { token } = req.headers;

    // Verifica si el token fue proporcionado
    if (!token) {
        return res.status(401).json({ msg: 'Token no proveído' });
    }

    try {
        // Validación para Administradores
        const adminValidation = await axios.post(`${REPFORA}/api/users/token/productive/stages`, null, {
            headers: { token },
        });

        console.log('Admin Validation Response:', adminValidation.data); // Log de respuesta

        // Si el token es válido para administrador
        if (adminValidation.data.token === true) {
            req.userData = adminValidation.data; // Almacena datos de admin
            return next(); // Llama al siguiente middleware/controlador
        }

        // Validación para Instructores
        const instructorValidation = await axios.post(`${REPFORA}/api/instructors/token/productive/stages`, null, {
            headers: { token },
        });

        console.log('Instructor Validation Response:', instructorValidation.data); // Log de respuesta

        // Si el token es válido para instructor
        if (instructorValidation.data.token === true) {
            req.userData = instructorValidation.data; // Almacena datos de instructor
            return next(); // Llama al siguiente middleware/controlador
        }

        // Validación para Aprendices
        let uid;
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            uid = decoded.uid; // Asegúrate de que 'uid' esté en el token
        } catch (jwtError) {
            console.error('Error al verificar el token JWT:', jwtError);
            return res.status(401).json({ msg: "Token no válido" });
        }

        console.log('UID Decoded:', uid); // Log del UID decodificado

        // Busca el aprendiz por el uid
        const apprenticeRecord = await Apprentice.findById(uid);
        console.log('Apprentice Record:', apprenticeRecord); // Log del registro de aprendiz

        if (apprenticeRecord && apprenticeRecord.estado !== 0) {
            req.apprentice = apprenticeRecord; // Almacena datos de aprendiz
            return next(); // Llama al siguiente middleware/controlador
        }

        // Si el aprendiz no se encuentra o está inactivo
        return res.status(401).json({ msg: "Token no válido - Aprendiz inactivo o no encontrado" });

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

