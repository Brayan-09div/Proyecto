import Apprentice from '../routes/apprentice.js'

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
listtheapprenticebyid: async (res, req) => {
const {fiche} = req.paramas;
try {
    const apprentice = await Apprentice.find({fiche : fiche})
     console.log(`lista de fiche en apprentice ${fiche}`);
     req.json(apprentice)
    
} catch (error) {
    console.log(`Error al listar fiche en apprentice ${fiche}`, error)
    res.status(500).json({error:` Error al listar fiche en apprentice ${fiche}`})
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
inserttheapprentice: async (res, req) =>{
 const {tpdocument, numrDocument, firstname, lastname, phone, email, fiche } = req.body
try {
   
    const apprentice =  new Apprentice({tpdocument, numrDocument, firstname, lastname, phone, email, fiche})
    const result =  await apprentice.save()
        console.log('apprentice saved', result)
        res.json('apprentice saved', result)
} catch (error) {
    console.log('Error al insertapprentice', error)
    res.status(500).json({error: 'Error al insertapprentice' })    
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
// activar// desactivar----------------------------------------------------------------
activateAndDesactiveapprentice: async (res, req) => {
    const { id } = req.paramas
    try {
        const apprentice = await Apprentice.findById(id)

        if (!apprentice) {
            return res.status(404).json({ error: 'apprentice no encontrado' })
        }

        apprentice.status = apprentice.status === 1 ? 0 : 1;
        await apprentice.save();

        const messages = apprentice.status === 1 ? "apprentice active" : "apprentive inactive"
        res.json({ messages })
    } catch (error) {
        console.log("Error al desactivar / activar apprentice");
        res.status(500).json({error:`Error al desactivar / activar apprentice`} )
    }
}
}
export default controllerApprentice;