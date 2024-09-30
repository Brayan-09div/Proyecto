import Apprentice from '../models/apprentice.js'

const  controllerApprentice ={
    // listar todos los aprendices ---------------------------------------------------
listtheapprentice : async (req , res) => {
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
listtheapprenticebyid: async (res, req)=>{
 const {id} = req.paramas;
    try {
         const apprentice = await Apprentice.findById(id)
         if(!apprentice){
            return res.status(404).json({error:'apprentice not found'})
         }
         console.log('apprentice enconmtrado',apprentice)
         res.json(apprentice)
    } catch (error) {
        console.log('Error al listar apprentice por id', error);
        res.status(500).json({error:'Error al listar apprentice por id'})
        
    }
   
},

// listar por ficha------------------------------------------------------------------
listtheapprenticebyficheid: async (req, res) => {
    const { fiche } = req.params; 
    try {
      const apprentice = await Apprentice.find({ fiche });
      console.log(`lista de fiche en apprentice ${fiche}`);
      res.json(apprentice); 
    } catch (error) {
      console.log(`Error al listar fiche en apprentice ${fiche}`, error);
      res.status(500).json({ error: `Error al listar fiche en apprentice ${fiche}` });
    }
  },
  
//Listar por Estado

listApprenticeByStatus: async (req, res) => {
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

// insertar por aprendiz--------------------------------------------------------------
inserttheapprentice: async (req, res) => {
    console.log('Iniciando inserttheapprentice');
    console.log('req.body:', req.body);
    const { tpDocument, numdocument, firname, lasname, phone, email, fiche } = req.body;
    try {
        // Verificar que los campos existen y no son undefined
        if (!tpDocument || !numdocument || !firname || !lasname || !phone || !email || !fiche) {
            return res.status(400).json({ error: 'Faltan campos obligatorios' });
        }
        
        console.log('Creando nuevo Apprentice');
        const apprentice = new Apprentice({ 
            tpDocument, 
            numdocument, 
            firname, 
            lasname, 
            phone, 
            email, 
            fiche 
        });
        console.log('Apprentice creado:', apprentice);

        const result = await apprentice.save();
        console.log('Aprendiz guardado:', result);

        res.status(201).json({ message: 'Aprendiz guardado exitosamente', apprentice: result });
    } catch (error) {
        console.error('Error al insertar aprendiz:', error);
        res.status(500).json({ error: 'Error al insertar aprendiz', details: error.message });
    }
},


// actualizar--------------------------------------------------------------------------

updateapprenticebyid: async (req, res) => {
        const { id } = req.params;
        try {
          const updatedApprentice = await Followup.findByIdAndUpdate(id, req.body, { new: true });
      
          if (!updatedApprentice) {
            return res.status(404).json({ error: 'Apprentice not found' });
          }
      
          console.log("Apprentice updated:", updatedApprentice);
          res.json(updatedApprentice);
        } catch (error) {
          console.error("Error updating apprentice:", error);
          res.status(500).json({ error: "Error updating appentice" });
        }

},
// activar
enableapprenticeStatus: async (req, res)=>{
    const {id} = req.params
    try {

        const apprentice = await Apprentice.findByIdAndUpdate(id,{status:1}, {new:true})
        if (!apprentice) {
            return res.status(404).json({ error: 'apprentice no encontrado' })
        }
        res.json({ message });
    } catch (error) {
        console.log("Error al activar apprentice");
        res.status(500).json({error:`activar apprentice`} )
    }  
    },
// desactivar----------------------------------------------------------------
disableapprenticeStatus: async (res, req) => {
    const { id } = req.paramas
    try {
        const apprentice = await Apprentice.findByIdAndUpdate(id,{status:0}, {new:true})

        if (!apprentice) {
            return res.status(404).json({ error: 'apprentice no encontrado' })
        }
        res.json({ message });
    } catch (error) {
        console.log("Error al desactivar / activar apprentice");
        res.status(500).json({error:`Error al desactivar / activar apprentice`} )
    }
}
}
export default controllerApprentice;