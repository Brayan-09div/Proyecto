import Followup from "../models/followup.js";
import Register from "../models/register.js";



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
    .populate('idApprentice', 'firstName lastName fiche')
    .populate('idModality', 'name')
      if (!followup)
        return res.status(404).json({ error: "Followup not found" });

      console.log("Followup found:", followup);
      res.json(followup);
    } catch (error) {
      console.error("Error listing followup by ID:", error);
      res.status(500).json({ error: "Error listing followup by ID" });
    }
  },

  listFollowupByRegister: async (req, res) => {
    const { register } = req.params;
    try {
      const followup = await Followup.find({ register: register})
      .populate({
        path: 'register',
        populate: {
          path: 'idApprentice'
        }
      })
      if(followup.length === 0){
        return res.status(404).json({ error: `No se encontraron seguminetos para el registro ${register}`})
      }
      console.log(`segimientos del registro ${register}:`, followup);
      res.json({
        message: `Seguimientos encontradas para el registro ${register}`,
        totalBinnacles: followup.length,
        followup,
      });
      
    } catch (error) {
      console.error(`Error al listar seguimiento del registro ${register}:`, error);
      res.status(500).json({ error: `Error al listar seguimiento del registro ${register}` });
    }
  },

// Listar followups instructor---------------------------------------------------------
listfollowupbyinstructor: async (req, res) => {
    const { idinstructor } = req.params;
    try {
      const followups = await Followup.find({ "instructor.idinstructor": idinstructor })
      .populate({
        path: 'register',
        populate:{
          path: 'idApprentice'
        }
      })
      if (!followups || followups.length === 0) {
        return res.status(404).json({ error: "No se encontraron followups para este instructor" });
      }
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

  listFollowupByInstructorEmail: async (req, res) => {
    const { email } = req.params;
    try {
      const register = await Register.findOne({
        'assignment.followUpInstructor.email': email
      });
      if (!register) {
        return res.status(404).json({ error: 'No se encontró el instructor con este correo en las asignaciones' });
      }
      const instructor = register.assignment
        .flatMap(a => a.followUpInstructor)
        .find(f => f.email === email); 
      if (!instructor) {
        return res.status(404).json({ error: 'El correo no está asociado a un instructor válido' });
      }
      const idInstructor = instructor.idInstructor;
      const followup = await Followup.find({ 'instructor.idinstructor': idInstructor })
      .populate({
        path: 'register',
        populate: [
          { path: 'idApprentice' },
          { path: 'idModality' }
        ]
      });
        console.log('Número de seguimientos encontrados:', followup.length);  
      if (!followup || followup.length === 0) {
        return res.status(404).json({ error: 'No se encontraron seguimientos para este instructor' });
      }
  
  
      res.json(followup);
  
    } catch (error) {
      console.error(`Error al listar seguimientos por correo del instructor ${email}:`, error);
      res.status(500).json({ error: 'Error al listar los seguimientos del instructor' });
    }
  },

  // addfollowup: async (req, res) => {
  //   const { register, instructor, number, month, document } = req.body;
  //   try {
  //     const followupsForRegister = await Followup.find({ register }).countDocuments();
  //     if (followupsForRegister >= 3) {
  //       return res.status(400).json({ error: "Ya hay 3 seguimientos para este registro" });
  //     }
  
  //     const existsFollowup = await Followup.findOne({ register, number });
  //     if (existsFollowup) {
  //       return res.status(400).json({ error: "El número de seguimiento ya existe para este registro" });
  //     }
  
  //     const registerRecord = await Register.findById(register).populate("idModality");
  //     if (!registerRecord) {
  //       return res.status(400).json({ error: "No se encontró registro asociado con la asignación" });
  //     }
  
  //     const modality = registerRecord.idModality;
  //     if (!modality) {
  //       return res.status(400).json({ error: "El registro no tiene una modalidad asociada" });
  //     }
  
  //     const hoursFollow = modality.hourInstructorFollow;
  //     if (!hoursFollow) {
  //       return res.status(400).json({ error: "No se definieron horas de seguimiento para esta modalidad" });
  //     }
  
  //     const hoursPerBinnacle = hoursFollow / 4;
  
  //     const activeFollowUpInstructor = registerRecord.assignment.some(a =>
  //       a.followUpInstructor.some(f =>
  //         f.idInstructor.toString() === instructor.idinstructor.toString() && f.status === 1
  //       )
  //     );
  
  //     if (!activeFollowUpInstructor) {
  //       return res.status(400).json({ error: "El instructor proporcionado no está activo como instructor de seguimiento en la asignación" });
  //     }
  
  //     if (!Array.isArray(registerRecord.hourFollowupPending)) {
  //       registerRecord.hourFollowupPending = [];
  //     }
  
  //     const instructorExistsInPending = registerRecord.hourFollowupPending.some(
  //       (entry) => entry.idInstructor.toString() === instructor.idinstructor.toString()
  //     );
  
  //     if (!instructorExistsInPending) {
  //       registerRecord.hourFollowupPending.push({
  //         idInstructor: instructor.idinstructor,
  //         name: instructor.name,
  //         hour: hoursPerBinnacle,
  //       });
  //     }
  
  //     const followup = new Followup({
  //       register,
  //       instructor: {
  //         idinstructor: instructor.idinstructor,
  //         name: instructor.name,
  //       },
  //       number,
  //       month,
  //       document,
  //       status: 1,
  //     });
  
  //     const result = await followup.save();
  
  //     const updatedFollowup = await Followup.findByIdAndUpdate(
  //       result._id,
  //       { status: '2' },
  //       { new: true }
  //     );
  
  //     console.log("Seguimiento guardado y actualizado a ejecutado", updatedFollowup);
  
  //     await registerRecord.save();
  //     res.status(201).json(updatedFollowup);
  //   } catch (error) {
  //     console.error("Error al insertar seguimiento", error);
  //     res.status(500).json({ error: "Error al insertar Seguimiento" });
  //   }
  // },

  addfollowup: async (req, res) => {
    const { idApprentice, instructor, number, month, document } = req.body;
  
    try {
      const { idinstructor, name } = instructor;
  
      // Buscar los registros relacionados con el idApprentice e idInstructor
      const registers = await Register.find({
        idApprentice: idApprentice,
        "assignment": {
          $elemMatch: {
            status: 1, // Validar que la asignación esté activa
            followUpInstructor: {
              $elemMatch: {
                idInstructor: idinstructor, // Usar idInstructor del objeto instructor
                status: 1 // Validar que el estado del instructor sea activo
              }
            }
          }
        },
        status: 1 // Validar que el registro esté activo
      });
  
      if (registers.length === 0) {
        return res
          .status(400)
          .json({ error: "No se encontraron registros para el aprendiz y el instructor proporcionados." });
      }
  
      const register = registers[0]._id;
  
      // Validar si ya existen 3 seguimientos para el registro
      const followupsForRegister = await Followup.find({ register }).countDocuments();
      if (followupsForRegister >= 3) {
        return res.status(400).json({ error: "Ya hay 3 seguimientos para este registro" });
      }
  
      // Validar si ya existe un seguimiento con el mismo número
      const existsFollowup = await Followup.findOne({ register, number });
      if (existsFollowup) {
        return res.status(400).json({ error: "El número de seguimiento ya existe para este registro" });
      }
  
      const registerRecord = await Register.findById(register).populate("idModality");
      if (!registerRecord) {
        return res.status(400).json({ error: "No se encontró registro asociado con la asignación" });
      }
  
      const modality = registerRecord.idModality;
      if (!modality) {
        return res.status(400).json({ error: "El registro no tiene una modalidad asociada" });
      }
  
      const hoursFollow = modality.hourInstructorFollow;
      if (!hoursFollow) {
        return res.status(400).json({ error: "No se definieron horas de seguimiento para esta modalidad" });
      }
  
      const hoursPerBinnacle = hoursFollow / 4;
  
      if (!Array.isArray(registerRecord.hourFollowupPending)) {
        registerRecord.hourFollowupPending = [];
      }
  
      const instructorExistsInPending = registerRecord.hourFollowupPending.some(
        (entry) => entry.idInstructor.toString() === idinstructor.toString()
      );
  
      if (!instructorExistsInPending) {
        registerRecord.hourFollowupPending.push({
          idInstructor: idinstructor,
          name,
          hour: hoursPerBinnacle,
        });
      }
  
      const followup = new Followup({
        register,
        instructor: {
          idinstructor,
          name,
        },
        number,
        month,
        document,
        status: 1,
      });
  
      const result = await followup.save();
  
      const updatedFollowup = await Followup.findByIdAndUpdate(
        result._id,
        { status: '2' },
        { new: true }
      );
  
      console.log("Seguimiento guardado y actualizado a ejecutado", updatedFollowup);
  
      await registerRecord.save();
      res.status(201).json(updatedFollowup);
    } catch (error) {
      console.error("Error al insertar seguimiento", error);
      res.status(500).json({ error: "Error al insertar seguimiento" });
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
  const { id, status } = req.params;  
  try {
    const statusSelect = [1, 2, 3, 4];
    if (!statusSelect.includes(parseInt(status))) {
      return res.status(400).json({ error: 'Estado inválido' });
    }
    const updatedFollowup = await Followup.findByIdAndUpdate(id, { status: parseInt(status) }, { new: true });
    if (!updatedFollowup) {
      return res.status(404).json({ error: 'Followup no encontrado' });
    }
    res.json(updatedFollowup);
  } catch (error) {
    console.error("Error al actualizar followup", error);
    res.status(500).json({ error: "Error al actualizar followup" });
  }
},
validateHoursFollowup: async (req, res) => {
  const { id } = req.params;
  try {
    // Buscar el Followup por su id
    const followup = await Followup.findById(id);
    if (!followup) {
      return res.status(404).json({ error: "Followup no encontrado" });
    }

    // Verificar si las horas ya fueron ejecutadas
    if (followup.HoursFollowupExecuted) {
      return res.status(400).json({ error: "Las horas de seguimiento ya han sido cobradas" });
    }

    // Buscar el registro relacionado con este Followup
    const register = await Register.findById(followup.register).populate("idModality");
    if (!register) {
      return res.status(404).json({ error: "Registro no encontrado" });
    }

    // Obtener la modalidad del registro
    const modality = register.idModality;
    if (!modality) {
      return res.status(400).json({ error: "El registro no tiene una modalidad asociada" });
    }

    // Obtener las horas de seguimiento definidas en la modalidad
    const hourFollow = modality.hourInstructorFollow;
    if (!hourFollow) {
      return res.status(400).json({ error: "No se definieron horas de seguimiento para esta modalidad" });
    }

    // Si `hourFollowupExcuted` no es un arreglo, inicializarlo como un arreglo vacío
    if (!Array.isArray(register.hourFollowupExcuted)) {
      register.hourFollowupExcuted = [];
    }

    // Si `hourFollowupPending` no es un arreglo, inicializarlo como un arreglo vacío
    if (!Array.isArray(register.hourFollowupPending)) {
      register.hourFollowupPending = [];
    }

    // Procesar las horas pendientes y moverlas a las horas ejecutadas
    register.hourFollowupPending.forEach((pendingHour) => {
      if (pendingHour.hour > 0) {
        register.hourFollowupExcuted.push({
          idInstructor: pendingHour.idInstructor,
          name: pendingHour.name,
          hour: pendingHour.hour,
        });
      }
    });

    // Limpiar las horas pendientes después de moverlas
    register.hourFollowupPending = [];

    // Actualizar `HoursFollowupExecuted` a true
    followup.HoursFollowupExecuted = true;

    // Guardar los cambios en el registro y el seguimiento
    await register.save();
    await followup.save();

    return res.json({
      message: "Horas de seguimiento procesadas correctamente",
      register,
      followup,
    });
  } catch (error) {
    console.error("Error al validar horas de seguimiento:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
},



  addObservation : async (req, res) => {
    const{ id } = req.params;
    const { observation } = req.body;
    try {
      const followup = await Followup.findById(id);
      if(!followup){
        return res.status(404).json({erro:  " Followup no encontrado"});
      }
      const newObservation = {
        user: req.user,
        observation,
      };
      followup.observation.push(newObservation)
      await followup.save();
      res.status(201).json({
        message: "Observación agregada con éxito",
        observation: newObservation,
      });

    }catch (error){
      console.error("Error al agregar observación:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  },

  getObservations: async (req, res)=>{
    const{id} = req.params
    try {
      const followup = await Followup.findById(id)
      if(!followup){
        return res.status(404).json({ erro: " Followup no encontrado" });
      }
      res.status(200).json({
        message: "Observaciones recuperadas con éxito",
        observations: followup.observation,
      });
    }catch(error) {
      console.error("Error al recuperar observaciones:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

}
export default followupController;
