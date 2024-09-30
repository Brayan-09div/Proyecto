// import mongoose from 'mongoose';
// import AuthService from '../servis/AuthService.js';
// import dotenv from 'dotenv';

// dotenv.config(); 

// const BASE_URL = process.env.REPFORA; 
// const ficheHelper = {
//     verifyFiche: async (ficheId) => {
//         if (!mongoose.Types.ObjectId.isValid(ficheId)) {
//             throw new Error(`ID de ficha no válido: ${ficheId}`);
//         }
//         try {
//             console.log('Verificando ficha con ID:', ficheId); 
//             const data = await AuthService.makeAuthenticatedRequest('get', `/api/fiches/${ficheId}`);
//             console.log('Respuesta del AuthService:', data); 
//             if (!data || data._id !== ficheId) {
//                 throw new Error(`La ficha con ID ${ficheId} no existe.`);
//             }
//             return data;
//         } catch (error) {
//             throw new Error(`Error al verificar la ficha: ${error.message}`);
//         }
//     }
// };

// const makeAuthenticatedRequest = async (method, endpoint, data = null) => {
//     const token = await getToken();
//     const url = `${BASE_URL}${endpoint}`; 

//     console.log('Haciendo solicitud a:', url); 

//     const response = await fetch(url, {
//         method: method.toUpperCase(),
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`
//         },
//         body: data ? JSON.stringify(data) : null,
//     });

//     if (!response.ok) {
//         const errorData = await response.json();
//         console.error('Error de la API:', errorData); 
//         throw new Error(errorData.message);
//     }

//     return await response.json();
// };

// export { ficheHelper, makeAuthenticatedRequest }; 


import AuthService from '../servis/AuthService.js';

export const ficheHelper = {
  existsFicheID: async (ficheId) => {
    try {
      const fiche = await AuthService.makeAuthenticatedRequest('get', `/api/fiches/${ficheId}`);
      if (!fiche) {
        throw new Error(`La ficha con ID ${ficheId} no existe en la API externa.`);
      }
      return true;
    } catch (error) {
      throw new Error(`Error al verificar la ficha: ${error.message}`);
    }
  }
};

export default ficheHelper 