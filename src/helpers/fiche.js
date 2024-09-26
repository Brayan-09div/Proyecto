import axios from 'axios';
import mongoose from 'mongoose';

const apiURL = process.env.REPFORA;

const ficheHelper = {
    verifyFiche: async (ficheId) => {
        if (!mongoose.Types.ObjectId.isValid(ficheId)) {
            throw new Error(`ID de ficha no válido: ${ficheId}`);
        }
        try {
            const response = await axios.get(`${apiURL}/api/fiches/${ficheId}`, {
                headers: {
                    token: `Bearer ${process.env.API_TOKEN}`
                }
            });
            if (!response.data || response.data._id !== ficheId) {
                throw new Error(`La ficha con ID ${ficheId} no existe.`);
            }
            return response.data;
        } catch (error) {
            throw new Error(`Error al verificar la ficha: ${error.response?.data?.message || error.message}`);
        }
    }
};

export { ficheHelper };
