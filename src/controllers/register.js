import Register from "../models/register.js";

const controllerRegister = {
    // Listar todos los registros---------------------------------------------------------
    listtheregister: async (req, res) => {
        try {
            const registers = await Register.find();
            console.log('Lista de registros', registers);
            res.json({ success: true, data: registers });
        } catch (error) {
            console.error('Error al listar registros', error); // Mejor uso de console.error
            res.status(500).json({ success: false, error: 'Error al listar registros' });
        }
    },

    // Listar por id-----------------------------------------------------------------------
    listtheregisterbyid: async (req, res) => {
        const { id } = req.params;
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ success: false, error: 'ID no válido' });
        }
        try {
            const register = await Register.findById(id);

            if (!register) {
                return res.status(404).json({ success: false, error: 'Registro no encontrado' });
            }
            console.log('Registro encontrado', register);
            res.json({ success: true, data: register });
        } catch (error) {
            console.error('Error al listar registro por id', error);
            res.status(500).json({ success: false, error: 'Error al listar registro por id' });
        }
    },


    // Listar registro por Id aprendiz-----------------------------------------------------------------
    listtheapprenticebyid: async (req, res) => {
        const { apprentice } = req.body;
        if (!mongoose.isValidObjectId(apprentice)) {
            return res.status(400).json({ success: false, error: 'ID de aprendiz no válido' });
        }
        try {
            const registers = await Register.find().populate('idApprentice');
            if (registers.length === 0) {
                return res.status(404).json({ success: false, message: 'No se encontraron registros para el aprendiz' });
            }
            console.log(`Lista de aprendices en registros: ${apprentice}`);
            res.json({ success: true, data: registers });
        } catch (error) {
            console.error(`Error al listar aprendices en registros: ${apprentice}`, error);
            res.status(500).json({ success: false, error: 'Error al listar aprendices en registros' });
        }
    },


    // Listar registros por ID de ficha
    listhefichebyid: async (req, res) => {
        const { fiche } = req.params;
        try {
            // Busca registros y realiza la población de la referencia a 'Apprentices'
            const registers = await Register.find({ idModality: fiche }).populate('idModality'); // Asegúrate de que 'idModality' sea el campo correcto que contiene la referencia

            console.log(`Listar fiche en register ${fiche}`);

            // Manejar el caso en que no se encuentran registros
            if (registers.length === 0) {
                return res.status(404).json({ success: false, message: 'No se encontraron registros para la ficha' });
            }

            res.json({ success: true, data: registers });
        } catch (error) {
            console.error(`Error al listar fiche en register: ${fiche}`, error);
            res.status(500).json({ success: false, error: 'Error al listar registros por ficha' });
        }
    },

    // Listar por modalidad---------------------------------------------------------------
    listthemodalitybyid: async (req, res) => {
        const { modality } = req.params;
        try {
            const registers = await Register.find({ modality });
            console.log(`Lista de modalidades en registros: ${modality}`);
            res.json(registers);
        } catch (error) {
            console.log(`Error al listar modalidades en registros: ${modality}`, error);
            res.status(500).json({ error: `Error al listar modalidades en registros ${modality}`, error });
        }
    },

    // Listar los registros por fecha de inicio 
    listregisterstardatebyid: async (req, res) => {
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
    listregisterenddatebyid: async (req, res) => {
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
    insertregister: async (req, res) => {
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
    enableRegiterStatus: async (req, res) => {
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
    disableRegisterStatus: async (req, res) => {
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