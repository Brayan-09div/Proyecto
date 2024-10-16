import mongoose from "mongoose"; // Asegúrate de importar mongoose
import Register from "../models/register.js";

const controllerRegister = {
    // Listar todos los registros
    listallregister: async (req, res) => {
        try {
            const registers = await Register.find();
            console.log('Lista de registros', registers);
            res.json({ success: true, data: registers });
        } catch (error) {
            console.error('Error al listar registros', error);
            res.status(500).json({ success: false, error: 'Error al listar registros' });
        }
    },

    // Listar por id
    listregisterbyid: async (req, res) => {
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

    // Listar registro por Id aprendiz
    listtheapprenticebyid: async (req, res) => {
        const { apprentice } = req.body;
        if (!mongoose.isValidObjectId(apprentice)) {
            return res.status(400).json({ success: false, error: 'ID de aprendiz no válido' });
        }
        try {
            const registers = await Register.find({ apprentice });
            console.log(`Lista de idaprendices en registros: ${apprentice}`);
            res.json({ success: true, data: registers });
        } catch (error) {
            console.log(`Error al listar idaprendices en registros: ${apprentice}`, error);
            res.status(500).json({ error: 'Error al listar idaprendices en registros' });
        }
    },

    // Listar registros por ID de ficha
    listregistersbyfiche: async (req, res) => {
        const { idfiche } = req.params;
        try {
            const registers = await Register.find({ fiche: idfiche });
            console.log(`Listar idfiche en register ${idfiche}`);
            res.json({ success: true, data: registers });
        } catch (error) {
            console.log(`Error al listar idfiche en register: ${idfiche}`, error);
            res.status(500).json({ error: 'Error al listar idfiche en register' });
        }
    },

    // Listar por modalidad
    listregisterbymodality: async (req, res) => {
        const { idmodality } = req.params;
        try {
            const registers = await Register.find({ modality: idmodality });
            console.log(`Lista de modalidades en registros: ${idmodality}`);
            res.json({ success: true, data: registers });
        } catch (error) {
            console.log(`Error al listar modalidades en registros: ${idmodality}`, error);
            res.status(500).json({ error: `Error al listar modalidades en registros ${idmodality}` });
        }
    },

    // Listar los registros por fecha de inicio 
    listregisterbystartdate: async (req, res) => {
        const { startDate } = req.body; // Obtener la fecha del cuerpo de la solicitud
        try {
            const registers = await Register.find({ startDate });
            if (!registers.length) {
                return res.status(404).json({ error: 'No se encontraron registros por fecha de inicio' });
            }
            console.log('Listar por fecha de inicio');
            res.json({ success: true, data: registers });
        } catch (error) {
            console.log('Error al listar por fecha de inicio', error);
            res.status(500).json({ error: 'Error al listar por fecha de inicio' });
        }
    },

    // Listar los registros por fecha de finalización
    listregisterbyenddate: async (req, res) => {
        const { endDate } = req.body; // Obtener la fecha del cuerpo de la solicitud
        try {
            const registers = await Register.find({ endDate });
            if (!registers.length) {
                return res.status(404).json({ error: 'No se encontraron registros por fecha de finalización' });
            }
            console.log('Listar por fecha de finalización');
            res.json({ success: true, data: registers });
        } catch (error) {
            console.log('Error al listar por fecha de finalización', error);
            res.status(500).json({ error: 'Error al listar por fecha de finalización' });
        }
    },

    // Insertar registro
    addregister: async (req, res) => {
        const registerData = req.body; 
        try {
            const register = new Register(registerData); 
            const result = await register.save(); 
            console.log('Registro guardado', result);
            res.json({ success: true, data: result }); 
        } catch (error) {
            console.log('Error al insertar registro', error);
            res.status(500).json({ success: false, error: 'Error al insertar registro' }); // Manejo de errores
        }
    },


    // Actualizar registro
    updateregisterbyid: async (req, res) => {
        const { id } = req.params;
        try {
            const updatedRegister = await Register.findByIdAndUpdate(id, req.body, { new: true });
            if (!updatedRegister) {
                return res.status(404).json({ error: 'Registro no encontrado' });
            }
            console.log("Registro actualizado:", updatedRegister);
            res.json({ success: true, data: updatedRegister });
        } catch (error) {
            console.error("Error actualizando el registro:", error);
            res.status(500).json({ error: "Error actualizando el registro" });
        }
    },

    // Actualizar modalidad
    updatemodalityregister: async (req, res) => {
        const { id } = req.params;
        const { modality } = req.body;
        try {
            const updatedModality = await Register.findByIdAndUpdate(id, { modality }, { new: true });
            if (!updatedModality) {
                return res.status(404).json({ message: 'Registro no encontrado' });
            }
            res.json({ success: true, data: updatedModality });
        } catch (error) {
            console.log('Error al actualizar modalidad', error);
            res.status(500).json({ error: 'Error al actualizar modalidad' });
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
            res.json({ success: true, msg: "Registro activado exitosamente" });
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
            res.json({ success: true, msg: "Registro desactivado exitosamente" });
        } catch (error) {
            console.error("Error al desactivar el estado del registro:", error);
            res.status(500).json({ error: "Error al desactivar el estado del registro" });
        }
    },
};

export default controllerRegister;
