import Apprentice from '../models/apprentice.js'
import Register from "../models/register.js";
import { generarJWT } from "../middleware/validate-apprentice.js";
import mongoose from 'mongoose';


const  controllerApprentice ={
 // listar todos los aprendices ---------------------------------------------------
listallapprentice : async (req , res) => {
try {
    const apprentice = await Apprentice.find();
    console.log('lista de appenteci', apprentice)
    res.json(apprentice)
} catch (error) {
    console.log('Error al listar apprentice')
    res.status(500).json({error: 'Error al listar apprentice'})   
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

updateStatus: async (req, res) =>{
    const {id} = req.params;
    const {status} = req.body;
     try {
        const apprentice = await Apprentice.findById(id);

        if(!apprentice){
            return res.status(404).json({massage: 'Aprendiz no encontrado'});
        }
        const statusNumber = [0, 1, 2, 3, 4]

        if (!statusNumber.includes(status)) {
            return res.status(400).json({message: 'Estado inválido'});
        } 
        if(apprentice.status > 4 ){
            return res.status(400).json({message:'EL status no puede ser mayor a 4'})
        }
        
        const statusApprentice = await Apprentice.findByIdAndUpdate(id, {status}, {new: true});
        res.json({message: 'Estado actualizado correctamente', statusApprentice});
       
     
     } catch (error) {
        console.log("Error al actualizar el estado del aprendiz", error);
        res.status(500).json({error: 'Error al actualizar el estado del aprendiz'});
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
}

}
export default controllerApprentice;