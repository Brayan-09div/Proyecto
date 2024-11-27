import mongoose from "mongoose";
import Register from "../models/register.js";
import Apprentice from '../models/apprentice.js'
import Modality from "../models/modality.js";


const controllerRegister = {
  // Listar todos los registros
  listallregister: async (req, res) => {
    try {
      const registers = await Register.find()
        .populate('idApprentice', 'firstName lastName fiche')
        .populate('idModality', 'name')
      console.log("Lista de registros", registers);
      res.json({ success: true, data: registers });
    } catch (error) {
      console.error("Error al listar registros", error);
      res
        .status(500)
        .json({ success: false, error: "Error al listar registros" });
    }
  },

  // Listar por id
  listregisterbyid: async (req, res) => {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, error: "ID no válido" })
        .populate('idApprentice', 'firstName lastName fiche')
        .populate('idModality', 'name')
    }
    try {
      const register = await Register.findById(id);
      if (!register) {
        return res
          .status(404)
          .json({ success: false, error: "Registro no encontrado" });
      }
      console.log("Registro encontrado", register);
      res.json({ success: true, data: register });
    } catch (error) {
      console.error("Error al listar registro por id", error);
      res
        .status(500)
        .json({ success: false, error: "Error al listar registro por id" });
    }
  },

  // Listar registro por Id aprendiz
  listtheapprenticebyid: async (req, res) => {
    const { idApprentice } = req.params;
    if (!mongoose.isValidObjectId(idApprentice)) {
      return res
        .status(400)
        .json({ success: false, error: "ID de aprendiz no válido" });
    }
    try {
      const registers = await Register.find({ idApprentice });
      console.log(`Lista de idaprendices en registros: ${idApprentice}`)
        .populate('idApprentice', 'firstName lastName fiche')
        .populate('idModality', 'name')
      res.json({ success: true, data: registers });
    } catch (error) {
      console.log(
        `Error al listar idaprendices en registros: ${idApprentice}`,
        error
      );
      res
        .status(500)
        .json({ error: "Error al listar idaprendices en registros" });
    }
  },

  // Listar registros por ID de ficha
  listregistersbyfiche: async (req, res) => {
    const { idFiche } = req.params;
    console.log(`ID de ficha recibido: ${idFiche}`);
    try {
      const registers = await Register.aggregate([
        {
          $lookup: {
            from: "apprentices",
            localField: "idApprentice",
            foreignField: "_id",
            as: "apprentice",
          },
        },
        {
          $unwind: "$apprentice",
        },
        {
          $match: {
            "apprentice.fiche.idFiche": new mongoose.Types.ObjectId(idFiche),
          },
        },
        {
          $project: {
            _id: 1,
            ficheid: "$apprentice.fiche",
            idApprentice: 1,
            idModality: 1,
            startDate: 1,
            endDate: 1,
            company: 1,
            phoneCompany: 1,
            addressCompany: 1,
            owner: 1,
            docAlternative: 1,
            hour: 1,
            businessProyectHour: 1,
            productiveProjectHour: 1,
            status: 1,
            mailCompany: 1,
          },
        },
      ]);

      if (registers.length === 0) {
        console.log(`No se encontraron registros para el ID de ficha: ${idFiche}`);
        return res.status(404).json({ success: false, message: "No se encontraron registros" });
      }

      console.log(`Registros encontrados: ${JSON.stringify(registers, null, 2)}`);
      res.json({ success: true, data: registers });
    } catch (error) {
      console.error(`Error al listar idFiche en register: ${idFiche}`, error);
      res.status(500).json({ error: "Error al listar idFiche en register" });
    }
  },

  // Listar por modalidad
  listregisterbymodality: async (req, res) => {
    const { idModality } = req.params;
    try {
      const registers = await Register.find({ idModality }) // Asegúrate de que el campo sea correcto
        .populate('idApprentice', 'firstName lastName fiche')
        .populate('idModality', 'name')
      console.log(`Lista de registros por modalidad: ${idModality}`);

      if (!registers.length) {
        return res.status(404).json({
          success: false,
          error: `No se encontraron registros para la modalidad ${idModality}`,
        });
      }

      res.json({ success: true, data: registers });
    } catch (error) {
      console.error(`Error al listar registros por modalidad: ${idModality}`, error);
      res.status(500).json({
        error: `Error al listar registros por modalidad ${idModality}`,
      });
    }
  },

  // Listar los registros por fecha de inicio
  listregisterbystartdate: async (req, res) => {
    const { startDate } = req.params;
    try {
      const registers = await Register.find({ startDate });
      if (!registers.length) {
        return res
          .status(404)
          .json({ error: "No se encontraron registros por fecha de inicio" });
      }
      console.log("Listar por fecha de inicio");
      res.json({ success: true, data: registers });
    } catch (error) {
      console.log("Error al listar por fecha de inicio", error);
      res.status(500).json({ error: "Error al listar por fecha de inicio" });
    }
  },

  // Listar los registros por fecha de finalización
  listregisterbyenddate: async (req, res) => {
    const { endDate } = req.params;
    try {
      const date = new Date(endDate);

      if (isNaN(date)) {
        return res.status(400).json({
          error: "La fecha proporcionada no es válida",
        });
      }
      const registers = await Register.find({
        endDate: {
          $gte: date,
          $lt: new Date(date.getTime() + 24 * 60 * 60 * 1000), // Rango de 1 día
        },
      });
      if (!registers.length) {
        return res.status(404).json({
          error: "No se encontraron registros por fecha de finalización",
        });
      }
      console.log("Listar por fecha de finalización");
      res.json({ success: true, data: registers });
    } catch (error) {
      console.error("Error al listar por fecha de finalización", error);
      res.status(500).json({ error: "Error al listar por fecha de finalización" });
    }
  },


  addRegister: async (req, res) => {
    const {
      idApprentice,
      idModality,
      startDate,
      company,
      phoneCompany,
      addressCompany,
      owner,
      docAlternative,
      certificationDoc,
      mailCompany,
      judymentPhoto,
      hourProductiveStageApprentice,
      assignment, 
    } = req.body;
    try {
      const start = new Date(startDate);
      if (isNaN(start)) {
        return res.status(400).json({ message: "startDate no es una fecha válida" });
      }

      const modalityData = await Modality.findById(idModality);
      if (!modalityData) {
        return res.status(400).json({ message: "Modalidad no encontrada" });
      }

      const { name } = modalityData;

      if (assignment && Array.isArray(assignment)) {
        const validateInstructors = (requiredInstructors) => {
          const missingInstructors = requiredInstructors.filter(instructor =>
            !assignment.some(item => item[instructor] && item[instructor].length > 0)
          );
          if (missingInstructors.length > 0) {
            return `Se requieren los instructores: ${missingInstructors.join(", ")}`;
          }
          return null;
        };

        let instructorError = null;
        if (["PROYECTO EMPRESARIAL", "PROYECTO PRODUCTIVO I+D"].includes(name)) {
          instructorError = validateInstructors(["projectInstructor", "technicalInstructor", "followUpInstructor"]);
        } else if (["PROYECTO SOCIAL", "PROYECTO PRODUCTIVO"].includes(name)) {
          instructorError = validateInstructors(["followUpInstructor", "technicalInstructor"]);
        } else if (["PASANTIA", "VÍNCULO LABORAL", "MONITORIAS", "UNIDAD PRODUCTIVA FAMILIAR", "CONTRATO DE APRENDIZAJE"].includes(name)) {
          instructorError = validateInstructors(["followUpInstructor"]);
        }

        if (instructorError) {
          return res.status(400).json({ message: instructorError });
        }
      }

      const apprenticeCount = Array.isArray(idApprentice) ? idApprentice.length : 1;
      const singleApprenticeModalities = ["VÍNCULO LABORAL", "MONITORIAS", "PASANTIA", "UNIDAD PRODUCTIVA FAMILIAR", "CONTRATO DE APRENDIZAJE"];
      if (singleApprenticeModalities.includes(name) && apprenticeCount !== 1) {
        return res.status(400).json({ message: "Solo se permite 1 aprendiz para esta modalidad" });
      } else if (!singleApprenticeModalities.includes(name) && apprenticeCount < 1) {
        return res.status(400).json({ message: "Se requiere al menos 1 aprendiz para esta modalidad" });
      }

      const endDate = new Date(start);
      endDate.setMonth(endDate.getMonth() + 6);
      endDate.setDate(endDate.getDate() - 1);

      const newRegister = new Register({
        idApprentice,
        idModality,
        startDate,
        endDate,
        company,
        phoneCompany,
        addressCompany,
        mailCompany,
        owner,
        docAlternative,
        certificationDoc,
        judymentPhoto,
        hourProductiveStageApprentice,
        assignment: assignment || [], 
      });



      
      const createdRegister = await newRegister.save();
      res.status(201).json({ success: true, data: createdRegister });
    } catch (error) {
      console.error("Error al crear registro:", error);
      res.status(400).json({ message: error.message || "Error al crear el registro" });
    }
  },


  // Actualizar registro
  updateRegisterById: async (req, res) => {
    const { id } = req.params;
    const { idApprentice, startDate, company, phoneCompany, addressCompany, owner, hour, businessProyectHour, productiveProjectHour, mailCompany } = req.body;
    try {
      const register = await Register.findById(id);
      if (!register) {
        return res.status(404).json({ msg: "Registro no encontrado" });
      }
      const modalityData = req.body.idModality ? await Modality.findById(req.body.idModality) : null;
      if (modalityData && !modalityData) {
        return res.status(400).json({ message: "Modalidad no encontrada" });
      }
      const modality = modalityData || register.idModality;
      const { name } = modality;

      const apprenticeCount = Array.isArray(idApprentice) ? idApprentice.length : 1;
      const singleApprenticeModalities = ["VÍNCULO LABORAL", "MONITORIAS", "PASANTIA", "UNIDAD PRODUCTIVA FAMILIAR", "CONTRATO DE APRENDIZAJE"];
      if (singleApprenticeModalities.includes(name) && apprenticeCount !== 1) {
        return res.status(400).json({ message: "Solo se permite 1 aprendiz para esta modalidad" });
      } else if (!singleApprenticeModalities.includes(name) && apprenticeCount < 1) {
        return res.status(400).json({ message: "Se requiere al menos 1 aprendiz para esta modalidad" });
      }

      let endDate = register.endDate;
      if (startDate) {
        const start = new Date(startDate);
        endDate = new Date(start);
        endDate.setMonth(endDate.getMonth() + 6);
        endDate.setDate(endDate.getDate() - 1);
      }
      const updatedRegister = await Register.findByIdAndUpdate(
        id,
        {
          idApprentice,
          startDate,
          endDate,
          company,
          phoneCompany,
          addressCompany,
          owner,
          hour,
          businessProyectHour,
          productiveProjectHour,
          mailCompany
        },
        { new: true }
      );

      console.log('Registro actualizado correctamente:', updatedRegister);
      res.json({ success: true, data: updatedRegister });

    } catch (error) {
      console.error('Error al actualizar registro:', error);
      res.status(400).json({ error: 'Error al actualizar el registro' });
    }
  },


  updateRegisterModality: async (req, res) => {
    const { id } = req.params;
    const { idModality, docAlternative } = req.body;
    try {
      const updatedModality = await Register.findByIdAndUpdate(id, { idModality, docAlternative }, { new: true });
      if (!updatedModality) {
        return res.status(404).json({ message: 'Registro no encontrado' });
      }
      res.json({ success: true, data: updatedModality });
    } catch (error) {
      console.log('Error al actualizar modalidad', error);
      res.status(500).json({ error: 'Error al actualizar modalidad' });
    }
  },

  // Activar registro
  enableregister: async (req, res) => {
    const { id } = req.params;
    try {
      const register = await Register.findById(id);
      if (!register) {
        return res.status(404).json({ error: "Registro no encontrado" });
      }
      if (register.status === 1) {
        return res.status(400).json({ error: "El registro ya está activado" });
      }
      register.status = 1;
      await register.save();
      res.json({ success: true, msg: "Registro activado exitosamente" });
    } catch (error) {
      console.error("Error al activar el estado del registro:", error);
      res.status(500).json({ error: "Error al activar el estado del registro" });
    }
  },

  // Desactivar registro
  disableregister: async (req, res) => {
    const { id } = req.params;
    try {
      const register = await Register.findById(id);
      if (!register) {
        return res.status(404).json({ error: "Registro no encontrado" });
      }
      if (register.status === 0) {
        return res.status(400).json({ error: "El registro ya está desactivado" });
      }
      register.status = 0;
      await register.save();

      res.json({ success: true, msg: "Registro desactivado exitosamente" });
    } catch (error) {
      console.error("Error al desactivar el estado del registro:", error);
      res.status(500).json({ error: "Error al desactivar el estado del registro" });
    }
  },


  // Listar todas las asignaciones ----------------------------------------------------------------
  listAllAssignments: async (req, res) => {
    try {
      const registers = await Register.find()
        .select('assignment status') // Incluye el campo de estado
        .populate('assignment.followUpInstructor.idInstructor', 'name')
        .populate('assignment.technicalInstructor.idInstructor', 'name')
        .populate('assignment.projectInstructor.idInstructor', 'name')
        .populate('idApprentice', 'firstName lastName fiche')
        .populate('idModality', 'name')

      if (!registers.length) {
        return res.status(404).json({ success: false, message: "No se encontraron asignaciones" });
      }

      console.log("Lista de asignaciones", registers);
      res.json({ success: true, data: registers });
    } catch (error) {
      console.error("Error al listar asignaciones", error);
      res.status(500).json({ success: false, error: "Error al listar asignaciones" });
    }
  },


  // Listar registros por ID del instructor de seguimiento
  listRegisterByFollowUpInstructor: async (req, res) => {
    const { idinstructor } = req.params;
    if (!mongoose.isValidObjectId(idinstructor)) {
      return res.status(400).json({ success: false, error: "ID de instructor no válido" })
    }
    try {
      const registers = await Register.find({
        'assignment.followUpInstructor.idInstructor': idinstructor,
      })
        .populate('idApprentice', 'firstName lastName fiche')
        .populate('idModality', 'name')

      if (!registers.length) {
        return res.status(404).json({ success: false, message: "No se encontraron registros para este instructor" });
      }

      console.log("Registros encontrados para el instructor", registers);
      res.json({ success: true, data: registers });
    } catch (error) {
      console.error("Error al listar registros por ID de instructor de seguimiento", error);
      res.status(500).json({ success: false, error: "Error al listar registros por ID de instructor de seguimiento" });
    }
  },

  // Listar registros por ID del instructor técnico
  listRegisterByTechnicalInstructor: async (req, res) => {
    const { idinstructor } = req.params;
    if (!mongoose.isValidObjectId(idinstructor)) {
      return res.status(400).json({ success: false, error: "ID de instructor no válido" })
        .populate('idApprentice', 'firstName lastName fiche')
        .populate('idModality', 'name')
    }
    try {
      const registers = await Register.find({
        'assignment.technicalInstructor.idInstructor': idinstructor,
      });

      if (!registers.length) {
        return res.status(404).json({ success: false, message: "No se encontraron registros para este instructor técnico" });
      }

      console.log("Registros encontrados para el instructor técnico", registers);
      res.json({ success: true, data: registers });
    } catch (error) {
      console.error("Error al listar registros por ID de instructor técnico", error);
      res.status(500).json({ success: false, error: "Error al listar registros por ID de instructor técnico" });
    }
  },

  // Listar registros por ID del instructor de Proyecto
  listRegisterByProjectInstructor: async (req, res) => {
    const { idinstructor } = req.params;
    if (!mongoose.isValidObjectId(idinstructor)) {
      return res.status(400).json({ success: false, error: "ID de instructor no válido" })
    }
    try {
      const registers = await Register.find({
        'assignment.projectInstructor.idInstructor': idinstructor,
      })
      .populate('idApprentice', 'firstName lastName fiche')
      .populate('idModality', 'name')

      if (!registers.length) {
        return res.status(404).json({ success: false, message: "No se encontraron registros para este instructor de Proyecto" });
      }

      console.log("Registros encontrados para el instructor de Proyecto", registers);
      res.json({ success: true, data: registers });
    } catch (error) {
      console.error("Error al listar registros por ID de instructor técnico", error);
      res.status(500).json({ success: false, error: "Error al listar registros por ID de instructor técnico" });
    }
  },


  // Buscar registros por ID de instructor en cualquier asignación
  listRegisterByInstructorInAssignment: async (req, res) => {
    const { idinstructor } = req.params;
    if (!mongoose.isValidObjectId(idinstructor)) {
      return res.status(400).json({ success: false, error: "ID de instructor no válido" });
    }
    try {
      const registers = await Register.find({
        $or: [
          { 'assignment.followUpInstructor.idInstructor': idinstructor },
          { 'assignment.technicalInstructor.idInstructor': idinstructor },
          { 'assignment.projectInstructor.idInstructor': idinstructor }
        ]
      })
        .populate('assignment.followUpInstructor.idInstructor', 'name')
        .populate('assignment.technicalInstructor.idInstructor', 'name')
        .populate('assignment.projectInstructor.idInstructor', 'name')
        .populate('idApprentice', 'firstName lastName fiche')
        .populate('idModality', 'name')

      if (!registers.length) {
        return res.status(404).json({ success: false, message: "No se encontraron registros para este instructor" });
      }
      console.log("Registros encontrados para el instructor", registers);
      res.json({ success: true, data: registers });
    } catch (error) {
      console.error("Error al buscar registros por ID de instructor en asignaciones", error);
      res.status(500).json({ success: false, error: "Error al buscar registros por ID de instructor en asignaciones" });
    }
  },


  listRegisterByAssignmentId: async (req, res) => {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, error: "ID de registro no válido" })
        .populate('idApprentice', 'firstName lastName fiche')
        .populate('idModality', 'name')
    }
    try {
      const register = await Register.findById(id)
        .populate('idModality', 'name')
        .populate('idApprentice', 'firstName lastName email phone')
        .populate('assignment.followUpInstructor.idInstructor', 'name')
        .populate('assignment.technicalInstructor.idInstructor', 'name')
        .populate('assignment.projectInstructor.idInstructor', 'name')
        .exec();

      if (!register) {
        return res.status(404).json({ success: false, message: "No se encontró el registro" });
      }

      // Devolver directamente el registro completo
      res.json({ success: true, data: register });

    } catch (error) {
      console.error("Error al buscar registro por ID:", error);
      res.status(500).json({ success: false, error: "Error al buscar registro por ID" });
    }
  },



  addAssignment: async (req, res) => {
    const { id } = req.params;
    const { assignment } = req.body;
    try {
      const register = await Register.findById(id);
      if (!register) {
        return res.status(404).json({ message: "Registro no encontrado" });
      }
      const modalityData = await Modality.findById(register.idModality);
      if (!modalityData) {
        return res.status(400).json({ message: "Modalidad no encontrada" });
      }
      const { name } = modalityData;
      const validateInstructors = (requiredInstructors) => {
        const providedInstructors = Object.keys(assignment[0] || {}).filter(key => key !== 'status');
        const missingInstructors = requiredInstructors.filter(instructor => !providedInstructors.includes(instructor));
        const invalidInstructors = providedInstructors.filter(instructor => !requiredInstructors.includes(instructor));

        if (missingInstructors.length > 0) {
          return `Se requieren los instructores: ${missingInstructors.join(", ")}`;
        }
        if (invalidInstructors.length > 0) {
          return `Instructores no permitidos: ${invalidInstructors.join(", ")}`;
        }
        return null;
      };
      let instructorError = null;
      if (name === "PROYECTO EMPRESARIAL" || name === "PROYECTO PRODUCTIVO I+D") {
        instructorError = validateInstructors(["projectInstructor", "technicalInstructor", "followUpInstructor"]);
      } else if (name === "PROYECTO SOCIAL" || name === "PROYECTO PRODUCTIVO") {
        instructorError = validateInstructors(["followUpInstructor", "technicalInstructor"]);
      } else if (["PASANTIA", "VÍNCULO LABORAL", "MONITORIAS", "UNIDAD PRODUCTIVA FAMILIAR", "CONTRATO DE APRENDIZAJE"].includes(name)) {
        instructorError = validateInstructors(["followUpInstructor"]);
      } else {
        instructorError = validateInstructors(["followUpInstructor"]);
      }
      if (instructorError) {
        return res.status(400).json({ message: instructorError });
      }
      const updateInstructorStatus = (type, instructors) => {
        if (instructors && instructors.length > 0) {
          if (!Array.isArray(register.assignment)) {
            register.assignment = [];
          }
          if (register.assignment.length === 0) {
            register.assignment.push({
              followUpInstructor: [],
              technicalInstructor: [],
              projectInstructor: [],
              status: 1
            });
          }
          const currentAssignment = register.assignment[0];
          currentAssignment[type] = instructors.map(instructor => ({
            idInstructor: instructor.idInstructor,
            name: instructor.name,
            email: instructor.email,
            status: instructor.status
          }));
        }
      };
      if (assignment && assignment.length > 0) {
        updateInstructorStatus("followUpInstructor", assignment[0].followUpInstructor);
        updateInstructorStatus("technicalInstructor", assignment[0].technicalInstructor);
        updateInstructorStatus("projectInstructor", assignment[0].projectInstructor);
        register.assignment[0].status = assignment[0].status;
      }
      await register.save();
      res.status(200).json({
        success: true,
        message: "Asignación actualizada correctamente",
        data: register
      });
    } catch (error) {
      console.error("Error al actualizar la asignación:", error);
      res.status(500).json({ message: error.message || "Error al actualizar la asignación" });
    }
  },

  updateAssignment: async (req, res) => {
    const { id } = req.params;
    const { assignment } = req.body;
    try {
      const register = await Register.findById(id);
      if (!register) {
        return res.status(404).json({ message: "Registro no encontrado" });
      }
      if (!register.assignment || register.assignment.length === 0) {
        return res.status(400).json({ message: "No hay asignación para actualizar" });
      }
      const currentAssignment = register.assignment[0];
      const updateInstructorInfo = (type, updatedInstructor) => {
        if (updatedInstructor && updatedInstructor.idInstructor) {
          const activeInstructor = currentAssignment[type].find(
            instructor =>
              instructor.status === 1 &&
              instructor.idInstructor.toString() === updatedInstructor.idInstructor
          );
          if (activeInstructor) {
            activeInstructor.name = updatedInstructor.name || activeInstructor.name;
            activeInstructor.email = updatedInstructor.email || activeInstructor.email;
          } else {
            return false;
          }
        }
        return true;
      };
      let updateSuccess = true;
      if (assignment) {
        if (assignment.followUpInstructor) {
          updateSuccess = updateInstructorInfo("followUpInstructor", assignment.followUpInstructor) && updateSuccess;
        }
        if (assignment.technicalInstructor) {
          updateSuccess = updateInstructorInfo("technicalInstructor", assignment.technicalInstructor) && updateSuccess;
        }
        if (assignment.projectInstructor) {
          updateSuccess = updateInstructorInfo("projectInstructor", assignment.projectInstructor) && updateSuccess;
        }
      }
      if (!updateSuccess) {
        return res.status(400).json({ message: "No se pudo actualizar uno o más instructores. Asegúrese de que estén activos." });
      }
      await register.save();
      res.status(200).json({
        success: true,
        message: "Asignación actualizada correctamente",
        data: register
      });
    } catch (error) {
      console.error("Error al actualizar la asignación:", error);
      res.status(500).json({ message: error.message || "Error al actualizar la asignación" });
    }
  }


};

export default controllerRegister;
