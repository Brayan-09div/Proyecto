import mongoose from "mongoose"; // Asegúrate de importar mongoose
import Register from "../models/register.js";
import apprentices from "../models/apprentice.js";

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





  // Insertar registro
  addRegister: async (req, res) => {
    const { idApprentice, idModality, startDate, company, phoneCompany, addressCompany, owner, hour, businessProyectHour, productiveProjectHour, mailCompany } = req.body;
    try {
      const start = new Date(startDate);
      if (isNaN(start)) {
        return res.status(400).json({ message: "startDate no es una fecha válida" });
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
        owner,
        hour,
        businessProyectHour,
        productiveProjectHour,
        mailCompany,
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
    const { idApprentice, idModality, startDate, company, phoneCompany, addressCompany, owner, hour, businessProyectHour, productiveProjectHour, mailCompany } = req.body;
    try {
      const register = await Register.findById(id);
      if (!register) {
        return res.status(404).json({ msg: "Registro no encontrado" });
      }
      let endDate;
      if (startDate) {
        const start = new Date(startDate);
        endDate = new Date(start);
        endDate.setMonth(endDate.getMonth() + 6);
        endDate.setDate(endDate.getDate() - 1);
      } else {
        // Si no se proporciona startDate, se utiliza el valor actual de endDate
        endDate = register.endDate; // Asumiendo que tienes endDate en el registro original
      }
      const updatedRegister = await Register.findByIdAndUpdate(
        id,
        { idApprentice, idModality, startDate, endDate, company, phoneCompany, addressCompany, owner, hour, businessProyectHour, productiveProjectHour, mailCompany },
        { new: true }
      );

      console.log('Registro actualizado correctamente:', updatedRegister);
      res.json({ success: true, data: updatedRegister });
    } catch (error) {
      console.error('Error al actualizar registro:', error);
      res.status(400).json({ error: 'Error al actualizar el registro' });
    }
  },


  // Actualizar modalidad
  updatemodalityregister: async (req, res) => {
    const { id } = req.params;
    const { modality } = req.body;
    try {
      const updatedModality = await Register.findByIdAndUpdate(
        id,
        { modality },
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

};

export default controllerRegister;
