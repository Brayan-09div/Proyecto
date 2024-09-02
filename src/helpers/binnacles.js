import Binnacles from '../models/binnacles.js'

const binnaclesHelper = {

    existBinnacles: async (id) => {
        try {
            const exist = await Binnacles.findById(id);
            if (!exist) {
                throw new Error(`The binnacle with id: ${id} no existe`);
            }
            return exist
        } catch (error) {
            throw new Error(`Error al buscar: ${error.message}`);
        }
    },

    existNumber: async (number) => {
        try {
            const exist = await Binnacles.findOne({ number });
            if (exist) {
                throw new Error(`Ya existe el Number en la base de datos${number}`);
            }
        } catch (error) {
            throw new Error(`Error al verificar Number: ${error.message}`);
        }
    },

    verifyNumber: async (number) => {
        try {
            const exist = await Binnacles.findOne({ number });
            if (!exist) {
                throw new Error(`The number ${number} no esta registrado`);
            }
        } catch (error) {
            throw new Error(`Error al verificar Number: ${error.message}`);
        }
    },

    existDocument: async (document) => {
        try {
            const exist = await Binnacles.findOne({ document });
            if (exist) {
                throw new Error(`Ya existe ese document en la base de datos: ${document}`);
            }
        } catch (error) {
            throw new Error(`Error al verificar document: ${error.message}`);
        }
    },

    verifyDocument: async (document) => {
        try {
            const exist = await Binnacles.findOne({ document });
            if (!exist) {
                throw new Error(`The document ${document} no esta registrado`);
            }
        } catch (error) {
            throw new Error(`Error al verificar document: ${error.message}`);
        }
    },


}

export { binnaclesHelper };