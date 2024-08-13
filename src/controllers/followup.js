import Followup from "../models/followup.js";
import Assignment from '../models/assignment.js';

const followupController = {
  

  // Listar todos los followups----------------------------------------------------
  listFollowups: async (req, res) => {
    try {
      const followups = await Followup.find();
      console.log("Followup list:", followups);
      res.json(followups);
    } catch (error) {
      console.error("Error listing followups:", error);
      res.status(500).json({ error: "Error listing followups" });
    }
  },

  // Listar un followup ID--------------------------------------------------------
  getFollowupById: async (req, res) => {
    const { id } = req.params;
    try {
      const followup = await Followup.findById(id);
      if (!followup)
        return res.status(404).json({ error: "Followup not found" });

      console.log("Followup found:", followup);
      res.json(followup);
    } catch (error) {
      console.error("Error listing followup by ID:", error);
      res.status(500).json({ error: "Error listing followup by ID" });
    }
  },

  // Listar followups  asignación---------------------------------------------------
  listFollowupsByAssignment: async (req, res) => {
    const { assignment } = req.params;
    try {
      const followups = await Followup.find({ assignment });
      console.log(`Followups for assignment ${assignment}:`, followups);
      res.json(followups);
    } catch (error) {
      console.error(
        `Error listing followups for assignment ${assignment}:`,
        error
      );
      res
        .status(500)
        .json({
          error: `Error listing followups for assignment ${assignment}`,
        });
      }
  },
  // Listar followups instructor---------------------------------------------------------
  listFollowupsByInstructor: async (req, res) => {
    const { instructor } = req.params;
    try {
      const followups = await Followup.find({ instructor });
      console.log(`Followups for instructor ${instructor}:`, followups);
      res.json(followups);
    } catch (error) {
      console.error(
        `Error listing followups for instructor ${instructor}:`,
        error
      );
      res
        .status(500)
        .json({
          error: `Error listing followups for instructor ${instructor}`,
        });
    }
  },
  // Insertar un nuevo followup----------------------------------------------
  insertFollowup: async (req, res) => {
    try {
      const newFollowup = new Followup(req.body);  
      const result = await newFollowup.save();
      console.log("Followup saved:", result);
      res.json(result);
    } catch (error) {
      console.error("Error inserting followup:", error);
      res.status(500).json({ error: "Error inserting followup" });
    }
  },
  // Actualizar un followup por su ID---------------------------------------------------
  updateFollowup: async (req, res) => {
    const { id } = req.params;
    try {
      const updatedFollowup = await Followup.findByIdAndUpdate(id, req.body, { new: true });
  
      if (!updatedFollowup) {
        return res.status(404).json({ error: 'Followup not found' });
      }
  
      console.log("Followup updated:", updatedFollowup);
      res.json(updatedFollowup);
    } catch (error) {
      console.error("Error updating followup:", error);
      res.status(500).json({ error: "Error updating followup" });
    }
  },

  // Activar o desactivar un followup por su ID-------------------------------------------
  toggleFollowupStatus: async (req, res) => {
    const { id } = req.body;
    try {
      const followup = await Followup.findById(id);
      if (!followup)
        return res.status(404).json({ error: "Followup not found" });

      followup.status = followup.status === 1 ? 0 : 1;
      await followup.save();

      const message =
        followup.status === 1 ? "Followup activated" : "Followup deactivated";
      res.json({ msg: message });
    } catch (error) {
      console.error("Error toggling followup status:", error);
      res.status(500).json({ error: "Error toggling followup status" });
    }
  },
};

export default followupController;
