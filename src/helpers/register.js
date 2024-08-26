import Register from '../models/register.js'

const registerHelper = {

    existResgister: async (id) => {
        try {
            const exist = await Register.findById(id)
            if (!exist){
                throw new Error(`Ya existe el ID:${id}`)
            }
            return exist
        } catch (error) {
            throw new Error(`Error al verificar el ID:${error.message}`)
        }
    },
    existAddressCompany: async (adressCompany) => {
        try {
            const existe = await Register.findOne({ adressCompany });
            if (existe) {
                throw new Error(`Ya existe ese AdressCompany en la base de datos: ${adres}`);
            }
        } catch (error) {
            throw new Error(`Error al verificar AdressCompany: ${error.message}`);
        }
    },

    verifyAdressCompany: async (adressCompany)=>{
        try {
            const exist = await  Register.findOne({adressCompany})
            if(!exist){
                throw new Error(`El adressCompany ${adressCompany} no esta registrado`)
            }
            return exist
        } catch (error) {
            throw new Error(`Error al verificar adressCompany ${error.message}`)
        }
    },

    existPhoneCompany: async (phoneCompany) => {
        try {
            const exist = await Register.findOne({ phoneCompany })
            if (exist) {
                throw new Error(`Ya existe phoneCompany en la base de datos:${phoneCompany}`)
            }
        } catch (error) {
            throw new Error(`Error al verificar el phoneCompany: ${error.message}`)
        }
    },

    verifyAdressCompany: async (phoneCompany)=>{
        try {
            const exist = await  Register.findOne({phoneCompany})
            if(!exist){
                throw new Error(`El phoneCompany ${phoneCompany} no esta registrado`)
            }
            return exist
        } catch (error) {
            throw new Error(`Error al verificar phoneCompany ${error.message}`)
        }
    },
}

export { registerHelper };