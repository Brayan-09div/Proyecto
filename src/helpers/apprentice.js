import Apprentice from '../models/apprentice.js';

const apprenticeHelper = {
    // Verifica si el ID del aprendiz existe
    existApprentice: async (id) => {
        try {
            const exist = await Apprentice.findById(id);
            if (!exist) {
                throw new Error(`No existe el ID: ${id}`);
            }
            return exist;
        } catch (error) {
            throw new Error(`Error al verificar el ID: ${error.message}`);
        }
    },
  
    // Verifica si el numdocument ya existe en la base de datos, excluyendo el propio registro si está editando
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

    // Verifica si el email ya existe en la base de datos, excluyendo el propio registro si está editando
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

    // Verifica si el numdocument ya existe en la base de datos
    existNumDocument: async (numDocument) => {
        try {
            const existe = await Apprentice.findOne({ numDocument });
            if (existe) {
                throw new Error(`Ya existe el numDocument en la base de datos: ${numDocument}`);
            }
        } catch (error) {
            throw new Error(`Error al verificar numDocument: ${error.message}`);
        }
    },

    // Verifica si el email ya existe en la base de datos
    existEmail: async (email) => {
        try {
            const exist = await Apprentice.findOne({ email });
            if (exist) {
                throw new Error(`Ya existe email en la base de datos: ${email}`);
            }
        } catch (error) {
            throw new Error(`Error al verificar el Email: ${error.message}`);
        }
    },
};

export { apprenticeHelper };
