import Apprentice from '../models/apprentice.js'

const apprenticeHelper = {
  
    existApprentice: async (id) => {
        try {
            const exist = await Apprentice.findById(id)
            if (!exist) {
                throw new Error(`No existe el ID: ${id}`)
            }
            return exist
        } catch (error) {
            throw new Error(`Error al verificar el ID: ${error.message}`)
        }
    },

    existNumDocument: async (numdocument) => {
        try {
            const existe = await Apprentice.findOne({ numdocument });
            if (existe) {
                throw new Error(`Ya existe el numdocument en la base de datos: ${numdocument}`);
            }
        } catch (error) {
            throw new Error(`Error al verificar numdocument: ${error.message}`);
        }
    },

    verifyNumDocument: async (numdocument) => {
        try {
            const exist = await Apprentice.findOne({ numdocument })
            if (!exist) {
                throw new Error(`El numdocument ${numdocument} no está registrado`)
            }
            return exist
        } catch (error) {
            throw new Error(`Error al verificar numdocument: ${error.message}`)
        }
    },

    esNumDocumentoValido: async (numdocument, id) => {
        try {
            const documento = await Apprentice.findOne({ numdocument });
            if (documento && documento._id.toString() !== id.toString()) {
                throw new Error(`El documento ${numdocument} ya existe`);
            }
        } catch (error) {
            throw new Error(`Error al verificar numdocument: ${error.message}`);
        }
    },

   
    esEmailValido: async (email, id) => {
        try {
            const correo = await Apprentice.findOne({ email });
            if (correo && correo._id.toString() !== id.toString()) {
                throw new Error(`El email ${email} ya existe`);
            }
        } catch (error) {
            throw new Error(`Error al verificar email: ${error.message}`);
        }
    },

    existEmail: async (email) => {
        try {
            const exist = await Apprentice.findOne({ email })
            if (exist) {
                throw new Error(`Ya existe email en la base de datos: ${email}`)
            }
        } catch (error) {
            throw new Error(`Error al verificar el Email: ${error.message}`)
        }
    },

    verifyEmail: async (email) => {
        try {
            const exist = await Apprentice.findOne({ email })
            if (!exist) {
                throw new Error(`El Email ${email} no está registrado`)
            }
            return exist
        } catch (error) {
            throw new Error(`Error al verificar Email: ${error.message}`)
        }
    },
};


export { apprenticeHelper };