const aprendicesHelper = {
    existeAprendizID: async (id) => {
        try {
            const existe = await Aprendices.findById(id);
            if (!existe) {
                throw new Error(`El Aprendiz con ID ${id} no existe`);
            }
            return existe;
        } catch (error) {
            throw new Error(`Error al buscar el aprendiz por ID: ${error.message}`);
        }
    },

    existecc: async (cc, method = "POST") => {
        try {
            const existe = await Aprendices.findOne({ cc });
            if (existe) {
                throw new Error(`Ya existe ese cc en la base de datos: ${cc}`);
            }
        } catch (error) {
            throw new Error(`Error al verificar cc: ${error.message}`);
        }
    },

}

export { aprendicesHelper };