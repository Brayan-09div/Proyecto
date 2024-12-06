import axios from 'axios';
import jwt from 'jsonwebtoken';
import Apprentice from '../models/apprentice.js';

const REPFORA = process.env.REPFORA;

export const authenticateUser = async (req, res, next) => {
  const { token } = req.headers;

  if (!token) {
    console.warn('Token no proveído en la solicitud.');
    return res.status(401).json({ msg: 'Token no proveído' });
  }

  try {
    console.info('Iniciando validación de usuario con token:', token);

    // Validación como administrador
    try {
      const adminValidation = await axios.post(`${REPFORA}/api/users/token/productive/stages`, null, {
        headers: { token },
      });
      console.info('Respuesta de validación de administrador:', adminValidation.data);

      if (adminValidation.data.token === true) {
        console.log('Usuario validado como administrador.');
        req.userData = adminValidation.data;
        return next();
      }
    } catch (adminError) {
      console.error('Error durante la validación de administrador:', adminError.response?.data || adminError.message);
    }

    // Validación como instructor
    try {
      const instructorValidation = await axios.post(`${REPFORA}/api/instructors/token/productive/stages`, null, {
        headers: { token },
      });
      console.info('Respuesta de validación de instructor:', instructorValidation.data);

      if (instructorValidation.data.token === true) {
        console.log('Usuario validado como instructor.');
        req.userData = instructorValidation.data;
        return next();
      }
    } catch (instructorError) {
      console.error('Error durante la validación de instructor:', instructorError.response?.data || instructorError.message);
    }

    // Validación como aprendiz
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const uid = decoded.uid;
      console.log('Token decodificado, UID:', uid);

      const apprenticeRecord = await Apprentice.findById(uid);
      console.info('Registro encontrado para aprendiz:', apprenticeRecord);

      if (apprenticeRecord && apprenticeRecord.estado !== 0) {
        console.log('Usuario validado como aprendiz.');
        req.apprentice = apprenticeRecord;
        return next();
      }
    } catch (jwtError) {
      console.error('Error al verificar el token JWT o al buscar aprendiz:', jwtError.message);
    }

    console.warn('Ninguna validación fue exitosa. Token no válido o usuario no autorizado.');
    return res.status(401).json({ msg: "Token no válido o usuario no autorizado" });

  } catch (error) {
    console.error('Error general durante la autenticación:', error.message);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};
