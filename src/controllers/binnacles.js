import Binnacles from '../models/binnacles.js';
import Register from '../models/register.js';

const controllerBinnacles = {

    // Listar bitácoras-------------------------------------------------------------------
    listallbinnacles: async (req, res) => {
        try {
            const binnacles = await Binnacles.find();
            console.log('Lista de bitácoras', binnacles);
            res.json(binnacles);
        } catch (error) {
            console.error('Error al listar bitácoras', error);
            res.status(500).json({ message: 'Error al listar bitácoras' });
        }
    },

    // Listar bitácoras por id-------------------------------------------------------
    listbinnaclesbyid: async (req, res) => {
        const { id } = req.params;
        try {
            const binnacle = await Binnacles.findById(id);
            if (!binnacle) {
                return res.status(404).json({ message: 'Bitácora no encontrada' });
            }
            console.log('Bitácora encontrada', binnacle);
            res.json(binnacle);
        } catch (error) {
            console.error('Error al listar bitácora por id', error);
            res.status(500).json({ message: 'Error al listar bitácora por id' });
        }
    },

    // Listar asignaciones en bitácoras------------------------------------------------------------------------------
    listbinnaclesbyassignment: async (req, res) => {
        const { idassignment } = req.params;
        try {
            const binnacles = await Binnacles.find({ assignment: idassignment });
            console.log(`Lista de asignaciones en bitácoras ${idassignment}:`, binnacles);
            res.json(binnacles);
        } catch (error) {
            console.error(`Error al listar asignaciones en bitácoras ${idassignment}:`, error);
            res.status(500).json({ error: `Error al listar asignaciones de bitácoras ${idassignment}` });
        }
    },

    // Listar instructores en bitácoras--------------------------------------------------------------
    listbinnaclesbyinstructor: async (req, res) => {
        const { idinstructor } = req.params;
        try {
            const binnacles = await Binnacles.find({ instructor: idinstructor });
            console.log(`Lista de instructores en bitácoras ${idinstructor}:`, binnacles);
            res.json(binnacles);
        } catch (error) {
            console.error(`Error al listar instructores en bitácoras ${idinstructor}:`, error);
            res.status(500).json({ error: `Error al listar instructores de bitácoras ${instructor}` });
        }
    },

    // Insertar bitácoras (solo para generar la bitácora sin observaciones)
    addbinnacles: async (req, res) => {
        const { assignment, instructor, number, document } = req.body;
        const existingBinnacle = await Binnacles.findOne({ number });
        if (existingBinnacle) {
            return res.status(400).json({ error: 'El número de bitácora ya existe' });
        }
        try {
            const binnacle = new Binnacles({
                assignment,
                instructor,
                number,
                document,
                status: 'programado', 
            });

            const result = await binnacle.save();
            const updatedBinnacle = await Binnacles.findByIdAndUpdate(result._id, { status: 'ejecutado' }, { new: true });

            console.log('Bitácora guardada y actualizada a ejecutado', updatedBinnacle);
            if (result.register) {  
                const register = await Register.findById(result.register);
                if (register) {
                    register.pendingHours -= 1;  
                    await register.save();
                    console.log('Horas pendientes del registro actualizadas');
                } else {
                    console.error('No se encontró el registro asociado');
                }
            }
            res.status(201).json(updatedBinnacle);
        } catch (error) {
            console.error('Error al insertar bitácora', error);
            res.status(500).json({ error: 'Error al insertar bitácora' });
        }
    },

    // Actualizar bitácora---------------------------------------------------------
    updatebinnaclebyid: async (req, res) => {
        const { id } = req.params;
        try {
            const updatedBinnacle = await Binnacles.findByIdAndUpdate(id, req.body, { new: true });

            if (!updatedBinnacle) {
                return res.status(404).json({ error: 'Bitácora no encontrada' });
            }

            console.log('Bitácora actualizada:', updatedBinnacle);
            res.json(updatedBinnacle);
        } catch (error) {
            console.error('Error al actualizar bitácora:', error);
            res.status(500).json({ error: 'Error al actualizar bitácora' });
        }
    },

    // Actuactulizar un El estado del 1,2,3,4
    updatestatus: async (req, res) => {
        const { id, status } = req.params
        try {
            const statusSelect = [1, 2, 3, 4];
            if (!statusSelect.includes(status)) {
                return res.status(400).json({ error: 'Estado inválido' });
            }
            const updatedBinnacles = await Binnacles.findByIdAndUpdate(id, { status: status }, { new: true })

            if (!updatedBinnacles) {
                return res.status(404).json({ error: 'Binnacles no encontrado' });
            }
            console.log("folloup encontrado", error)
            res.json(updatedBinnacles)
        } catch (error) {
            console.error("Error al actualiar Binnacles", error)
            res.status(500).json({ error: "Error al actualizar Binacles" })
        }
    },

    updateCheckTechnicalInstructor: async (req, res) => {
        const { id } = req.params;
        try {
            const binnacle = await Binnacles.findById(id);
            if (!binnacle) {
                return res.status(404).json({ error: 'Bitácora no encontrada' });
            }
            binnacle.checkTechnicalInstructor = true;
            const updatedBinnacle = await binnacle.save();
            console.log('checkTechnicalInstructor actualizado a true', updatedBinnacle);
            res.json(updatedBinnacle);
        } catch (error) {
            console.error('Error al actualizar checkTechnicalInstructor', error);
            res.status(500).json({ error: 'Error al actualizar checkTechnicalInstructor' });
        }
    },

    updateCheckProjectInstructor: async (req, res) => {
        const { id } = req.params;
        try {
            const binnacle = await Binnacles.findById(id);
            if (!binnacle) {
                return res.status(404).json({ error: 'Bitácora no encontrada' });
            }
            binnacle.checkProjectInstructor = true;
            const updatedBinnacle = await binnacle.save();
            console.log('checkProjectInstructor actualizado a true', updatedBinnacle);
            res.json(updatedBinnacle);
        } catch (error) {
            console.error('Error al actualizar checkProjectInstructor', error);
            res.status(500).json({ error: 'Error al actualizar checkProjectInstructor' });
        }
    }
};

export default controllerBinnacles;