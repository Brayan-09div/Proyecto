import mongoose from "mongoose"; 
import Register from "../models/register.js";
import apprentices from "../models/apprentice.js";
import Modality from "../models/modality.js";


const controllerRegister = {
  // Listar todos los registros
  listallregister: async (req, res) => {
    try {
      const registers = await Register.find();
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
      return res.status(400).json({ success: false, error: "ID no válido" });
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
      console.log(`Lista de idaprendices en registros: ${idApprentice}`);
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
      const registers = await Register.find({ idModality }); // Asegúrate de que el campo sea correcto
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
      const regex = new RegExp(endDate.replace(/-/g, " "), 'i');
      const registers = await Register.find({
        endDate: {
          $regex: regex
        }
      });
      if (!registers.length) {
        return res.status(404).json({
          error: "No se encontraron registros por fecha de finalización",
        });
      }
      console.log("Listar por fecha de finalización");
      res.json({ success: true, data: registers });
    } catch (error) {
      console.log("Error al listar por fecha de finalización", error);
      res.status(500).json({ error: "Error al listar por fecha de finalización" });
    }
  },

  // Insertar registro -------------------------------------------------------------------------------------------------------
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
      assignment
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

      // Validaciones de los instructores dependiendo de la modalidad (solo si las asignaciones existen)
      if (name === "PROYECTO EMPRESARIAL" || name === "PROYECTO PRODUCTIVO I+D") {
        if (assignment && (!assignment.projectInstructor || !assignment.technicalInstructor || !assignment.followUpInstructor)) {
          return res.status(400).json({ message: "Se requieren los instructores: projectInstructor, technicalInstructor, followUpInstructor" });
        }
      } else if (name === "PROYECTO SOCIAL" || name === "PROYECTO PRODUCTIVO") {
        if (assignment && (!assignment.followUpInstructor || !assignment.technicalInstructor)) {
          return res.status(400).json({ message: "Se requieren los instructores: followUpInstructor, technicalInstructor" });
        }
      } else if (["PASANTIA", "VÍNCULO LABORAL", "MONITORIAS", "UNIDAD PRODUCTIVA FAMILIAR", "CONTRATO DE APRENDIZAJE"].includes(name)) {
        if (assignment && !assignment.followUpInstructor) {
          return res.status(400).json({ message: "Se requiere el instructor: followUpInstructor" });
        }
        const providedInstructors = Object.keys(assignment || {});
        const invalidInstructors = providedInstructors.filter(instructor => instructor !== "followUpInstructor");

        if (invalidInstructors.length > 0) {
          return res.status(400).json({ message: `Instructores no permitidos: ${invalidInstructors.join(", ")}` });
        }

      } else {
        if (assignment && !assignment.followUpInstructor) {
          return res.status(400).json({ message: "Se requiere al menos un instructor para esta modalidad" });
        }
      }

      // Validar cantidad de aprendices para modalidades específicas
      const apprenticeCount = Array.isArray(idApprentice) ? idApprentice.length : 1;
      const singleApprenticeModalities = ["VÍNCULO LABORAL", "MONITORIAS", "PASANTIA", "UNIDAD PRODUCTIVA FAMILIAR", "CONTRATO DE APRENDIZAJE"];

      if (singleApprenticeModalities.includes(name) && apprenticeCount !== 1) {
        return res.status(400).json({ message: "Solo se permite 1 aprendiz para esta modalidad" });
      } else if (!singleApprenticeModalities.includes(name) && apprenticeCount < 1) {
        return res.status(400).json({ message: "Se requiere al menos 1 aprendiz para esta modalidad" });
      }

      // Calcular la fecha de finalización (6 meses después del inicio)
      const endDate = new Date(start);
      endDate.setMonth(endDate.getMonth() + 6);
      endDate.setDate(endDate.getDate() - 1);

      // Crear el nuevo registro con todos los campos requeridos
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
        assignment  
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
        .populate('assignment.projectInstructor.idInstructor', 'name');

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
      return res.status(400).json({ success: false, error: "ID de instructor no válido" });
    }
    try {
      const registers = await Register.find({
        'assignment.followUpInstructor.idInstructor': idinstructor,
      });

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
      return res.status(400).json({ success: false, error: "ID de instructor no válido" });
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


  // Listar registros por ID del instructor de proyecto
  listRegisterByProjectInstructor: async (req, res) => {
    const { idinstructor } = req.params;
    if (!mongoose.isValidObjectId(idinstructor)) {
      return res.status(400).json({ success: false, error: "ID de instructor no válido" });
    }
    try {
      const registers = await Register.find({
        'assignment.projectInstructor.idInstructor': idinstructor,
      });

      if (!registers.length) {
        return res.status(404).json({ success: false, message: "No se encontraron registros para este instructor de proyecto" });
      }
      console.log("Registros encontrados para el instructor de proyecto", registers);
      res.json({ success: true, data: registers });
    } catch (error) {
      console.error("Error al listar registros por ID de instructor de proyecto", error);
      res.status(500).json({ success: false, error: "Error al listar registros por ID de instructor de proyecto" });
    }
  },

  // Añadir Asignación
  addAssignment: async (req, res) => {
    const { idRegister } = req.params;
    const { followUpInstructor, technicalInstructor, projectInstructor } = req.body;
    if (!mongoose.isValidObjectId(idRegister)) {
      return res.status(400).json({ success: false, error: "ID de registro no válido" });
    }

    try {
      const register = await Register.findById(idRegister);
      if (!register) {
        return res.status(404).json({ success: false, error: "Registro no encontrado" });
      }
      if (register.idModality === 'PROYECTO EMPRESARIAL' || register.idModality === 'PROYECTO PRODUCTIVO I+D') {
        register.assignment = {
          followUpInstructor: {
            idInstructor: followUpInstructor.idInstructor,
            name: followUpInstructor.name,
          },
          technicalInstructor: {
            idInstructor: technicalInstructor.idInstructor,
            name: technicalInstructor.name,
          },
          projectInstructor: {
            idInstructor: projectInstructor.idInstructor,
            name: projectInstructor.name,
          },
          status: 1,
        }
      } else if (register.idModality === 'PROYECTO PRODUCTIVO') {
        register.assignment = {
          followUpInstructor: {
            idInstructor: followUpInstructor.idInstructor,
            name: followUpInstructor.name,
          },
          technicalInstructor: {
            idInstructor: technicalInstructor.idInstructor,
            name: technicalInstructor.name,
          },
          status: 1,
        }
      } else if (register.idModality === 'PASANTIA' || 
        register.idModality === 'UNIDAD PRODUCTIVA FAMILIAAR' || 
        register.idModality === 'CONTRATO DE APRENDIZAJE' || 
        register.idModality === 'VINCULO LABORAL') {

      }

      const updatedRegister = await register.save();
      console.log("Asignación añadida correctamente", updatedRegister);
      res.json({ success: true, data: updatedRegister });
    } catch (error) {
      console.error("Error al añadir asignación", error);
      res.status(500).json({ success: false, error: "Error al añadir asignación" });
    }
  },






};

export default controllerRegister;
