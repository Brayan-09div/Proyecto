import Modality from "../models/modality.js";

const modalityController = {

  // Listar todas las modalidades
  listallmodality: async (req, res) => {
    try {
      const modalities = await Modality.find();
      console.log("Modality list:", modalities);
      res.json(modalities);
    } catch (error) {
      console.error("Error listing modalities:", error);
      res.status(500).json({ error: "Error listing modalities" });
    }
  },

  // Listar una modalidad por su ID
  listmodalitybyid: async (req, res) => {
    const { id } = req.params;
    try {
      const modality = await Modality.findById(id);

      if (!modality) {
        return res.status(404).json({ error: "Modality not found" });
      }

      console.log("Modality found:", modality);
      res.json(modality);
    } catch (error) {
      console.error("Error listing modality by ID:", error);
      res.status(500).json({ error: "Error listing modality by ID" });
    }
  },
    // Crear nueva modalidad
    addmodality: async (req, res) => {
      const { name, hourInstructorFollow, hourInstructorTechnical, hourInstructorProject,  } = req.body;
      try {
        const newModality = new Modality({
          name,
          hourInstructorFollow,
          hourInstructorTechnical,
          hourInstructorProject,
        }); 
        const result = await newModality.save();
        console.log("Modality created:", result);
        res.json(result);
      } catch (error) {
        console.error("Error creating modality:", error);
        res.status(500).json({ error: "Error creating modality" });
      }
    },

  // Editar una modalidad por su ID
  updatemodalitybyid: async (req, res) => {
    const { id } = req.params;
    const { name, hourInstructorFollow, hourInstructorTechnical, hourInstructorProject } = req.body;
    try {
      const modality = await Modality.findById(id);
      if (modality) {
        modality.name = name;
        modality.hourInstructorFollow = hourInstructorFollow;
        modality.hourInstructorTechnical = hourInstructorTechnical;
        modality.hourInstructorProject = hourInstructorProject;
        await modality.save();
        console.log("Modalidad editada:", modality);
        res.json(modality);
      } else {
        res.status(404).json({ msg: "modalidad no encontrado" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
   // activar------------------------------------------------------------------------------------
   enablemodalitybyid: async (req, res) => {
    const { id } = req.params;
    try {
        const  modality = await Modality.findByIdAndUpdate(id,{status:1},{new:true});

        if (!modality) {
            return res.status(404).json({ error: 'Modality no encontrada' });
        }
        res.json({ message });
    } catch (error) {
        console.error('Error al activar:', error);
        res.status(500).json({ error: 'Error al activar' });
    }
},

// desactivar una asignación---------------------------------------------------------------------
disablemodalitybyid: async (req, res) => {
    const { id } = req.params;
    try {
        const  modality = await Modality.findByIdAndUpdate(id,{status:0}, {new:true});

        if (!modality) {
            return res.status(404).json({ error: 'Modality no encontrada' });
        }
        res.json({ message });
    } catch (error) {
        console.error('Error al desactivar Modality:', error);
        res.status(500).json({ error: 'Error al desactivar Modality' });
    }
}
};


export default modalityController;