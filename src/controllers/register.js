import Register from "../models/register.js";

const controllerRegister = {
    // Listar todos los registros---------------------------------------------------------
    listtheregister: async (req, res) => {
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
    listtheregisterbyid: async (req, res) => {
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
    listtheapprenticebyid: async (req, res) => {
        const { apprentice } = req.body;
        try {
            const registers = await Register.find({ apprentice });
            console.log(`Lista de aprendices en registros: ${apprentice}`);
            res.json(registers);
        } catch (error) {
            console.log(`Error al listar aprendices en registros: ${apprentice}`, error);
            res.status(500).json({ error: 'Error al listar aprendices en registros' });
        }
    },
    // Listar registros por ID de ficha
    listhefichebyid: async (req, res) => {
        const { fiche } = req.params
        try {
            const register = await Register.find({ fiche })
            console.log(`Listar fiche en register ${fiche}`,);
            res.json(register);
        } catch (error) {
            console.log(`Error al listar fiche en register: ${fiche}`, error);
            res.status(500).json({ error: `Èrror al listra ` })

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
        const { apprentice, modality, startDate, fend, company, phonecompany, addresscompany, owner, docalternative, hour } = req.body;
        try {
            const register = new Register({ apprentice, modality, startDate, fend, company, phonecompany, addresscompany, owner, docalternative, hour });
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

    // Activar y Desactivar registro--------------------------------------------------------
    activateAndDesactiveregister: async (req, res) => {
        const { id } = req.params;
        try {
            const register = await Register.findById(id);

            if (!register) {
                return res.status(404).json({ error: 'Registro no encontrado' });
            }

            register.status = register.status === 1 ? 0 : 1;
            await register.save();

            const message = register.status === 1 ? "Registro activo" : "Registro inactivo";
            res.json({ message });
        } catch (error) {
            console.log("Error al desactivar/activar registro", error);
            res.status(500).json({ error: 'Error al desactivar/activar registro' });
        }
    }
};

export default controllerRegister;