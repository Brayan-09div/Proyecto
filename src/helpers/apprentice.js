import Apprentice from '../models/register'

const registerHelper = {
    existApprentice: async (id) => {
        try {
            const exist = await Apprentice.findById(id)
            if (!exist) {
                throw new Error(`Ya existe el ID:${id}`)
            }
            return exist
        } catch (error) {
            throw new Error(`Error al verificar el ID:${error.message}`)
        }
    },
    existNumDocument: async (numDocument) => {
        try {
            const existe = await Fiche.findOne({ numDocument });
            if (existe) {
                throw new Error(`Ya existe el numDocument en la base de datos: ${numDocument}`);
            }
        } catch (error) {
            throw new Error(`Error al verificar numDocument: ${error.message}`);
        }
    },

    verifyNumDocument: async (numDocument)=>{
        try {
            const exist = await  Apprentice.findOne({numDocument})
            if(!exist){
                throw new Error(`El numDocument ${numDocument} no esta registrado`)
            }
            return exist
        } catch (error) {
            throw new Error(`Error al verificar numDocument ${error.message}`)
        }
    },


    existEmail: async (email) => {
        try {
            const exist = await Fiche.findOne({ email })
            if (exist) {
                throw new Error(`Ya existe email en la base de datos: ${email}`)
            }
        } catch (error) {
            throw new Error(`Error al verificar el Email: ${error.message}`)
        }
    },

    verifyEmail: async (email)=>{
        try {
            const exist = await  Apprentice.findOne({email})
            if(!exist){
                throw new Error(`El Email ${email} no esta registrado`)
            }
            return exist
        } catch (error) {
            throw new Error(`Error al verificar Email ${error.message}`)
        }
    },

    existPhone: async (phone) => {
        try {
            const exist = await Fiche.findOne({ phone })
            if (exist) {
                throw new Error(`Ya existe phone en la base de datos: ${phone}`)
            }
        } catch (error) {
            throw new Error(`Error al verificar el phone: ${error.message}`)
        }
    },

    verifyPhone: async (phone)=>{
        try {
            const exist = await  Apprentice.findOne({phone})
            if(!exist){
                throw new Error(`El phone ${phone} no esta registrado`)
            }
            return exist
        } catch (error) {
            throw new Error(`Error al verificar phone ${error.message}`)
        }
    },

}

export { registerHelper };