import mongoose from "mongoose";
import Register from "../models/register.js";
import Apprentice from "../models/apprentice.js";
import Modality from "../models/modality.js";
import { sendEmail1 } from "../utils/mailer.js"
import { sendEmail2 } from "../utils/mailer.js"

const controllerRegister = {
// Listar todos los registros
listallregister: async (req, res) => {
  try {
    const registers = await Register.find()
      .populate({
        path: "idApprentice",
        select: "-__v -createdAt -updatedAt", 
      })
      .populate("idModality", "name"); 
      
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
      return res
        .status(400)
        .json({ success: false, error: "ID no válido" })
        .populate("idApprentice", "firstName lastName fiche")
        .populate("idModality", "name");
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
      const registers = await Register.find({ idApprentice })
        .populate("idApprentice", "firstName lastName fiche")
        .populate("idModality", "name");

      console.log(`Lista de idaprendices en registros: ${idApprentice}`);

      if (!registers || registers.length === 0) {
        return res
          .status(404)
          .json({
            success: false,
            message: "No se encontraron registros para este aprendiz",
          });
      }

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
        console.log(
          `No se encontraron registros para el ID de ficha: ${idFiche}`
        );
        return res
          .status(404)
          .json({ success: false, message: "No se encontraron registros" });
      }

      console.log(
        `Registros encontrados: ${JSON.stringify(registers, null, 2)}`
      );
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
        .populate("idApprentice", "firstName lastName fiche")
        .populate("idModality", "name");
      console.log(`Lista de registros por modalidad: ${idModality}`);

      if (!registers.length) {
        return res.status(404).json({
          success: false,
          error: `No se encontraron registros para la modalidad ${idModality}`,
        });
      }

      res.json({ success: true, data: registers });
    } catch (error) {
      console.error(
        `Error al listar registros por modalidad: ${idModality}`,
        error
      );
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
      res
        .status(500)
        .json({ error: "Error al listar por fecha de finalización" });
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
        return res
          .status(400)
          .json({ message: "startDate no es una fecha válida" });
      }
  
      const modalityData = await Modality.findById(idModality);
      if (!modalityData) {
        return res.status(400).json({ message: "Modalidad no encontrada" });
      }
  
      const { name } = modalityData;
  
      // Función para validar instructores obligatorios
      const validateInstructors = (requiredInstructors) => {
        if (!assignment || assignment.length === 0) {
          return null;
        }
  
        const missingInstructors = requiredInstructors.filter(
          (instructor) =>
            !assignment.some(
              (element) => element[instructor] && element[instructor].length > 0
            )
        );
  
        if (missingInstructors.length > 0) {
          return `Se requieren los instructores: ${missingInstructors.join(", ")}`;
        }
  
        return null;
      };
  
      // Función para validar instructores prohibidos
      const validateForbiddenInstructors = (forbiddenInstructors) => {
        if (!assignment || assignment.length === 0) {
          return null;
        }
  
        const forbiddenInstructorsAssigned = forbiddenInstructors.filter(
          (instructor) =>
            assignment.some(
              (element) => element[instructor] && element[instructor].length > 0
            )
        );
  
        if (forbiddenInstructorsAssigned.length > 0) {
          return `No se deben asignar los instructores: ${forbiddenInstructorsAssigned.join(
            ", "
          )}`;
        }
        return null;
      };
  
      let instructorError = null;
      let forbiddenInstructorError = null;
  
      // Validación de instructores según la modalidad
      if (["PROYECTO EMPRESARIAL", "PROYECTO PRODUCTIVO I+D"].includes(name)) {
        instructorError = validateInstructors([
          "projectInstructor",
          "technicalInstructor",
          "followUpInstructor",
        ]);
      } else if (["PROYECTO SOCIAL", "PROYECTO PRODUCTIVO"].includes(name)) {
        instructorError = validateInstructors([
          "followUpInstructor",
          "technicalInstructor",
        ]);
        forbiddenInstructorError = validateForbiddenInstructors([
          "projectInstructor",
        ]);
      } else if (
        [
          "PASANTIA",
          "VINCULO LABORAL",
          "MONITORIAS",
          "UNIDAD PRODUCTIVA FAMILIAR",
          "CONTRATO DE APRENDIZAJE",
        ].includes(name)
      ) {
        instructorError = validateInstructors(["followUpInstructor"]);
        forbiddenInstructorError = validateForbiddenInstructors([
          "projectInstructor",
          "technicalInstructor",
        ]);
      }
  
      if (instructorError) {
        return res.status(400).json({ message: instructorError });
      }
  
      if (forbiddenInstructorError) {
        return res.status(400).json({ message: forbiddenInstructorError });
      }
  
      const apprenticeCount = Array.isArray(idApprentice)
        ? idApprentice.length
        : 1;
      const singleApprenticeModalities = [
        "VINCULO LABORAL",
        "MONITORIAS",
        "PASANTIA",
        "UNIDAD PRODUCTIVA FAMILIAR",
        "CONTRATO DE APRENDIZAJE",
      ];
  
      // Validación de cantidad de aprendices según la modalidad
      if (singleApprenticeModalities.includes(name) && apprenticeCount !== 1) {
        return res
          .status(400)
          .json({ message: "Solo se permite 1 aprendiz para esta modalidad" });
      } else if (
        !singleApprenticeModalities.includes(name) &&
        apprenticeCount < 1
      ) {
        return res
          .status(400)
          .json({
            message: "Se requiere al menos 1 aprendiz para esta modalidad",
          });
      }
  
      // Establecer la fecha de finalización, sumando 6 meses
      const endDate = new Date(start);
      endDate.setMonth(endDate.getMonth() + 6);
      endDate.setDate(endDate.getDate() - 1);
  
      // Crear un nuevo registro con los datos recibidos
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
  
      // Lógica para poblar y filtrar estudiantes
      const populatedRegister = await Register.populate(createdRegister, {
        path: 'idApprentice',
        populate: {
          path: 'fiche.idFiche',
          select: 'name number'
        }
      });
  
      const estudiantes = populatedRegister.idApprentice
        .filter(estudiante =>
          estudiante &&
          estudiante.fiche &&
          estudiante.fiche.name &&
          estudiante.fiche.number &&
          estudiante.numDocument &&
          estudiante.firstName &&
          estudiante.lastName
        )
        .map((estudiante, index) => ({
          index: index + 1,
          nombreFicha: estudiante.fiche.name,
          numeroFicha: estudiante.fiche.number,
          cc: estudiante.numDocument,
          nombre: estudiante.firstName,
          apellido: estudiante.lastName
        }));
  
      console.log('Estudiantes:', estudiantes);
  
      let allInstructors = [
        ...(Array.isArray(assignment?.[0]?.followUpInstructor)
          ? assignment[0].followUpInstructor.map(instructor => ({
              ...instructor,
              type: 'Instructor de seguimiento'
            }))
          : []),
        ...(Array.isArray(assignment?.[0]?.technicalInstructor)
          ? assignment[0].technicalInstructor.map(instructor => ({
              ...instructor,
              type: 'Instructor técnico'
            }))
          : []),
        ...(Array.isArray(assignment?.[0]?.projectInstructor)
          ? assignment[0].projectInstructor.map(instructor => ({
              ...instructor,
              type: 'Instructor de proyecto'
            }))
          : [])
      ];
      let processedInstructors = [];
      const enviarCorreoInstructor = async (instructor, estudiantes) => {
        const { name, email, type, idInstructor } = instructor;
        if (!idInstructor) {
          console.error(`Instructor sin ID: ${name} (${type})`);
          return;
        }
        if (!email || !name || !type) {
          console.error(`Datos incompletos para el instructor: ${JSON.stringify(instructor)}`);
          return;
        }
        if (processedInstructors.includes(idInstructor)) {
          console.log(`El instructor con ID ${idInstructor} ya fue procesado. No se enviará correo.`);
          return;
        }
        try {
          await sendEmail1(email, name, type, estudiantes);
          console.log(`Correo enviado a: ${name} (${type}) con email: ${email}`);
          processedInstructors.push(idInstructor);
        } catch (error) {
          console.error(`Error al enviar correo a: ${name} (${type}) con email: ${email}`, error);
        }
      };
      const procesarInstructores = async (assignment, instructores, estudiantes) => {
        for (let instructor of instructores) {
          const { idInstructor, status, name } = instructor;
          let instructorEnAsignacion = false;
          if (assignment[0]?.followUpInstructor.some(i => i.idInstructor === idInstructor)) {
            instructorEnAsignacion = true;
            console.log(`El instructor ${name} con ID ${idInstructor} está en la asignación (seguimiento).`);
          } else if (assignment[0]?.technicalInstructor.some(i => i.idInstructor === idInstructor)) {
            instructorEnAsignacion = true;
            console.log(`El instructor ${name} con ID ${idInstructor} está en la asignación (técnico).`);
          } else if (assignment[0]?.projectInstructor.some(i => i.idInstructor === idInstructor)) {
            instructorEnAsignacion = true;
            console.log(`El instructor ${name} con ID ${idInstructor} está en la asignación (proyecto).`);
          }
          if (!instructorEnAsignacion) {
            console.log(`El instructor ${name} con ID ${idInstructor} no está en la asignación, no se enviará correo.`);
            continue;
          }
          if (status !== 1) {
            console.log(`El instructor ${name} con ID ${idInstructor} está inactivo en la asignación, no se enviará correo.`);
            continue;
          }
          await enviarCorreoInstructor(instructor, estudiantes);
        }
      };
      if (allInstructors.length > 0) {
        console.log('Iniciando el procesamiento de instructores...');
        await procesarInstructores(assignment, allInstructors, estudiantes);
      } else {
        console.log('No hay instructores en la asignación.');
      }
      res.status(201).json({ success: true, data: createdRegister });
    } catch (error) {
      console.error("Error al crear registro:", error);
      res
        .status(400)
        .json({ message: error.message || "Error al crear el registro" });
    }
  },


  // Actualizar registro
  updateRegisterById: async (req, res) => {
    const { id } = req.params;
    const {
      idApprentice,
      startDate,
      company,
      phoneCompany,
      addressCompany,
      owner,
      hour,
      businessProyectHour,
      productiveProjectHour,
      mailCompany,
    } = req.body;
    try {
      const register = await Register.findById(id);
      if (!register) {
        return res.status(404).json({ msg: "Registro no encontrado" });
      }
      const modalityData = req.body.idModality
        ? await Modality.findById(req.body.idModality)
        : null;
      if (modalityData && !modalityData) {
        return res.status(400).json({ message: "Modalidad no encontrada" });
      }
      const modality = modalityData || register.idModality;
      const { name } = modality;

      const apprenticeCount = Array.isArray(idApprentice)
        ? idApprentice.length
        : 1;
      const singleApprenticeModalities = [
        "VINCULO LABORAL",
        "MONITORIAS",
        "PASANTIA",
        "UNIDAD PRODUCTIVA FAMILIAR",
        "CONTRATO DE APRENDIZAJE",
      ];
      if (singleApprenticeModalities.includes(name) && apprenticeCount !== 1) {
        return res
          .status(400)
          .json({ message: "Solo se permite 1 aprendiz para esta modalidad" });
      } else if (
        !singleApprenticeModalities.includes(name) &&
        apprenticeCount < 1
      ) {
        return res
          .status(400)
          .json({
            message: "Se requiere al menos 1 aprendiz para esta modalidad",
          });
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
          mailCompany,
        },
        { new: true }
      );

      console.log("Registro actualizado correctamente:", updatedRegister);
      res.json({ success: true, data: updatedRegister });
    } catch (error) {
      console.error("Error al actualizar registro:", error);
      res.status(400).json({ error: "Error al actualizar el registro" });
    }
  },

  updateRegisterModality: async (req, res) => {
    const { id } = req.params;
    const { idModality, docAlternative } = req.body;
    try {
      const updatedModality = await Register.findByIdAndUpdate(
        id,
        { idModality, docAlternative },
        { new: true }
      );
      if (!updatedModality) {
        return res.status(404).json({ message: "Registro no encontrado" });
      }
      res.json({ success: true, data: updatedModality });
    } catch (error) {
      console.log("Error al actualizar modalidad", error);
      res.status(500).json({ error: "Error al actualizar modalidad" });
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
      res
        .status(500)
        .json({ error: "Error al activar el estado del registro" });
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
        return res
          .status(400)
          .json({ error: "El registro ya está desactivado" });
      }
      register.status = 0;
      await register.save();

      res.json({ success: true, msg: "Registro desactivado exitosamente" });
    } catch (error) {
      console.error("Error al desactivar el estado del registro:", error);
      res
        .status(500)
        .json({ error: "Error al desactivar el estado del registro" });
    }
  },

  // Listar todas las asignaciones ----------------------------------------------------------------
  listAllAssignments: async (req, res) => {
    try {
      const registers = await Register.find()
        .select("assignment status") // Incluye el campo de estado
        .populate("assignment.followUpInstructor.idInstructor", "name")
        .populate("assignment.technicalInstructor.idInstructor", "name")
        .populate("assignment.projectInstructor.idInstructor", "name")
        .populate("idApprentice", "firstName lastName fiche")
        .populate("idModality", "name");

      if (!registers.length) {
        return res
          .status(404)
          .json({ success: false, message: "No se encontraron asignaciones" });
      }

      console.log("Lista de asignaciones", registers);
      res.json({ success: true, data: registers });
    } catch (error) {
      console.error("Error al listar asignaciones", error);
      res
        .status(500)
        .json({ success: false, error: "Error al listar asignaciones" });
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
      }).populate('idApprentice', 'firstName lastName fiche')
        .populate('idModality', 'name');

      if (!registers.length) {
        return res
          .status(404)
          .json({
            success: false,
            message: "No se encontraron registros para este instructor",
          });
      }

      console.log("Registros encontrados para el instructor", registers);
      res.json({ success: true, data: registers });
    } catch (error) {
      console.error(
        "Error al listar registros por ID de instructor de seguimiento",
        error
      );
      res
        .status(500)
        .json({
          success: false,
          error:
            "Error al listar registros por ID de instructor de seguimiento",
        });
    }
  },

  
  // Listar registros por ID del instructor técnico
  listRegisterByTechnicalInstructor: async (req, res) => {
    const { idinstructor } = req.params;
    if (!mongoose.isValidObjectId(idinstructor)) {
      return res.status(400).json({ success: false, error: "ID de instructor no válido" })
    }
    try {
      const registers = await Register.find({
        'assignment.technicalInstructor.idInstructor': idinstructor,
      })
        .populate('idApprentice', 'firstName lastName fiche')
        .populate('idModality', 'name')

      if (!registers.length) {
        return res
          .status(404)
          .json({
            success: false,
            message: "No se encontraron registros para este instructor técnico",
          });
      }

      console.log(
        "Registros encontrados para el instructor técnico",
        registers
      );
      res.json({ success: true, data: registers });
    } catch (error) {
      console.error(
        "Error al listar registros por ID de instructor técnico",
        error
      );
      res
        .status(500)
        .json({
          success: false,
          error: "Error al listar registros por ID de instructor técnico",
        });
    }
  },

  // Listar registros por ID del instructor de Proyecto
  listRegisterByProjectInstructor: async (req, res) => {
    const { idinstructor } = req.params;
    if (!mongoose.isValidObjectId(idinstructor)) {
      return res.status(400).json({ success: false, error: "ID de instructor no válido" })
        .populate('idApprentice', 'firstName lastName fiche')
        .populate('idModality', 'name')
    }
    try {
      const registers = await Register.find({
        'assignment.projectInstructor.idInstructor': idinstructor,
      })
        .populate('idApprentice', 'firstName lastName fiche')
        .populate('idModality', 'name')

      if (!registers.length) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              "No se encontraron registros para este instructor de Proyecto",
          });
      }

      console.log(
        "Registros encontrados para el instructor de Proyecto",
        registers
      );
      res.json({ success: true, data: registers });
    } catch (error) {
      console.error(
        "Error al listar registros por ID de instructor técnico",
        error
      );
      res
        .status(500)
        .json({
          success: false,
          error: "Error al listar registros por ID de instructor técnico",
        });
    }
  },

  // Buscar registros por ID de instructor en cualquier asignación
  listRegisterByInstructorInAssignment: async (req, res) => {
    const { idinstructor } = req.params;
    if (!mongoose.isValidObjectId(idinstructor)) {
      return res
        .status(400)
        .json({ success: false, error: "ID de instructor no válido" });
    }
    try {
      const registers = await Register.find({
        $or: [
          { "assignment.followUpInstructor.idInstructor": idinstructor },
          { "assignment.technicalInstructor.idInstructor": idinstructor },
          { "assignment.projectInstructor.idInstructor": idinstructor },
        ],
      })
        .populate("assignment.followUpInstructor.idInstructor", "name")
        .populate("assignment.technicalInstructor.idInstructor", "name")
        .populate("assignment.projectInstructor.idInstructor", "name")
        .populate("idApprentice", "firstName lastName fiche")
        .populate("idModality", "name");

      if (!registers.length) {
        return res
          .status(404)
          .json({
            success: false,
            message: "No se encontraron registros para este instructor",
          });
      }
      console.log("Registros encontrados para el instructor", registers);
      res.json({ success: true, data: registers });
    } catch (error) {
      console.error(
        "Error al buscar registros por ID de instructor en asignaciones",
        error
      );
      res
        .status(500)
        .json({
          success: false,
          error:
            "Error al buscar registros por ID de instructor en asignaciones",
        });
    }
  },

  listRegisterByAssignmentId: async (req, res) => {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res
        .status(400)
        .json({ success: false, error: "ID de registro no válido" })
        .populate("idApprentice", "firstName lastName fiche")
        .populate("idModality", "name");
    }
    try {
      const register = await Register.findById(id)
        .populate("idModality", "name")
        .populate("idApprentice", "firstName lastName email phone")
        .populate("assignment.followUpInstructor.idInstructor", "name")
        .populate("assignment.technicalInstructor.idInstructor", "name")
        .populate("assignment.projectInstructor.idInstructor", "name")
        .exec();

      if (!register) {
        return res
          .status(404)
          .json({ success: false, message: "No se encontró el registro" });
      }

      // Devolver directamente el registro completo
      res.json({ success: true, data: register });
    } catch (error) {
      console.error("Error al buscar registro por ID:", error);
      res
        .status(500)
        .json({ success: false, error: "Error al buscar registro por ID" });
    }
  },

  addAssignment: async (req, res) => {
    const { id } = req.params;
    const { assignment } = req.body;
    try {
        console.log(`Iniciando proceso de asignación para el registro con ID: ${id}`);
        const register = await Register.findById(id);

        if (!register) {
            return res.status(404).json({ message: "Registro no encontrado" });
        }

        console.log(`Registro encontrado: ${JSON.stringify(register)}`);
        const modalityData = await Modality.findById(register.idModality);

        if (!modalityData) {
            return res.status(400).json({ message: "Modalidad no encontrada" });
        }

        const { name } = modalityData;
        console.log(`Modalidad encontrada: ${name}`);

        // Validar requisitos según la modalidad
        if (["PROYECTO EMPRESARIAL", "PROYECTO PRODUCTIVO I+D"].includes(name)) {
            if (!assignment[0]?.followUpInstructor?.length) {
                return res.status(400).json({ message: "El registro necesita al menos un instructor de seguimiento" });
            }
            if (!assignment[0]?.technicalInstructor?.length) {
                return res.status(400).json({ message: "El registro necesita al menos un instructor técnico" });
            }
            if (!assignment[0]?.projectInstructor?.length) {
                return res.status(400).json({ message: "El registro necesita al menos un instructor de proyecto" });
            }
        } else if (["PROYECTO SOCIAL", "PROYECTO PRODUCTIVO"].includes(name)) {
            if (!assignment[0]?.followUpInstructor?.length) {
                return res.status(400).json({ message: "El registro necesita al menos un instructor de seguimiento" });
            }
            if (!assignment[0]?.technicalInstructor?.length) {
                return res.status(400).json({ message: "El registro necesita al menos un instructor técnico" });
            }
            if (assignment[0]?.projectInstructor?.length > 0) {
                return res.status(400).json({ message: "Este tipo de modalidad no permite un instructor de proyecto" });
            }
        } else if (["PASANTIA", "VINCULO LABORAL", "MONITORIAS", "UNIDAD PRODUCTIVA FAMILIAR", "CONTRATO DE APRENDIZAJE"].includes(name)) {
            if (!assignment[0]?.followUpInstructor?.length) {
                return res.status(400).json({ message: "El registro necesita al menos un instructor de seguimiento" });
            }
            if (assignment[0]?.technicalInstructor?.length > 0) {
                return res.status(400).json({ message: "Este tipo de modalidad no permite un instructor técnico" });
            }
            if (assignment[0]?.projectInstructor?.length > 0) {
                return res.status(400).json({ message: "Este tipo de modalidad no permite un instructor de proyecto" });
            }
        }

        // Inicializar asignaciones si no existen
        if (!register.assignment || register.assignment.length === 0) {
            register.assignment = [{}];
        }
        ["followUpInstructor", "technicalInstructor", "projectInstructor"].forEach(field => {
            if (!register.assignment[0][field]) {
                register.assignment[0][field] = [];
            }
        });

        // Cambiar estado de instructores previos a inactivos
        ["followUpInstructor", "technicalInstructor", "projectInstructor"].forEach(field => {
            if (Array.isArray(register.assignment[0][field])) {
                register.assignment[0][field].forEach(instructor => {
                    instructor.status = 0;
                });
            }
        });

        await register.save();
        console.log("Instructores previos marcados como inactivos");

        // Agregar nuevos instructores y activarlos
        const instructors = [
            ...assignment[0]?.followUpInstructor || [],
            ...assignment[0]?.technicalInstructor || [],
            ...assignment[0]?.projectInstructor || [],
        ];

        for (let instructor of instructors) {
            const { idInstructor, name, email } = instructor;
            const fields = ["followUpInstructor", "technicalInstructor", "projectInstructor"];
            for (let field of fields) {
                if (assignment[0][field]?.some(i => i.idInstructor.toString() === idInstructor)) {
                    const existingInstructor = register.assignment[0][field].find(i => i.idInstructor.toString() === idInstructor);

                    if (existingInstructor) {
                        if (existingInstructor.status === 1) {
                            // Verificamos si el estado ya es 1 y detenemos el proceso con un error
                            console.log(`Error: El instructor con ID ${idInstructor} ya está activo en el campo ${field}`);
                            return res.status(400).json({
                                message: `El instructor con ID ${idInstructor} ya está activo en el campo ${field}.`
                            });
                        } else {
                            // Reactivar el instructor si está inactivo
                            existingInstructor.status = 1;
                            console.log(`Reactivando al instructor con ID: ${idInstructor} en el campo ${field}`);
                        }
                    } else {
                        // Si el instructor no existe, se agrega con el estado 1 (activo)
                        register.assignment[0][field].push({ idInstructor, name, email, status: 1 });
                        console.log(`Agregando al instructor con ID: ${idInstructor} en el campo ${field}`);
                    }
                    break; // Sale del ciclo una vez que se haya encontrado y procesado al instructor
                }
            }
        }

        await register.save();

        const populatedRegister = await register.populate({
            path: 'idApprentice',
            populate: {
                path: 'fiche.idFiche',
                select: 'name number' 
            }
        });

        const estudiantes = populatedRegister.idApprentice
            .filter(estudiante =>
                estudiante &&
                estudiante.fiche &&
                estudiante.fiche.name &&
                estudiante.fiche.number &&
                estudiante.numDocument &&
                estudiante.firstName &&
                estudiante.lastName
            )
            .map((estudiante, index) => ({
                index: index + 1,
                nombreFicha: estudiante.fiche.name,
                numeroFicha: estudiante.fiche.number,
                cc: estudiante.numDocument,
                nombre: estudiante.firstName,
                apellido: estudiante.lastName
            }));

        console.log('Estudiantes:', estudiantes);


let allInstructors = [
  ...(assignment[0]?.followUpInstructor.map(instructor => ({
      ...instructor,
      type: 'Instructor de seguimiento'
  })) || []),
  ...(assignment[0]?.technicalInstructor.map(instructor => ({
      ...instructor,
      type: 'Instructor técnico'
  })) || []),
  ...(assignment[0]?.projectInstructor.map(instructor => ({
      ...instructor,
      type: 'Instructor de proyecto'
  })) || [])
];

let processedInstructors = [];
const enviarCorreoInstructor = async (instructor, estudiantes) => {
  const { name, email, type, idInstructor } = instructor;
  if (!idInstructor) {
      console.error(`Instructor sin ID: ${name} (${type})`);
      return;
  }
  if (!email || !name || !type) {
      console.error(`Datos incompletos para el instructor: ${JSON.stringify(instructor)}`);
      return;
  }
  if (processedInstructors.includes(idInstructor)) {
      console.log(`El instructor con ID ${idInstructor} ya fue procesado. No se enviará correo.`);
      return;
  }
  try {
      await sendEmail1(email, name, type, estudiantes);
      console.log(`Correo enviado a: ${name} (${type}) con email: ${email}`);
      processedInstructors.push(idInstructor);
  } catch (error) {
      console.error(`Error al enviar correo a: ${name} (${type}) con email: ${email}`, error);
  }
};
const procesarInstructores = async (assignment, instructores, estudiantes) => {
  for (let instructor of instructores) {
      const { idInstructor, status, name } = instructor;
      let instructorEnAsignacion = false;
      if (assignment[0]?.followUpInstructor.some(i => i.idInstructor === idInstructor)) {
          instructorEnAsignacion = true;
          console.log(`El instructor ${name} con ID ${idInstructor} está en la asignación (seguimiento).`);
      } else if (assignment[0]?.technicalInstructor.some(i => i.idInstructor === idInstructor)) {
          instructorEnAsignacion = true;
          console.log(`El instructor ${name} con ID ${idInstructor} está en la asignación (técnico).`);
      } else if (assignment[0]?.projectInstructor.some(i => i.idInstructor === idInstructor)) {
          instructorEnAsignacion = true;
          console.log(`El instructor ${name} con ID ${idInstructor} está en la asignación (proyecto).`);
      }
      if (!instructorEnAsignacion) {
          console.log(`El instructor ${name} con ID ${idInstructor} no está en la asignación, no se enviará correo.`);
          continue;
      }
      if (status !== 1) {
          console.log(`El instructor ${name} con ID ${idInstructor} está inactivo en la asignación, no se enviará correo.`);
          continue; 
      }
      await enviarCorreoInstructor(instructor, estudiantes);
  }
};
if (allInstructors.length > 0) {
  console.log('Iniciando el procesamiento de instructores...');
  await procesarInstructores(assignment, allInstructors, estudiantes);
} else {
  console.log('No hay instructores en la asignación.');
}

res.status(200).json({ message: "Asignación de instructores realizada con éxito." });
} catch (error) {
        console.error('Error en addAssignment:', error);
        res.status(500).json({ message: "Error interno del servidor." });
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
        return res
          .status(400)
          .json({ message: "No hay asignación para actualizar" });
      }
      const currentAssignment = register.assignment[0];
      const updateInstructorInfo = (type, updatedInstructor) => {
        if (updatedInstructor && updatedInstructor.idInstructor) {
          const activeInstructor = currentAssignment[type].find(
            (instructor) =>
              instructor.status === 1 &&
              instructor.idInstructor.toString() ===
              updatedInstructor.idInstructor
          );
          if (activeInstructor) {
            activeInstructor.name =
              updatedInstructor.name || activeInstructor.name;
            activeInstructor.email =
              updatedInstructor.email || activeInstructor.email;
          } else {
            return false;
          }
        }
        return true;
      };
      let updateSuccess = true;
      if (assignment) {
        if (assignment.followUpInstructor) {
          updateSuccess =
            updateInstructorInfo(
              "followUpInstructor",
              assignment.followUpInstructor
            ) && updateSuccess;
        }
        if (assignment.technicalInstructor) {
          updateSuccess =
            updateInstructorInfo(
              "technicalInstructor",
              assignment.technicalInstructor
            ) && updateSuccess;
        }
        if (assignment.projectInstructor) {
          updateSuccess =
            updateInstructorInfo(
              "projectInstructor",
              assignment.projectInstructor
            ) && updateSuccess;
        }
      }
      if (!updateSuccess) {
        return res
          .status(400)
          .json({
            message:
              "No se pudo actualizar uno o más instructores. Asegúrese de que estén activos.",
          });
      }
      await register.save();
      res.status(200).json({
        success: true,
        message: "Asignación actualizada correctamente",
        data: register,
      });
    } catch (error) {
      console.error("Error al actualizar la asignación:", error);
      res
        .status(500)
        .json({
          message: error.message || "Error al actualizar la asignación",
        });
    }
  },

  updateHoursForApprentices: async (req, res) => {
    const { id } = req.params;
    try {
        const register = await Register.findById(id).populate('idApprentice');
        if (!register) {
            return res.status(404).json({ message: 'Registro no encontrado' });
        }
        if (register.hoursExecutedApprentice) {
            return res.status(400).json({ message: 'Las horas ya fueron asignadas a los aprendices.' });
        }

        const hoursToAdd = register.hourProductiveStageApprentice;
        for (const apprenticeId of register.idApprentice) {
            const apprentice = await Apprentice.findById(apprenticeId);
            if (!apprentice) {
                continue;
            }
            apprentice.HoursExecutedPS += hoursToAdd;
            apprentice.HoursPendingPS -= hoursToAdd;
            if (apprentice.HoursPendingPS < 0) {
                apprentice.HoursPendingPS = 0;
            }
            if (apprentice.HoursExecutedPS >= apprentice.HoursTotalPS) {
                apprentice.status = 3; 
            }
            await apprentice.save();
        }
        register.status = 0;
        register.hoursExecutedApprentice = true;
        await register.save();

        res.status(200).json({ message: 'Horas actualizadas y registro desactivado exitosamente.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar las horas de los aprendices.' });
    }
},


};

export default controllerRegister;
