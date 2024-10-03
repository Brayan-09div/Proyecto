import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const ficheHelper = {
  async existsFicheID(idFiche, token) {
    if (!token) {
      throw new Error("Token es obligatorio");
    }

    if (!idFiche) {
      throw new Error("ID de ficha es obligatorio");
    }

    if (!process.env.REPFORA) {
      throw new Error("La URL de REPFORA no está definida en el archivo de entorno");
    }

    try {
      const response = await axios.get(`${process.env.REPFORA}/api/fiches/${idFiche}`, { 
        headers: { token } 
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Error en la petición: ' + error.message);
      }
      throw new Error('Error desconocido: ' + error.message);
    }
  }
}

export default ficheHelper;
