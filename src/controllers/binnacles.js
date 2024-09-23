import Binnacles from '../models/binnacles.js';

const controllerBinnacles = {

    // Listar bitácoras-------------------------------------------------------------------
    listAllBinnacles: async (req, res) => {
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
    listBinnacleById: async (req, res) => {
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
    listAssignmentsById: async (req, res) => {
        const { assignment } = req.params;
        try {
            const binnacles = await Binnacles.find({ assignment: assignment });
            console.log(`Lista de asignaciones en bitácoras ${assignment}:`, binnacles);
            res.json(binnacles);
        } catch (error) {
            console.error(`Error al listar asignaciones en bitácoras ${assignment}:`, error);
            res.status(500).json({ error: `Error al listar asignaciones de bitácoras ${assignment}` });
        }
    },

    // Listar instructores en bitácoras--------------------------------------------------------------
    listInstructorsById: async (req, res) => {
        const { instructor } = req.params;
        try {
            const binnacles = await Binnacles.find({ instructor: instructor });
            console.log(`Lista de instructores en bitácoras ${instructor}:`, binnacles);
            res.json(binnacles);
        } catch (error) {
            console.error(`Error al listar instructores en bitácoras ${instructor}:`, error);
            res.status(500).json({ error: `Error al listar instructores de bitácoras ${instructor}` });
        }
    },

    // Insertar bitácoras---------------------------------------------------------------------
    insertBinnacles: async (req, res) => {
        const { assignment, instructor, number, document, status, observation, users } = req.body;

        // Validate the number field against the enum values
        const validNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        if (!validNumbers.includes(number)) {
            return res.status(400).json({ error: 'Número inválido' });
        }
        let observations;
        if (Array.isArray(observation)) {
            observations = observation.map(obs => ({
                observation: obs.observation || '', 
                observationOwner: obs.observationOwner || '', 
                observationDate: obs.observationDate || new Date() 
            }));
        } else {
            return res.status(400).json({ error: 'El campo observación debe ser un array de objetos' });
        }
        try {
            const binnacle = new Binnacles({
                assignment,
                instructor,
                number,
                document,
                status,
                observation: observations, 
                users
            });
            const result = await binnacle.save();

            console.log('Bitácora guardada', result);
            res.status(201).json(result);
        } catch (error) {
        
            console.error('Error al insertar bitácora', error);
            res.status(500).json({ error: 'Error al insertar bitácora' });
        }
    },
    
    // Actualizar bitácora---------------------------------------------------------
    updateBinnacleById: async (req, res) => {
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
updateStatus: async (req, res) => {
  const {id,status} = req.params
  
  try {

    const statusSelect = [1, 2, 3, 4];
    if (!statusSelect.includes(status)) {
      return res.status(400).json({ error: 'Estado inválido' });
    }

    const updatedBinnacles = await Binnacles.findByIdAndUpdate(id,{ status: status }, { new:true})

    if (!updatedBinnacles) {
      return res.status(404).json({ error: 'Binnacles no encontrado' });
    }


    console.log("folloup encontrado",error)
    res.json(updatedBinnacles)
  } catch (error) {
    console.error("Error al actualiar Binnacles",error)
    res.status(500).json({error:"Error al actualizar Binacles"})
  }
},
};

export default controllerBinnacles;