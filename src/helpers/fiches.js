import mongoose from 'mongoose';
import AuthService from '../servis/AuthService.js';
import dotenv from 'dotenv';

dotenv.config(); // Cargar variables de entorno

const BASE_URL = process.env.REPFORA; // Obtener la URL base de las variables de entorno

const ficheHelper = {
    verifyFiche: async (ficheId) => {
        if (!mongoose.Types.ObjectId.isValid(ficheId)) {
            throw new Error(`ID de ficha no válido: ${ficheId}`);
        }
        try {
            console.log('Verificando ficha con ID:', ficheId); // Log para depuración
            const data = await AuthService.makeAuthenticatedRequest('get', `/api/fiches/${ficheId}`);
            console.log('Respuesta del AuthService:', data); // Log de la respuesta
            if (!data || data._id !== ficheId) {
                throw new Error(`La ficha con ID ${ficheId} no existe.`);
            }
            return data;
        } catch (error) {
            throw new Error(`Error al verificar la ficha: ${error.message}`);
        }
    }
};

// Asegúrate de que tu AuthService esté configurado para usar BASE_URL
const makeAuthenticatedRequest = async (method, endpoint, data = null) => {
    const token = await getToken();
    const url = `${BASE_URL}${endpoint}`; // Concatenando la URL base con el endpoint

    console.log('Haciendo solicitud a:', url); // Log para depuración

    const response = await fetch(url, {
        method: method.toUpperCase(),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: data ? JSON.stringify(data) : null,
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error('Error de la API:', errorData); 
        throw new Error(errorData.message);
    }

    return await response.json();
};

export { ficheHelper, makeAuthenticatedRequest }; 
