import Fiches from '../models/fiches.js';

const fichesHelper = {
    existsFicheID: async (id) => {
        try {
            const exists = await Fiches.findById(id);
            if (!exists) {
                throw new Error(`The fiche with ID ${id} does not exist`);
            }
            return exists;
        } catch (error) {
            throw new Error(`Error searching for fiche by ID: ${error.message}`);
        }
    },

 
    doesFicheExist: async (id) => {
        try {
            const count = await Fiches.countDocuments({ _id: id });
            return count > 0; 
        } catch (error) {
            throw new Error(`Error checking fiche existence: ${error.message}`);
        }
    }
};

export { fichesHelper };
