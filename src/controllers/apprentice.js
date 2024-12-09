import Apprentice from '../models/apprentice.js'
import Register from "../models/register.js";
import Binnacles from "../models/binnacles.js";
import Followup from "../models/followup.js";

import { generarJWT } from "../middleware/validate-apprentice.js";
import mongoose from 'mongoose';
import xlsx from 'xlsx';


const  controllerApprentice ={
 // listar todos los aprendices ---------------------------------------------------
    listallapprentice: async (req, res) => {
        try {
            const apprentice = await Apprentice.find().sort({ createdAt: -1 });
            console.log('Lista de apprentices', apprentice);
            res.json(apprentice);
        } catch (error) {
            res.status(500).json({ error: 'Error al listar apprentice' });
        }
    },

// listar id del aprendiz-------------------------------------------------------------
listapprenticebyid: async (req, res) => {
    const { id } = req.params; 
    try {
        const apprentice = await Apprentice.findById(id); 
        if (!apprentice) {
            return res.status(404).json({ error: 'Apprentice not found' }); 
        }
        console.log('Apprentice encontrado', apprentice);
        res.json(apprentice);
    } catch (error) {
        console.log('Error al listar apprentice por ID', error);
        res.status(500).json({ error: 'Error al listar apprentice por ID' }); 
    }
},

listapprenticebyfiche: async (req, res) => {
    const { idfiche } = req.params;
    try {
        console.log('ID de ficha recibido:', idfiche);
        if (!mongoose.Types.ObjectId.isValid(idfiche)) {
            return res.status(400).json({ message: 'ID de ficha inválido' });
        }
        const apprentices = await Apprentice.find({ "fiche.idFiche": idfiche });
        if (apprentices.length === 0) {
            return res.status(404).json({ message: 'No se encontraron aprendices para esta ficha' });
        }
        res.status(200).json({ apprentices });
    } catch (error) {
        console.error('Error al listar aprendices por ID de ficha:', error);
        res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
},
//Listar por Estado
listapprenticebystatus: async (req, res) => {
    const { status } = req.params;

    try {
        const statusNumber = Number(status);
        const apprentices = await Apprentice.find({ status: statusNumber });
        if (apprentices.length === 0) {
            return res.status(404).json({ message: `No hay datos para el estado: ${status}` });
        }
        res.json({ apprentices });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
},


// Listar aprendices por modalidad
listapprenticebymodality: async (req, res) => {
  const { idModality } = req.params;
  try {
      if (!mongoose.Types.ObjectId.isValid(idModality)) {
          return res.status(400).json({ message: 'ID de modalidad inválido' });
      }
      const apprentices = await Apprentice.find({ idModality });
      if (apprentices.length === 0) {
          return res.status(404).json({ message: 'No se encontraron aprendices para esta modalidad' });
      }
      res.status(200).json(apprentices);
  } catch (error) {
      console.error('Error al listar aprendices por modalidad:', error);
      res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
},

//listar historial del aprendiz
listHistoryApprentice: async (req, res) => {
    const { numDocument } = req.params;
    try {
        console.log("Número de documento recibido", numDocument);
        const apprentices = await Apprentice.find({ numDocument });
        if (apprentices.length === 0) {
            return res.status(404).json({ message: 'No se encontraron aprendices para este número de documento' });
        }
        const registerIds = apprentices.map(apprentice => apprentice._id);
        const registers = await Register.find({ idApprentice: { $in: registerIds } }).populate('idModality');

        if (registers.length === 0) {
            return res.status(404).json({ message: 'No se encontraron registros asociados a estos aprendices.' });
        }
        const binnacles = await Binnacles.find({ register: { $in: registers.map(register => register._id) } }).sort({ createdAt: -1 });
        const followups = await Followup.find({ register: { $in: registers.map(register => register._id) } }).sort({ createdAt: -1 });
        res.status(200).json({
            message: 'Historial del aprendiz',
            data: {
                apprentices,
                registers,
                binnacles,
                followups,
            },
            counts: {
                registers: registers.length,
                binnacles: binnacles.length,
                followups: followups.length,
            }
        });
    } catch (error) {
        console.error('Error al listar el historial del Aprendiz', error);
        res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
},


listBitacorasAndFollowup: async (req, res) => {
    const { id } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'El ID proporcionado no es válido.' });
        }
        const registers = await Register.find({ idApprentice: new mongoose.Types.ObjectId(id) })
            .populate('idModality');
        
        if (registers.length === 0) {
            return res.status(404).json({ message: 'No se encontraron registros para este aprendiz.' });
        }
        const registerIds = registers.map(register => register._id);
        const binnacles = await Binnacles.find({ register: { $in: registerIds } }).sort({ createdAt: -1 });
        const followups = await Followup.find({ register: { $in: registerIds } }).sort({ createdAt: -1 });
        return res.status(200).json({
            message: 'Consulta exitosa.',
            data: {
                registers,  
                binnacles,
                followups,
            },
            counts: {
                binnacles: binnacles.length,
                followups: followups.length,
            },
        });
    } catch (error) {
        console.error('Error al consultar bitácoras y seguimientos:', error);
        return res.status(500).json({ message: 'Error al consultar los datos.', error });
    }
},



// Login para aprendices -----------------------------------------------------
loginApprentice: async (req, res) => {
    const { email, numDocument } = req.body;
    try {
        const apprentice = await Apprentice.findOne({
            $or: [
                { institutionalEmail: email },
                { personalEmail: email }
            ]
        });
        if (!apprentice) {
            return res.status(401).json({ msg: "El email no está registrado." });
        }
        if (apprentice.status === 0) {
            return res.status(401).json({ msg: "El aprendiz está inactivo." });
        }
        if (apprentice.numDocument !== numDocument) {
            return res.status(401).json({ msg: "Número de documento no coincide." });
        }
        const token = await generarJWT(apprentice._id);
        res.json({ apprentice, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Hable con el WebMaster" });
    }
},

  
// Agregar nuevo aprendiz ----------------------------------------------------------------
addApprentice: async (req, res) => {
    const apprenticeData = req.body;
    try {
        const newApprentice = new Apprentice(apprenticeData);
        await newApprentice.save();

        const newRegister = new Register({
            idApprentice: newApprentice._id,
            idModality: apprenticeData.idModality
        });

        const preRegisterCreated = await newRegister.save();
  
        res.status(201).json({
            apprentice: newApprentice,
            register: preRegisterCreated
        });
        console.log("Aprendiz y pre-registro guardados exitosamente");
    } catch (error) {
        console.error("Error al agregar aprendiz:", error);
        if (error.code === 11000) {
            return res.status(400).json({ message: "Email, teléfono o documento ya registrado" });
        }
        res.status(400).json({ message: error.message });
    }
  },

// actualizar--------------------------------------------------------------------------
updateapprenticebyid: async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'ID de aprendiz inválido' });
        }
        // Construir el objeto de actualización
        const updateFields = {};
        for (const key in updateData) {
            if (key === 'fiche') {
                for (const ficheKey in updateData.fiche) {
                    updateFields[`fiche.${ficheKey}`] = updateData.fiche[ficheKey];
                }
            } else {
                updateFields[key] = updateData[key];
            }
        }
        const updatedApprentice = await Apprentice.findByIdAndUpdate(
            id,
            { $set: updateFields },
            { new: true, runValidators: true }
        );

        if (!updatedApprentice) {
            return res.status(404).json({ message: 'Aprendiz no encontrado' });
        }
        console.log("Aprendiz actualizado:", updatedApprentice);
        res.status(200).json(updatedApprentice);
    } catch (error) {
        console.error("Error al actualizar aprendiz:", error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Error de validación', errors: error.errors });
        }
        res.status(500).json({ message: "Error interno del servidor al actualizar aprendiz" });
    }
},

