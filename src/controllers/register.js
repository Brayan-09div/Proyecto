import Register from "../models/register.js";

const controllerRegister = {
    // Listar todos los registros---------------------------------------------------------
    listallregister: async (req, res) => {
        try {
            const registers = await Register.find();
            console.log('Lista de registros', registers);
            res.json(registers);
        } catch (error) {
            console.log('Error al listar registros', error);
            res.status(500).json({ error: 'Error al listar registros' });
        }
    },

    // Listar por id-----------------------------------------------------------------------
    listregisterbyid: async (req, res) => {
        const { id } = req.params;
        try {
            const register = await Register.findById(id);

            if (!register) {
                return res.status(404).json({ error: 'Registro no encontrado' });
            }
            console.log('Registro encontrado', register);
            res.json(register);
        } catch (error) {
            console.log('Error al listar registro por id', error);
            res.status(500).json({ error: 'Error al listar registro por id' });
        }
    },

    // Listar registro por Id aprendiz-----------------------------------------------------------------
    listregisterbyapprentice: async (req, res) => {
        const { idapprentice } = req.body;
        try {
            const registers = await Register.find({apprentice: idapprentice });
            console.log(`Lista de idaprendices en registros: ${idapprentice}`);
            res.json(registers);
        } catch (error) {
            console.log(`Error al listar idaprendices en registros: ${idapprentice}`, error);
            res.status(500).json({ error: 'Error al listar idaprendices en registros' });
        }
    },
    // Listar registros por ID de ficha
    listregistersbyfiche: async (req, res) => {
        const { idfiche } = req.params
        try {
            const register = await Register.find({fiche: idfiche })
            console.log(`Listar idfiche en register ${idfiche}`,);
            res.json(register);
        } catch (error) {
            console.log(`Error al listar idfiche en register: ${idfiche}`, error);
            res.status(500).json({ error: `Èrror al listra ` })

        }

    },
    // Listar por modalidad---------------------------------------------------------------
    listregisterbymodality: async (req, res) => {
        const { idmodality } = req.params;
        try {
            const registers = await Register.find({modality: idmodality });
            console.log(`Lista de modalidades en registros: ${idmodality}`);
            res.json(registers);
        } catch (error) {
            console.log(`Error al listar modalidades en registros: ${idmodality}`, error);
            res.status(500).json({ error: `Error al listar modalidades en registros ${idmodality}`, error });
        }
    },

    // Listar los registros por fecha de inicio 
    listregisterbystartdate: async (req, res) => {
        try {
            const register = await Register.find({ startDate })
            if (!register) {
                return res.status(404).json({ error: 'Registro no encontrar' })
            }
            console.log('Listar por fecha de inicio');
            res.json(register)
        } catch (error) {
            console.log('Error al listar por fecha de inicio', error);
            res.status(500).json({ error: 'Error al listar por fecha de inicio' })
        }
    },

    // Listar los registros por fecha de finalización
    listregisterbyenddate: async (req, res) => {
        try {
            const register = await Register.find({ endDate })
            if (!register) {
                return res.status(404).json({ error: 'Registro no encontrar' })
            }
            console.log('Listar por fecha de finalización');
            res.json(register)
        } catch (error) {
            console.log('Error al listar por fecha de finalizción', error);
            res.status(500).json({ error: 'Error al listar por fecha de finalización' })
        }
    },
    // Insertar registro-----------------------------------------------------------------
    addregister: async (req, res) => {
        const { apprentice, modality, startDate, fend, company, phonecompany, addresscompany, emailcompany, owner, docalternative, hour } = req.body;
        try {
            const register = new Register({ apprentice, modality, startDate, fend, company, phonecompany, addresscompany, emailcompany, owner, docalternative, hour });
            const result = await register.save();
            console.log('Registro guardado', result);
            res.json(result);
        } catch (error) {
            console.log('Error al insertar registro', error);
            res.status(500).json({ error: 'Error al insertar registro' });
        }
    },

    // Actualizar registro---------------------------------------------------------------
    updateregisterbyid: async (req, res) => {
        const { id } = req.params;
        try {
            const updatedRegister = await Followup.findByIdAndUpdate(id, req.body, { new: true });

            if (!updatedRegister) {
                return res.status(404).json({ error: 'Register not found' });
            }

            console.log("Register updated:", updatedRegister);
            res.json(updatedRegister);
        } catch (error) {
            console.error("Error updating Register:", error);
            res.status(500).json({ error: "Error updating Register" });
        }
    },
    // // Actualizar modalidad
    updatemodalityregister: async (req, res) => {
        const { id } = req.params
        const { modality } = req.body
        try {
            const updatemodality = await Register.findByIdAndUpdate(id, { modality }, { new: true })
            if (!updatemodality) {
                return res.status(404).json({ message: 'Registro no encontrado' })
            }
            res.json(updatemodality)
        } catch (error) {
            console.log('Error al actualizar modality', error);
            res.status(500).json({ error: 'Error al actualizar modality' })
        }
    },



    // Activar registro
    enableregister: async (req, res) => {
        const { id } = req.params;
        try {
            const register = await Register.findByIdAndUpdate(id, { status: 1 }, { new: true });
            if (!register) {
                return res.status(404).json({ error: "Registro no encontrado" });
            }
            res.json({ msg: "Registro activado exitosamente" });
        } catch (error) {
            console.error("Error al activar el estado del registro:", error);
            res.status(500).json({ error: "Error al activar el estado del registro" });
        }
    },

    // Desactivar registro
    disableregister: async (req, res) => {
        const { id } = req.params;
        try {
            const register = await Register.findByIdAndUpdate(id, { status: 0 }, { new: true });
            if (!register) {
                return res.status(404).json({ error: "Registro no encontrado" });
            }
            res.json({ msg: "Registro desactivado exitosamente" });
        } catch (error) {
            console.error("Error al desactivar el estado del registro:", error);
            res.status(500).json({ error: "Error al desactivar el estado del registro" });
        }
    },
};

export default controllerRegister;