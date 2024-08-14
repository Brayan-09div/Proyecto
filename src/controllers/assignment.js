import Assignment from '../models/assignment.js';
import Register from '../models/register.js';

const controllerAssignments = {

    // Listar Assignments----------------------------------------------------------------------------------------------
    listallassignments: async (req, res) => {
        try {
            const assignments = await Assignment.find();
            console.log('Lista de asignaciones', assignments);
            res.json(assignments);
        } catch (error) {
            console.error('Error al listar asignaciones', error);
            res.status(500).json({ message: 'Error al listar asignaciones' });
        }
    },

    // Listar Assignment por id-----------------------------------------------------------------------------------
    listtheAssignmentById: async (req, res) => {
        const { id } = req.params;
        try {
            const assignment = await Assignment.findById(id);
            if (!assignment) {
                return res.status(404).json({ message: 'Asignación no encontrada' });
            }
            console.log('Asignación encontrada', assignment);
            res.json(assignment);
        } catch (error) {
            console.error('Error al listar asignación por id', error);
            res.status(500).json({ message: 'Error al listar asignación por id' });
        }
    },

    // Listar register por id---------------------------------------------------
    listregisterassignment: async (req, res) => {
        const { register } = req.params;
        try {
            const data = await Register.find({ register });
            res.json(data);
        } catch (error) {
            console.error('Error al listar register por id', error);
            res.status(500).json({ message: 'Error al listar register por id' });
        }
    },


    // Listar asignaciones por instructor de seguimiento---------------------------------------------------------------
    listfollowupinstructor: async (req, res) => {
        const { idinstructor } = req.params;
        try {
            const data = await Assignment.find({ instructorfollow: idinstructor });
            res.json(data);
        } catch (error) {
            console.error('Error al listar asignaciones por instructor de seguimiento', error);
            res.status(500).json({ message: 'Error al listar asignaciones por instructor de seguimiento' });
        }
    },

    // Listar asignaciones por instructor técnico------------------------------------------------------------------
    listtechnicalinstructor: async (req, res) => {
        const { idinstructor } = req.params;
        try {
            const data = await Assignment.find({ instructortechnical: idinstructor });
            res.json(data);
        } catch (error) {
            console.error('Error al listar asignaciones por instructor técnico', error);
            res.status(500).json({ message: 'Error al listar asignaciones por instructor técnico' });
        }
    },

    // Listar asignaciones por instructor de proyecto------------------------------------------------------------
    listprojectinstructor: async (req, res) => {
        const { idinstructor } = req.params;
        try {
            const data = await Assignment.find({ instructorproject: idinstructor });
            res.json(data);
        } catch (error) {
            console.error('Error al listar asignaciones por instructor de proyecto', error);
            res.status(500).json({ message: 'Error al listar asignaciones por instructor de proyecto' });
        }
    },

    // Agregar una asignación-------------------------------------------------------------
    addassignment: async (req, res) => {
        const { register, instructorfollow, instructortechnical, instructorproject, certificationdoc, judymentPhoto, observation, status } = req.body;
        try {
            const assignment = new Assignment({ register, instructorfollow, instructortechnical, instructorproject, certificationdoc, judymentPhoto, observation, status });
            const result = await assignment.save();
            console.log('Asignación guardada', result);
            res.status(201).json(result);
        } catch (error) {
            console.error('Error al insertar asignación', error);
            res.status(500).json({ error: 'Error al insertar asignación' });
        }
    },

    // Actualizar una asignación por id --------------------------------------------------
    updateassignmentbyid: async (req, res) => {
        const { id } = req.params;
        try {
            const updatedAssignment = await Assignment.findByIdAndUpdate(id, req.body, { new: true });

            if (!updatedAssignment) {
                return res.status(404).json({ error: 'Asignación no encontrada' });
            }

            console.log('Asignación actualizada:', updatedAssignment);
            res.json(updatedAssignment);
        } catch (error) {
            console.error('Error al actualizar asignación:', error);
            res.status(500).json({ error: 'Error al actualizar asignación' });
        }
    },

    // Activar o desactivar una asignación---------------------------------------------------------------------
    enableassignment: async (req, res) => {
        const { id } = req.params;
        try {
            const assignment = await Assignment.findById(id);

            if (!assignment) {
                return res.status(404).json({ error: 'Asignación no encontrada' });
            }

            assignment.status = assignment.status === 1 ? 0 : 1;
            await assignment.save();

            const message = assignment.status === 1 ? 'Asignación activada' : 'Asignación desactivada';
            res.json({ message });
        } catch (error) {
            console.error('Error al activar/desactivar asignación:', error);
            res.status(500).json({ error: 'Error al activar/desactivar asignación' });
        }
    }
};

export default controllerAssignments;