// actualizar ESTADO----------------------------------------------------------------
updateStatus: async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        // Verificar que el aprendiz existe
        const apprentice = await Apprentice.findById(id);
        if (!apprentice) {
            return res.status(404).json({ message: 'Aprendiz no encontrado' });
        }

        // Validar que el estado es válido (de 2 a 4)
        const validStatuses = [2, 3, 4];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Estado inválido. El estado debe estar entre 2 y 4.' });
        }

        // Buscar el registro del aprendiz
        const register = await Register.findOne({ idApprentice: apprentice._id });
        if (!register) {
            return res.status(404).json({ message: 'Registro no encontrado para el aprendiz' });
        }

        // Si el estado es 3, verificar las condiciones adicionales
        const today = new Date();
        const totalHoursExecuted = register.hourFollowupExcuted + register.businessProyectHourExcuted + register.productiveProjectHourExcuted;

        if (status === 3) {
            // Asignar estado 3 si las horas ejecutadas son 864 o más y la fecha de finalización ha pasado
            if (register.endDate < today && totalHoursExecuted >= 864) {
                apprentice.status = 3;  
            } else {
                return res.status(400).json({ message: 'El aprendiz no cumple con los requisitos para el estado 3.' });
            }
        }

        // Si el estado es 4, verificar que el aprendiz esté en estado 3 y tenga los documentos necesarios
        if (status === 4) {
            if (apprentice.status !== 3) {
                return res.status(400).json({ message: 'El aprendiz debe estar en estado "Finalizado" para ser certificado.' });
            }
            if (!register.certificationDoc || !register.docAlternative) {
                return res.status(400).json({ message: 'Faltan documentos para certificar al aprendiz.' });
            }
            apprentice.status = 4;  
        }

        // Si el estado es 2, se asigna directamente sin restricciones adicionales
        if (status === 2) {
            apprentice.status = 2;  
        }

        // Guardar el cambio de estado
        const updatedApprentice = await apprentice.save();
        res.json({ message: 'Estado actualizado correctamente', updatedApprentice });

    } catch (error) {
        console.error("Error al actualizar el estado del aprendiz", error);
        res.status(500).json({ error: 'Error al actualizar el estado del aprendiz' });
    }
},



