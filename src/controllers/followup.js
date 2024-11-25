import Followup from "../models/followup.js";


const followupController = {
  

  // Listar todos los followups----------------------------------------------------
  listallfollowup: async (req, res) => {
    try {
      const followups = await Followup.find()
      .populate({
        path:'register',
        populate:{
          path: 'idApprentice'
        }
      })
      console.log("Followup list:", followups);
      res.json(followups);
    } catch (error) {
      console.error("Error listing followups:", error);
      res.status(500).json({ error: "Error listing followups" });
    }
  },

  // Listar un followup ID--------------------------------------------------------
  listfollowupbyid: async (req, res) => {
    const { id } = req.params;
    try {
      const followup = await Followup.findById(id)
      .populate({
        path:'register',
        populate:{
          path: 'idApprentice'
        }
      })
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
  listfollowupbyassignment: async (req, res) => {
    const { idassignment } = req.params;
    try {
      const followups = await Followup.find({assignment : idassignment });
      console.log(`Followups for assignment ${idassignment}:`, followups);
      res.json(followups);
    } catch (error) {
      console.error(
        `Error listing followups for assignment ${idassignment}:`,
        error
      );
      res
        .status(500)
        .json({
          error: `Error listing followups for assignment ${idassignment}`,
        });
      }
  },
  // Listar followups instructor---------------------------------------------------------
  listfollowupbyinstructor: async (req, res) => {
    const { idinstructor } = req.params;
    try {
      const followups = await Followup.find({ idinstructor });
      console.log(`Followups for instructor ${idinstructor}:`, followups);
      res.json(followups);
    } catch (error) {
      console.error(
        `Error listing followups for instructor ${idinstructor}:`,
        error
      );
      res
        .status(500)
        .json({
          error: `Error listing followups for instructor ${idinstructor}`,
        });
    }
  },
  // Insertar un nuevo followup----------------------------------------------
  addfollowup: async (req, res) => {
    const { assignment, instructor, number, month, document, status, users, observation } = req.body;
    const validNumbers = [1, 2, 3];
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
      const newFollowup = new Followup({
        assignment,
        instructor,
        number,
        month,
        document,
        status,
        users,
        observation: observations 
      });
      const result = await newFollowup.save();
   
      console.log("Followup saved:", result);
      res.status(201).json(result);
    } catch (error) {
      console.error("Error inserting followup:", error);
      res.status(500).json({ error: "Error inserting followup" });
    }
  },

  
  // Actualizar un followup por su ID---------------------------------------------------
  updatefollowupbyid: async (req, res) => {
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
// Actuactulizar un El estado del 1,2,3,4
updatestatus: async (req, res) => {
  const {id,status} = req.params

  try {

    const statusSelect = [1, 2, 3, 4];
    if (!statusSelect.includes(status)) {
      return res.status(400).json({ error: 'Estado inválido' });
    }

    const updatedFollowup = await Followup.findByIdAndUpdate(id,{ status: status }, { new:true})

    if (!updatedFollowup) {
      return res.status(404).json({ error: 'Followup no encontrado' });
    }


    console.log("followup encontrado",error)
    res.json(updatedFollowup)
  } catch (error) {
    console.error("Error al actualiar followup",error)
    res.status(500).json({error:"Error al actualizar followup"})
  }
},
}
  

export default followupController;
