import Binnacles from "../models/binnacles.js";
import Register from "../models/register.js";

const controllerBinnacles = {
  // Listar bitácoras-------------------------------------------------------------------
  listallbinnacles: async (req, res) => {
    try {
      const binnacles = await Binnacles.find();
      console.log("Lista de bitácoras", binnacles);
      res.json(binnacles);
    } catch (error) {
      console.error("Error al listar bitácoras", error);
      res.status(500).json({ message: "Error al listar bitácoras" });
    }
  },

  // Listar bitácoras por id-------------------------------------------------------
  listbinnaclesbyid: async (req, res) => {
    const { id } = req.params;
    try {
      const binnacle = await Binnacles.findById(id);
      if (!binnacle) {
        return res.status(404).json({ message: "Bitácora no encontrada" });
      }
      console.log("Bitácora encontrada", binnacle);
      res.json(binnacle);
    } catch (error) {
      console.error("Error al listar bitácora por id", error);
      res.status(500).json({ message: "Error al listar bitácora por id" });
    }
  },

  // Listar asignaciones en bitácoras------------------------------------------------------------------------------
  listbinnaclesbyassignment: async (req, res) => {
    const { idassignment } = req.params;
    try {
      const binnacles = await Binnacles.find({ assignment: idassignment });
      console.log(
        `Lista de asignaciones en bitácoras ${idassignment}:`,
        binnacles
      );
      res.json(binnacles);
    } catch (error) {
      console.error(
        `Error al listar asignaciones en bitácoras ${idassignment}:`,
        error
      );
      res
        .status(500)
        .json({
          error: `Error al listar asignaciones de bitácoras ${idassignment}`,
        });
    }
  },

  // Listar instructores en bitácoras--------------------------------------------------------------
  listbinnaclesbyinstructor: async (req, res) => {
    const { idinstructor } = req.params;
    try {
      const binnacles = await Binnacles.find({ instructor: idinstructor });
      console.log(
        `Lista de instructores en bitácoras ${idinstructor}:`,
        binnacles
      );
      res.json(binnacles);
    } catch (error) {
      console.error(
        `Error al listar instructores en bitácoras ${idinstructor}:`,
        error
      );
      res
        .status(500)
        .json({
          error: `Error al listar instructores de bitácoras ${instructor}`,
        });
    }
  },

  // Insertar bitácoras (solo para generar la bitácora sin observaciones)
  addbinnacles: async (req, res) => {
    const { register, instructor, number, document } = req.body;
    try {
        const existingBinnacle = await Binnacles.findOne({ number });
        if (existingBinnacle) {
            return res.status(400).json({ error: "El número de bitácora ya existe" });
        }
        const registerRecord = await Register.findById(register);
        if (!registerRecord) {
            return res.status(400).json({ error: "No se encontró el registro asociado a la asignación" });
        }
        const activeFollowUpInstructor = registerRecord.assignment.some(a =>
            a.followUpInstructor.some(f =>
                f.idInstructor.toString() === instructor.idinstructor.toString() && f.status === 1 
            )
        );
        if (!activeFollowUpInstructor) {
            return res.status(400).json({ error: "El instructor proporcionado no está activo como instructor de seguimiento en la asignación" });
        }
        const binnacle = new Binnacles({
            register, 
            instructor: {
                idinstructor: instructor.idinstructor, 
                name: instructor.name 
            },
            number,
            document,
            status: '1', 
        });
        const result = await binnacle.save();
        const updatedBinnacle = await Binnacles.findByIdAndUpdate(
            result._id,
            { status: '2' },
            { new: true }
        );
        console.log("Bitácora guardada y actualizada a ejecutado", updatedBinnacle);
            await registerRecord.save();
        res.status(201).json(updatedBinnacle);
    } catch (error) {
        console.error("Error al insertar bitácora", error);
        res.status(500).json({ error: "Error al insertar bitácora" });
    }
},

  // Actualizar bitácora---------------------------------------------------------
  updatebinnaclebyid: async (req, res) => {
    const { id } = req.params;
    try {
      const updatedBinnacle = await Binnacles.findByIdAndUpdate(id, req.body, {
        new: true,
      });

      if (!updatedBinnacle) {
        return res.status(404).json({ error: "Bitácora no encontrada" });
      }

      console.log("Bitácora actualizada:", updatedBinnacle);
      res.json(updatedBinnacle);
    } catch (error) {
      console.error("Error al actualizar bitácora:", error);
      res.status(500).json({ error: "Error al actualizar bitácora" });
    }
  },

  // Actuactulizar un El estado del 1,2,3,4
  updatestatus: async (req, res) => {
    const { id, status } = req.params;
    try {
      const statusSelect = [1, 2, 3, 4];
      if (!statusSelect.includes(parseInt(status))) {
        return res.status(400).json({ error: "Estado inválido" });
      }
      const updatedBinnacle = await Binnacles.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );
      if (!updatedBinnacle) {
        return res.status(404).json({ error: "Bitácora no encontrada" });
      }
      res.json(updatedBinnacle);
    } catch (error) {
      console.error("Error al actualizar estado de Bitácora", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  },

  updateCheckProjectInstructor: async (req, res) => {
    const { id } = req.params;
  
    try {
      const binnacle = await Binnacles.findById(id);
      if (!binnacle) {
        return res.status(404).json({ error: "Bitácora no encontrada" });
      }
  
      if (binnacle.checkProjectInstructor) {
        return res.status(400).json({ error: "El check de proyecto ya está actualizado" });
      }
  
      // Actualizar el check de proyecto
      binnacle.checkProjectInstructor = true;
      await binnacle.save();
  
      const register = await Register.findById(binnacle.register).populate("idModality");
      if (!register) {
        return res.status(404).json({ error: "Registro no encontrado" });
      }
  
      const modality = register.idModality;
      if (!modality) {
        return res.status(400).json({ error: "El registro no tiene una modalidad asociada" });
      }
  
      const hoursProject = modality.hourInstructorProject;
      if (!hoursProject) {
        return res.status(400).json({
          error: "No se definieron horas de proyecto para esta modalidad",
        });
      }
  
      // Calcular las horas por bitácora
      const hoursPerBinnacle = hoursProject / 6 / 2;
  
      // Asegurarse de que 'ProyectHourPending' sea un arreglo
      if (!Array.isArray(register.ProyectHourPending)) {
        register.ProyectHourPending = [];
      }
  
      // Asignar las horas al 'ProyectHourPending'
      register.ProyectHourPending.push({
        idInstructor: req.user.id,  // Si el usuario ya está en req.user, entonces se puede usar
        name: req.user.nombre,       // Nombre del usuario
        hour: hoursPerBinnacle,      // Horas calculadas
      });
  
      // Guardar el registro actualizado
      await register.save();
  
      res.json({
        message: "Horas de proyecto asignadas correctamente",
        register,
      });
    } catch (error) {
      console.error("Error al asignar horas de proyecto:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  },
  

  updateCheckTechnicalInstructor: async (req, res) => {
    const { id } = req.params;
    try {
      const binnacle = await Binnacles.findById(id);
      if (!binnacle) {
        return res.status(404).json({ error: "Bitácora no encontrada" });
      }
      if (binnacle.checkTechnicalInstructor) {
        return res
          .status(400)
          .json({ error: "El check técnico ya está actualizado" });
      }
      binnacle.checkTechnicalInstructor = true;
      await binnacle.save();
      const register = await Register.findById(binnacle.register).populate(
        "idModality"
      );
      if (!register) {
        return res.status(404).json({ error: "Registro no encontrado" });
      }
      const modality = register.idModality;
      if (!modality) {
        return res
          .status(400)
          .json({ error: "El registro no tiene una modalidad asociada" });
      }
      const hoursTechnical = modality.hourInstructorTechnical;
      if (!hoursTechnical) {
        return res
          .status(400)
          .json({
            error: "No se definieron horas técnicas para esta modalidad",
          });
      }
      const hoursPerBinnacle = hoursTechnical / 6 / 2;
      register.technicalHourPending.push({
        idInstructor: req.user._id,
        name: req.user.nombre,
        hour: hoursPerBinnacle,
      });
      await register.save();
      res.json({ message: "Horas técnicas asignadas correctamente", register });
    } catch (error) {
      console.error("Error al asignar horas técnicas:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  },

  validateHoursTechnical: async (req, res) => {
    const { id } = req.params;
    try {
        const binnacle = await Binnacles.findById(id);
        if (!binnacle) {
            return res.status(404).json({ error: "Bitácora no encontrada" });
        }
        // Buscar el registro asociado a la bitácora
        const register = await Register.findById(binnacle.register).populate("idModality");
        if (!register) {
            return res.status(404).json({ error: "Registro no encontrado" });
        }
        // Obtener la modalidad
        const modality = register.idModality;
        if (!modality) {
            return res.status(400).json({ error: "El registro no tiene una modalidad asociada" });
        }
        // Verificar si las horas técnicas están definidas
        const hoursTechnical = modality.hourInstructorTechnical;
        if (!hoursTechnical) {
            return res.status(400).json({ error: "No se definieron horas técnicas para esta modalidad" });
        }
        // Calcular las horas por bitácora
        const hoursPerBinnacle = hoursTechnical / 6 / 2;
        if (binnacle.checkTechnicalInstructor) {
            // Si el check técnico ya está marcado:
            const pendingHours = register.technicalHourPending.find(
                (item) => item.idInstructor.toString() === req.user._id.toString()
            );
            if (!pendingHours || pendingHours.hour <= 0) {
                return res.status(400).json({ error: "No hay horas pendientes para este instructor" });
            }
            // Pasar las horas pendientes a ejecutadas
            register.technicalHourExecuted.push({
                idInstructor: req.user._id,
                name: req.user.nombre,
                hour: pendingHours.hour,
            });
            // Eliminar las horas pendientes del instructor
            register.technicalHourPending = register.technicalHourPending.filter(
                (item) => item.idInstructor.toString() !== req.user._id.toString()
            );
            await register.save();
            return res.json({ message: "Horas pendientes pasadas a ejecutadas correctamente", register });
        } else {
            // Si el check técnico no está marcado:
            binnacle.checkTechnicalInstructor = true; // Marcar el check como verdadero
            await binnacle.save();
            // Asignar las horas directamente a ejecutadas
            register.technicalHourExecuted.push({
                idInstructor: req.user._id,
                name: req.user.nombre,
                hour: hoursPerBinnacle,
            });
            await register.save();
            return res.json({ message: "Horas técnicas ejecutadas correctamente", register });
        }
    } catch (error) {
        console.error("Error al validar horas técnicas:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
},


validateHoursProject: async (req, res) => {
    const { id } = req.params;
    try {
        const binnacle = await Binnacles.findById(id);
        if (!binnacle) {
            return res.status(404).json({ error: "Bitácora no encontrada" });
        }
        // Buscar el registro asociado a la bitácora
        const register = await Register.findById(binnacle.register).populate("idModality");
        if (!register) {
            return res.status(404).json({ error: "Registro no encontrado" });
        }
        // Obtener la modalidad
        const modality = register.idModality;
        if (!modality) {
            return res.status(400).json({ error: "El registro no tiene una modalidad asociada" });
        }
        // Verificar si las horas de proyecto están definidas
        const hoursProject = modality.hourInstructorProject;
        if (!hoursProject) {
            return res.status(400).json({ error: "No se definieron horas de proyecto para esta modalidad" });
        }
        // Calcular las horas por bitácora
        const hoursPerBinnacle = hoursProject / 6 / 2;
        if (binnacle.checkProjectInstructor) {
            // Si el check de proyecto ya está marcado:
            const pendingHours = register.projectHourPending.find(
                (item) => item.idInstructor.toString() === req.user._id.toString()
            );
            if (!pendingHours || pendingHours.hour <= 0) {
                return res.status(400).json({ error: "No hay horas pendientes para este instructor" });
            }
            // Pasar las horas pendientes a ejecutadas
            register.projectHourExecuted.push({
                idInstructor: req.user._id,
                name: req.user.nombre,
                hour: pendingHours.hour,
            });
            // Eliminar las horas pendientes del instructor
            register.projectHourPending = register.projectHourPending.filter(
                (item) => item.idInstructor.toString() !== req.user._id.toString()
            );
            await register.save();
            return res.json({ message: "Horas pendientes pasadas a ejecutadas correctamente", register });
        } else {
            // Si el check de proyecto no está marcado:
            binnacle.checkProjectInstructor = true; // Marcar el check como verdadero
            await binnacle.save();
            // Asignar las horas directamente a ejecutadas
            register.projectHourExecuted.push({
                idInstructor: req.user._id,
                name: req.user.nombre,
                hour: hoursPerBinnacle,
            });
            await register.save();
            return res.json({ message: "Horas de proyecto ejecutadas correctamente", register });
        }
    } catch (error) {
        console.error("Error al validar horas de proyecto:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
},


addObservation : async (req, res) => {
    const { id } = req.params; 
    const { observation } = req.body; 

    try {
        const binnacle = await Binnacles.findById(id);

        if (!binnacle) {
            return res.status(404).json({ error: "Bitácora no encontrada" });
        }
        const newObservation = {
            user: req.user._id, 
            observation,
        };
        binnacle.observation.push(newObservation); 
        await binnacle.save();

        res.status(201).json({
            message: "Observación agregada con éxito",
            observation: newObservation,
        });
    } catch (error) {
        console.error("Error al agregar observación:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
},

getObservations : async (req, res) => {
    const { id } = req.params; 

    try {
        const binnacle = await Binnacles.findById(id);
        if (!binnacle) {
            return res.status(404).json({ error: "Bitácora no encontrada" });
        }
        res.status(200).json({
            message: "Observaciones recuperadas con éxito",
            observations: binnacle.observation,
        });
    } catch (error) {
        console.error("Error al recuperar observaciones:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
}

};

export default controllerBinnacles;