// activar
enableapprentice: async (req, res) => {
    const { id } = req.params;
    try {
        const apprentice = await Apprentice.findById(id); 
        if (!apprentice) {
            return res.status(404).json({ error: 'Aprendiz no encontrado' });
        }
        if (apprentice.status === 1) {
            return res.status(400).json({ message: 'El aprendiz ya está activo' });
        }
        apprentice.status = 1;
        await apprentice.save(); 

        res.json({ message: 'Aprendiz activado correctamente', apprentice });
    } catch (error) {
        console.log("Error al activar aprendiz:", error);
        res.status(500).json({ error: 'Error al activar aprendiz' });
    }
},

// desactivar----------------------------------------------------------------
disableapprentice: async (req, res) => {
    const { id } = req.params;
    try {
        const apprentice = await Apprentice.findById(id); 

        if (!apprentice) {
            return res.status(404).json({ error: 'Aprendiz no encontrado' });
        }
        if (apprentice.status === 0) {
            return res.status(400).json({ message: 'El aprendiz ya está inactivo' });
        }
        apprentice.status = 0; 
        await apprentice.save(); 
        res.json({ message: 'Aprendiz desactivado correctamente', apprentice });
    } catch (error) {
        console.log("Error al desactivar aprendiz:", error);
        res.status(500).json({ error: 'Error al desactivar aprendiz' });
    }
},


uploadApprentices: async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No se ha enviado ningún archivo' });
        }
        const workbook = xlsx.read(req.file.buffer);
        const sheetName = workbook.SheetNames[0]; 
        const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]); 
        const errors = [];
        for (const row of sheetData) {
            const cleanedRow = Object.fromEntries(
                Object.entries(row).map(([key, value]) => [key.trim(), value])
            );
            const fiche = {
                idFiche: cleanedRow.fiche, 
                name: cleanedRow['Fiche Name'],
                number: cleanedRow['Fiche Number']
            };
            const {
                tpDocument,
                numDocument,
                firstName,
                lastName,
                phone,
                institutionalEmail,
                personalEmail
            } = cleanedRow;
            // Verificación de los datos
            console.log('Row data:', cleanedRow);
            try {
                await Apprentice.create({
                    fiche,
                    idModality: cleanedRow['Modality ID'],
                    tpDocument,
                    numDocument,
                    firstName,
                    lastName,
                    phone,
                    institutionalEmail,
                    personalEmail,
                    status: 1, 
                });
            } catch (err) {
                errors.push({ row: cleanedRow, error: err.message });
            }
        }
        if (errors.length > 0) {
            return res.status(207).json({
                message: 'Algunos registros no pudieron ser procesados',
                errors,
            });
        }
        res.status(201).json({ message: 'Aprendices creados exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al procesar el archivo', error: error.message });
    }
}


}
export default controllerApprentice;