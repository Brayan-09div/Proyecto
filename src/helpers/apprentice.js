import Apprentice from "../models/apprentice.js";

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

  // Verifica si el numdocument ya existe, excluyendo el propio registro si está editando
  esNumDocumentoValido: async (numdocument, id = null) => {
    try {
      const documento = await Apprentice.findOne({ numdocument });
      if (documento && (!id || documento._id.toString() !== id.toString())) {
        throw new Error(`El documento ${numdocument} ya existe`);
      }
    } catch (error) {
      throw new Error(`Error al verificar numdocument: ${error.message}`);
    }
  },

  // Verifica si el email ya existe, excluyendo el propio registro si está editando
  esEmailValido: async (email, id = null) => {
    try {
      const correo = await Apprentice.findOne({ email });
      if (correo && (!id || correo._id.toString() !== id.toString())) {
        throw new Error(`El email ${email} ya existe`);
      }
    } catch (error) {
      throw new Error(`Error al verificar email: ${error.message}`);
    }
  },

// Verifica si el numdocument NO existe
  notExistNumDocument: async (numDocument) => {
    try {
        const documento = await Apprentice.findOne({ numDocument });
        if (!documento) {
            throw new Error(`No existe un aprendiz con el número de documento: ${numDocument}`);
        }
        return true; // El documento sí existe
    } catch (error) {
        throw new Error(`Error al verificar número de documento: ${error.message}`);
    }
 },

  // Verifica si el email NO existe
  notExistEmail: async (email) => {
    try {
      const correo = await Apprentice.findOne({ email });
      if (!correo) {
        throw new Error(`No existe un aprendiz con el email: ${email}`);
      }
      return false;  
    } catch (error) {
      throw new Error(`Error al verificar el email: ${error.message}`);
    }
  },
};

export { apprenticeHelper };

