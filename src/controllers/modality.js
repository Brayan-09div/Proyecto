import Modality from "../models/modality.js";

const modalityController = {



  // Listar todas las modalidades
  listModalities: async (req, res) => {
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
  getModalityById: async (req, res) => {
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
    createModality: async (req, res) => {
      const { name, hourinstructorfollow, hourinstructortechnical, hourinstructorproyect, createdAt, updatedAt, estado } = req.body;
      try {
        const newModality = new Modality({
          name,
          hourinstructorfollow,
          hourinstructortechnical,
          hourinstructorproyect,
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
  editModality: async (req, res) => {
    const { id } = req.params;
    const { name, hourinstructorfollow, hourinstructortechnical, hourinstructorproyect, createdAt, updatedAt, estado } = req.body;
    try {
      const result = await Modality.findByIdAndUpdate(
        id,
        { name, hourinstructorfollow, hourinstructortechnical, hourinstructorproyect },
        { new: true }
      );

      if (!result) {
        throw new Error("Modality not found");
      }

      console.log("Modality edited:", result);
      res.json(result);
    } catch (error) {
      console.error("Error editing modality:", error);
      res.status(500).json({ error: "Error editing modality" });
    }
  },


  // Activar o desactivar una modalidad por su ID
  toggleModalityState: async (req, res) => {
    const { id } = req.params;
    try {
      const modality = await Modality.findById(id);
      if (!modality) {
        return res.status(404).json({ error: "Modality not found" });
      }

      modality.estado = modality.estado === 1 ? 0 : 1; // Cambiar estado (1 -> 0, 0 -> 1)
      await modality.save();

      const message = modality.estado === 1 ? "Modality activated correctly" : "Modality deactivated correctly";
      res.json({ msg: message });
    } catch (error) {
      console.error("Error toggling modality state:", error);
      res.status(500).json({ error: "Error toggling modality state" });
    }
  }, 
};

export default modalityController;