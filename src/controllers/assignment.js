import Register from '../models/register.js';

const controllerAssignments = {


    // Listar asignaciones por instructor de seguimiento---------------------------------------------------------------
    listassigmentbyfollowupinstructor: async (req, res) => {
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
    listassigmentbytechnicalinstructor: async (req, res) => {
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
    listassigmentbyprojectinstructor: async (req, res) => {
        const { idinstructor } = req.params;
        try {
            const data = await Assignment.find({ instructorproject: idinstructor });
            res.json(data);
        } catch (error) {
            console.error('Error al listar asignaciones por instructor de proyecto', error);
            res.status(500).json({ message: 'Error al listar asignaciones por instructor de proyecto' });
        }
    },

    

}

export default controllerAssignments;











