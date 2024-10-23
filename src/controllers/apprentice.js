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

// listar por ficha------------------------------------------------------------------
listapprenticebyfiche: async (req, res) => {
    const { idfiche } = req.params;
    try {
      console.log('ID de ficha recibido:', idfiche);
      if (!mongoose.Types.ObjectId.isValid(idfiche)) {
        return res.status(400).json({ message: 'ID de ficha inválido' });
      }
      const ficheObjectId = new mongoose.Types.ObjectId(idfiche);  
      const apprentices = await Apprentice.find({ "fiche.idFiche": ficheObjectId });
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
        // const aprendicesActivos = await Apprentice.find(status);
        if (status !== '0' && status !== '1') {
            return res.status(404).json({ message: 'Estado invalido' });
        } else if (status == 1) {
            const apprennticeActive = await Apprentice.find({status: 1});
            res.json({ apprennticeActive });
        } else {
            const apprenticeInactive = await Apprentice.find({status: 0});
            res.json({ apprenticeInactive});
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
},



// Login para aprendices
loginApprentice: async (req, res) => {
    const { email, numDocument } = req.body;
    try {
      const apprentice = await Apprentice.findOne({ email });
    
      if (!apprentice || apprentice.estado === 0 || apprentice.numDocument !== numDocument) {
        return res.status(401).json({ msg: "Apprentice / Documento no son correctos" });
      }
      const token = await generarJWT(apprentice._id);
      res.json({ apprentice, token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "Hable con el WebMaster" });
    }
  },


// insertar por aprendiz--------------------------------------------------------------
addapprentice: async (req, res) => {
    const aprendice = req.body;
    try {
        const newApprentice = new Apprentice(aprendice);
          await newApprentice.save();
       
        const newRegister = new Register({
            idApprentice: newApprentice._id,

            idModality: aprendice.modality
        });

        const preRegisterCreated = await newRegister.save();
        res.status(201).json({
            apprentice: newApprentice,
            register: preRegisterCreated
        });
        console.log("Aprendiz y pre-registro guardados exitosamente");
    } catch (error) {
        res.status(400).json({ message: error.message });  
}
},

// actualizar--------------------------------------------------------------------------
updateapprenticebyid: async (req, res) => {
    const { id } = req.params;
    const updateData = req.body
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'ID de aprendiz inválido' });
      }
      const updatedApprentice = await Apprentice.findByIdAndUpdate(
        id,
        updateData,
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